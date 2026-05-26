const { addMarketPrice, listCropPrices, listMarketPrices } = require('../../src/lib/supabase');
const { scrapeMarketSources } = require('../../src/services/scrapers');
const { parseBody, ok, created, badRequest, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod === 'GET') {
      const crop = event.queryStringParameters?.crop;
      const country = event.queryStringParameters?.country;
      const state_province = event.queryStringParameters?.state || event.queryStringParameters?.state_province;
      const prices = crop ? await listCropPrices(crop) : await listMarketPrices({ crop, country, state_province });
      return ok({ prices });
    }
    if (event.httpMethod === 'POST') {
      const body = parseBody(event);
      if (!body.crop || !body.market_name || !body.price_per_kg) return badRequest('crop, market_name and price_per_kg are required');
      const price = await addMarketPrice(body);
      return created({ price });
    }
    return methodNotAllowed();
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };

async function scrapeHandler() {
  const inserted = await scrapeMarketSources();
  return { inserted: inserted.length };
}

module.exports.scrapeHandler = scrapeHandler;