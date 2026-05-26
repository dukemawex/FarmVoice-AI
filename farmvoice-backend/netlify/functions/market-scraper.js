const { scrapeMarketSources } = require('../../src/services/scrapers');

async function handler() {
  const inserted = await scrapeMarketSources();
  return {
    statusCode: 200,
    body: JSON.stringify({ inserted: inserted.length })
  };
}

module.exports = { handler };