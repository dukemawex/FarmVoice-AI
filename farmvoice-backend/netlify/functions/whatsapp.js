const twilio = require('twilio');
const { getEnv } = require('../../src/lib/env');
const { findFarmerByLookup, upsertFarmerProfile } = require('../../src/lib/supabase');
const { chatPipeline } = require('../../src/services/chatPipeline');
const { classifyLanguage } = require('../../src/lib/ai');
const { parseBody, text, forbidden, ok, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'POST') return methodNotAllowed();

    const authToken = getEnv('TWILIO_AUTH_TOKEN');
    const requestUrl = getEnv('TWILIO_WEBHOOK_URL') || `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}${event.path}`;
    const signature = event.headers['x-twilio-signature'] || event.headers['X-Twilio-Signature'];
    const body = event.body || '';

    if (authToken && signature) {
      const valid = twilio.validateRequest(authToken, signature, requestUrl, parseBody(event));
      if (!valid) return forbidden('Invalid Twilio signature');
    }

    const payload = parseBody(event);
    const from = String(payload.From || payload.from || '').trim();
    const message = String(payload.Body || payload.body || '').trim();
    const numMedia = Number(payload.NumMedia || payload.num_media || 0);
    const mediaUrl = numMedia > 0 ? payload.MediaUrl0 || payload.media_url || null : null;

    if (!from) return forbidden('Missing sender');

    const whatsappId = from.replace(/^whatsapp:/i, '');
    let farmer = await findFarmerByLookup({ whatsapp_id: whatsappId });
    if (!farmer) {
      farmer = await upsertFarmerProfile({
        whatsapp_id: whatsappId,
        phone: whatsappId,
        full_name: null,
        language: 'en',
        country: null,
        primary_crops: [],
        farm_size_hectares: null,
        channel: 'whatsapp'
      });
    }

    const language = farmer.language || (message ? await classifyLanguage(message) : 'en');
    const result = await chatPipeline({
      farmer_id: farmer.id,
      message: message || 'Please analyze this photo and advise me.',
      language,
      channel: 'whatsapp',
      whatsapp_id: whatsappId,
      media_url: mediaUrl
    });

    const client = twilio(getEnv('TWILIO_SID'), getEnv('TWILIO_AUTH_TOKEN'));
    await client.messages.create({
      from: getEnv('TWILIO_WHATSAPP_NUMBER'),
      to: `whatsapp:${whatsappId}`,
      body: result.reply
    });

    return text(200, '<Response></Response>');
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };