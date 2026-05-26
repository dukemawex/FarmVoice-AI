const { chatPipeline } = require('../../src/services/chatPipeline');
const { parseBody, ok, badRequest, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'POST') return methodNotAllowed();
    const body = parseBody(event);
    if (!body.message && !body.media_url) return badRequest('message or media_url is required');

    const result = await chatPipeline({
      farmer_id: body.farmer_id,
      conversation_id: body.conversation_id,
      session_id: body.session_id,
      message: body.message || '',
      language: body.language,
      channel: body.channel || 'web',
      phone: body.phone,
      whatsapp_id: body.whatsapp_id,
      media_url: body.media_url
    });

    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };