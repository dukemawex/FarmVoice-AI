const { fetchWeatherByCoords } = require('../../src/lib/weather');
const { generateWeatherAdvisory } = require('../../src/lib/ai');
const { ok, methodNotAllowed, badRequest, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'GET') return methodNotAllowed();
    const lat = Number(event.path.split('/').slice(-2)[0] || event.queryStringParameters?.lat);
    const lng = Number(event.path.split('/').slice(-1)[0] || event.queryStringParameters?.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return badRequest('lat and lng are required');
    const forecast = await fetchWeatherByCoords(lat, lng);
    const advisory = await generateWeatherAdvisory(forecast);
    return ok({ forecast, advisory });
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };