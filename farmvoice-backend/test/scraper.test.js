const { normalizeFeedEntry } = require('../src/services/scrapers');

describe('market scraper helpers', () => {
  test('normalizeFeedEntry fills required fields', () => {
    const row = normalizeFeedEntry({ crop: 'maize', market: 'Kano central', price: '350', currency_code: '₦' }, 'AFEX Nigeria', 'Nigeria');
    expect(row.crop).toBe('maize');
    expect(row.market_name).toBe('Kano central');
    expect(row.country).toBe('Nigeria');
    expect(row.price_per_kg).toBe(350);
  });
});