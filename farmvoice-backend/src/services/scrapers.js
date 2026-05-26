const axios = require('axios');
const { addAdvisory, addMarketPrice } = require('../lib/supabase');
const { getEnv } = require('../lib/env');

function normalizeFeedEntry(entry, source, defaultCountry) {
  return {
    crop: entry.crop || entry.commodity || entry.product || 'general',
    market_name: entry.market_name || entry.market || entry.location || 'Unknown market',
    country: entry.country || defaultCountry || 'Unknown',
    state_province: entry.state_province || entry.state || entry.region || null,
    price_per_kg: Number(entry.price_per_kg || entry.price || entry.value || 0),
    currency: entry.currency || entry.currency_code || '₦',
    price_date: entry.price_date || new Date().toISOString().slice(0, 10),
    source
  };
}

async function fetchJson(url) {
  const { data } = await axios.get(url, { timeout: 20000 });
  return data;
}

async function scrapeMarketSources() {
  const sources = [
    { env: 'AFEX_MARKET_API_URL', source: 'AFEX Nigeria', country: 'Nigeria' },
    { env: 'EAGC_MARKET_API_URL', source: 'EAGC Kenya', country: 'Kenya' },
    { env: 'GHANA_SRID_MARKET_API_URL', source: 'Ghana SRID', country: 'Ghana' }
  ];

  const results = [];
  for (const item of sources) {
    const url = getEnv(item.env);
    if (!url) continue;
    const payload = await fetchJson(url);
    const rows = Array.isArray(payload) ? payload : payload.data || payload.results || [];
    for (const row of rows) {
      results.push(await addMarketPrice(normalizeFeedEntry(row, item.source, item.country)));
    }
  }
  return results;
}

async function scrapeAdvisoryFeeds() {
  const feeds = [getEnv('FAO_GIEWS_RSS_URL'), getEnv('FEWS_NET_RSS_URL')].filter(Boolean);
  const inserted = [];
  for (const feed of feeds) {
    const payload = await fetchJson(feed);
    const items = Array.isArray(payload) ? payload : payload.items || payload.data || [];
    for (const item of items.slice(0, 50)) {
      inserted.push(await addAdvisory({
        title: item.title || item.headline || 'Agricultural advisory',
        content: item.content || item.summary || item.description || '',
        crop: item.crop || item.commodity || null,
        country: item.country || null,
        season: item.season || null,
        advisory_type: item.advisory_type || 'weather',
        valid_from: item.valid_from || new Date().toISOString().slice(0, 10),
        valid_until: item.valid_until || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        source: feed
      }));
    }
  }
  return inserted;
}

module.exports = { scrapeMarketSources, scrapeAdvisoryFeeds };
module.exports.normalizeFeedEntry = normalizeFeedEntry;