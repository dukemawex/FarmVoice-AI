const { normalizeLanguage } = require('./language');

const intentRules = [
  ['pest_query', /pest|armyworm|caterpillar|insect|borer|weevil|aphid/i],
  ['disease_query', /disease|blight|rot|fungus|fungal|virus|mildew|yellow leaves/i],
  ['market_query', /price|market|sell|bought|buying|cost|worth/i],
  ['weather_query', /rain|weather|storm|flood|heat|forecast|dry spell/i],
  ['loan_query', /loan|credit|finance|borrow|microfinance|funding/i],
  ['planting_advice', /plant|sow|seed|fertilizer|irrigation|transplant|spacing/i]
];

function detectIntent(text = '') {
  const value = String(text);
  for (const [intent, pattern] of intentRules) {
    if (pattern.test(value)) return intent;
  }
  return 'general';
}

function detectLanguageFromText(text = '') {
  const value = String(text).toLowerCase();
  if (/[ƙɓɗ]/.test(value) || /sannu|noma|gonar|shuka|ruwa|magani/.test(value)) return 'ha';
  if (/omo|agbe|irugbin|ogbin|ile|owo/.test(value)) return 'yo';
  if (/shamba|mvua|mbolea|ugonjwa|zao/.test(value)) return 'sw';
  if (/prix|march[eé]|agricole|maladie|pluie/.test(value)) return 'fr';
  return 'en';
}

function normalizeChatLanguage(language, text = '') {
  return normalizeLanguage(language) || detectLanguageFromText(text);
}

module.exports = { detectIntent, detectLanguageFromText, normalizeChatLanguage };