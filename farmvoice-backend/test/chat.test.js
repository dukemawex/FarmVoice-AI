const { buildSystemPrompt } = require('../src/lib/ai');
const { detectIntent } = require('../src/lib/intents');

describe('chat helpers', () => {
  test('detectIntent recognises market questions', () => {
    expect(detectIntent('What is the tomato market price today?')).toBe('market_query');
  });

  test('buildSystemPrompt includes farmer context', () => {
    const prompt = buildSystemPrompt({
      language: 'ha',
      farmer: { full_name: 'Amina', state_province: 'Kano', country: 'Nigeria', primary_crops: ['maize'], farm_size_hectares: 2 },
      weather: { current: { temp_c: 34, summary: 'sunny', rain_probability: 10 } },
      marketPrices: [{ crop: 'maize', market_name: 'Kano Central', currency: '₦', price_per_kg: 350, country: 'Nigeria' }],
      advisories: [{ title: 'Armyworm watch', crop: 'maize', advisory_type: 'pest' }],
      loans: [{ provider_name: 'BOA', product_name: 'Farm Loan', currency: '₦', min_amount: 50000, max_amount: 2000000, interest_rate: 8, tenure_months: 12 }]
    });

    expect(prompt).toContain('Amina');
    expect(prompt).toContain('Kano');
    expect(prompt).toContain('Nigeria');
    expect(prompt).toContain('maize');
  });
});