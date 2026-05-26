const { findFarmerByLookup, upsertFarmerProfile } = require('../../src/lib/supabase');
const { parseBody, ok, created, badRequest, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'POST') return methodNotAllowed();
    const body = parseBody(event);

    if (event.path && event.path.endsWith('/login')) {
      const lookup = body.phone || body.whatsapp_id ? { phone: body.phone, whatsapp_id: body.whatsapp_id } : null;
      if (!lookup) return badRequest('phone or whatsapp_id is required');
      const farmer = await findFarmerByLookup(lookup);
      return ok({ farmer });
    }

    if (event.path && event.path.endsWith('/register') || !event.path) {
      const farmer = await upsertFarmerProfile({
        full_name: body.name || body.full_name,
        phone: body.phone,
        country: body.country,
        language: body.language,
        primary_crops: Array.isArray(body.crops) ? body.crops : String(body.crops || '').split(',').map((item) => item.trim()).filter(Boolean),
        farm_size_hectares: Number(body.farm_size || body.farm_size_hectares || 0),
        channel: body.channel || 'web'
      });
      return created({ farmer });
    }

    return badRequest('Unsupported auth action');
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };