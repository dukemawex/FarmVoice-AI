const nlp = require('compromise');
const axios = require('axios');
const { getEnv } = require('./env');
const { normalizeLanguage } = require('./language');

const openrouterModel = getEnv('OPENROUTER_MODEL', 'nvidia/nemotron-3-super-120b-a12b:free');

async function openRouterChat(messages, { system, max_tokens = 500, temperature = 0.2 } = {}) {
  const apiKey = getEnv('OPENROUTER_API_KEY');
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required');
  }

  const payload = {
    model: openrouterModel,
    messages: system ? [{ role: 'system', content: system }, ...messages] : messages,
    max_tokens,
    temperature
  };

  const { data } = await axios.post('https://openrouter.ai/api/v1/chat/completions', payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': getEnv('OPENROUTER_APP_URL', 'https://farmvoice.ai'),
      'X-Title': getEnv('OPENROUTER_APP_NAME', 'FarmVoice AI')
    },
    timeout: 30000
  });

  return data?.choices?.[0]?.message?.content || '';
}

function safeText(value) {
  return value == null ? '' : String(value).trim();
}

function summarizeWeather(weather) {
  if (!weather) return 'No live weather data available.';
  const current = weather.current || {};
  const parts = [
    `${current.temp_c ?? 'N/A'}°C`,
    safeText(current.summary),
    current.rain_probability != null ? `rain chance ${current.rain_probability}%` : ''
  ].filter(Boolean);
  return parts.join(', ');
}

function summarizeMarketPrices(prices = []) {
  if (!prices.length) return 'No live market prices available.';
  return prices
    .slice(0, 5)
    .map((price) => `${price.crop} at ${price.market_name}: ${price.currency}${price.price_per_kg}/kg (${price.state_province || price.country})`)
    .join('; ');
}

function summarizeAdvisories(advisories = []) {
  if (!advisories.length) return 'No active advisories right now.';
  return advisories
    .slice(0, 5)
    .map((advisory) => `${advisory.title} for ${advisory.crop || 'general crops'} (${advisory.advisory_type})`)
    .join('; ');
}

function summarizeLoans(loans = []) {
  if (!loans.length) return 'No loan products available.';
  return loans
    .slice(0, 5)
    .map((loan) => `${loan.provider_name} ${loan.product_name}: ${loan.currency}${loan.min_amount}-${loan.currency}${loan.max_amount}, ${loan.interest_rate}% over ${loan.tenure_months} months`)
    .join('; ');
}

function buildSystemPrompt({ language, farmer, weather, marketPrices, advisories, loans }) {
  const crops = (farmer?.primary_crops || []).join(', ') || 'unknown crops';
  return [
    `You are FarmVoice, an expert agricultural extension officer serving smallholder farmers in Africa. You speak ${normalizeLanguage(language)}.`,
    `The farmer you are talking to is ${farmer?.full_name || 'a farmer'}, located in ${farmer?.state_province || 'their area'}, ${farmer?.country || 'their country'}.`,
    `They grow ${crops} on ${farmer?.farm_size_hectares || 'unknown'} hectares.`,
    `Current weather: ${summarizeWeather(weather)}.`,
    `Current market prices for their crops: ${summarizeMarketPrices(marketPrices)}.`,
    `Active advisories: ${summarizeAdvisories(advisories)}.`,
    `Loan products: ${summarizeLoans(loans)}.`,
    'Your role: provide expert, practical agronomic advice tailored to their specific context. Cover planting schedules, pest and disease identification and treatment, fertilizer application, irrigation, harvest timing, post-harvest storage, market prices and best time to sell, weather warnings, government input subsidies, and microfinance or loan options.',
    `Always respond in ${normalizeLanguage(language)}. Keep responses concise and practical. Use simple language and no jargon. When recommending products, always mention the cheapest locally available option. If you detect an urgent issue such as crop failure, disease outbreak, or flooding, escalate the tone and recommend immediate action. End each response with one follow-up question to understand their situation better.`
  ].join('\n\n');
}

function deriveEntities(text) {
  const doc = nlp(text || '');
  const crops = doc.nouns().out('array').slice(0, 5);
  const numbers = doc.values().toNumber().out('array');
  return { crops, numbers };
}

function extractJsonFromText(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function classifyLanguage(message) {
  const content = await openRouterChat(
    [{ role: 'user', content: `Classify this message into one language code only from en, ha, yo, sw, fr: ${message}` }],
    { max_tokens: 4, temperature: 0 }
  );
  return normalizeLanguage(String(content || 'en').trim().slice(0, 2));
}

async function generateAdvice({ language, farmer, weather, marketPrices, advisories, loans, history, message }) {
  const system = buildSystemPrompt({ language, farmer, weather, marketPrices, advisories, loans });
  const conversation = [
    ...history.map((item) => ({ role: item.role, content: item.content })),
    { role: 'user', content: message }
  ];

  const text = await openRouterChat(conversation, { system, max_tokens: 500, temperature: 0.2 });
  const entities = deriveEntities(message);
  const structured = extractJsonFromText(text);

  return {
    reply: structured?.reply || text,
    structured,
    entities
  };
}

async function generateWeatherAdvisory(weather) {
  const system = 'You are an agricultural weather analyst. Produce a concise farming advisory, one paragraph, under 80 words.';
  return openRouterChat([{ role: 'user', content: JSON.stringify(weather) }], { system, max_tokens: 120, temperature: 0.2 });
}

async function generateImageDiagnosis(imageUrl, context = {}) {
  let imageBlock;
  if (String(imageUrl || '').startsWith('data:')) {
    const match = String(imageUrl).match(/^data:([^;]+);base64,(.*)$/);
    if (match) {
      imageBlock = { type: 'image_url', image_url: { url: imageUrl } };
    }
  }
  if (!imageBlock) {
    imageBlock = { type: 'image_url', image_url: { url: imageUrl } };
  }

  return openRouterChat(
    [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Identify crop pests or diseases visible in this image and give practical treatment steps.' },
          imageBlock
        ]
      }
    ],
    { system: buildSystemPrompt(context), max_tokens: 400, temperature: 0.2 }
  );
}

module.exports = {
  buildSystemPrompt,
  classifyLanguage,
  generateAdvice,
  generateWeatherAdvisory,
  generateImageDiagnosis,
  openRouterChat,
  summarizeMarketPrices,
  summarizeAdvisories,
  summarizeLoans
};