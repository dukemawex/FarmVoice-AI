const axios = require('axios');
const { getEnv } = require('./env');

async function geocodeLocation(query) {
  const apiKey = getEnv('OPENWEATHERMAP_API_KEY');
  const trimmed = String(query || '').trim();
  if (!trimmed) return null;
  if (!apiKey) return null;

  const { data } = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: { q: trimmed, limit: 1, appid: apiKey },
    timeout: 15000
  });

  const first = Array.isArray(data) ? data[0] : null;
  if (!first) return null;
  return { lat: first.lat, lng: first.lon, name: first.name, country: first.country };
}

async function locationToWeatherQuery(farmer) {
  const parts = [farmer?.state_province, farmer?.country].filter(Boolean);
  return parts.join(', ');
}

module.exports = { geocodeLocation, locationToWeatherQuery };