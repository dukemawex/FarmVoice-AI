const { addAdvisory, listAdvisories } = require('../../src/lib/supabase');
const { scrapeAdvisoryFeeds } = require('../../src/services/scrapers');
const { parseBody, ok, created, badRequest, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod === 'GET') {
      const filters = {
        country: event.queryStringParameters?.country,
        crop: event.queryStringParameters?.crop,
        advisory_type: event.queryStringParameters?.type || event.queryStringParameters?.advisory_type
      };
      const advisories = await listAdvisories(filters);
      return ok({ advisories });
    }
    if (event.httpMethod === 'POST') {
      const body = parseBody(event);
      if (!body.title || !body.content) return badRequest('title and content are required');
      const advisory = await addAdvisory(body);
      return created({ advisory });
    }
    return methodNotAllowed();
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };

async function scrapeHandler() {
  const inserted = await scrapeAdvisoryFeeds();
  return { inserted: inserted.length };
}

module.exports.scrapeHandler = scrapeHandler;