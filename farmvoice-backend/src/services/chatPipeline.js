const { v4: uuidv4 } = require('uuid');
const { addMessage, createConversation, findConversation, findFarmerByLookup, listAdvisories, listConversationMessages, listLoans, listMarketPrices, updateConversation } = require('../lib/supabase');
const { fetchWeatherByCoords } = require('../lib/weather');
const { geocodeLocation, locationToWeatherQuery } = require('../lib/location');
const { classifyLanguage, generateAdvice, generateImageDiagnosis } = require('../lib/ai');
const { detectIntent, detectLanguageFromText } = require('../lib/intents');
const { suggestedFollowUps } = require('../lib/rules');
const { normalizeLanguage } = require('../lib/language');

function normalizeCrops(crops) {
  if (Array.isArray(crops)) return crops.filter(Boolean);
  if (!crops) return [];
  return String(crops)
    .split(',')
    .map((crop) => crop.trim())
    .filter(Boolean);
}

async function resolveConversation({ farmer, conversationId, sessionId, channel }) {
  if (conversationId) {
    const existing = await findConversation(conversationId);
    if (existing) return existing;
  }

  return createConversation({
    farmer_id: farmer?.id || null,
    channel: channel || farmer?.channel || 'web',
    session_id: sessionId || uuidv4(),
    primary_topic: null,
    message_count: 0,
    resolved: false
  });
}

async function resolveFarmer({ farmerId, phone, whatsappId, fallback }) {
  if (farmerId) {
    const found = await findFarmerByLookup({ id: farmerId });
    if (found) return found;
  }
  if (whatsappId) {
    const found = await findFarmerByLookup({ whatsapp_id: whatsappId });
    if (found) return found;
  }
  if (phone) {
    const found = await findFarmerByLookup({ phone });
    if (found) return found;
  }
  return fallback || null;
}

async function resolveWeather(farmer) {
  const query = await locationToWeatherQuery(farmer);
  const geocoded = await geocodeLocation(query);
  if (geocoded) {
    return fetchWeatherByCoords(geocoded.lat, geocoded.lng);
  }
  return fetchWeatherByCoords(9.0765, 7.3986);
}

function extractSuggestedIntent(message, reply) {
  return detectIntent(`${message} ${reply}`);
}

async function chatPipeline(input) {
  const message = String(input.message || '').trim();
  const farmer = await resolveFarmer({
    farmerId: input.farmer_id,
    phone: input.phone,
    whatsappId: input.whatsapp_id,
    fallback: input.farmer || null
  });
  const language = normalizeLanguage(input.language || farmer?.language || detectLanguageFromText(message));
  const conversation = await resolveConversation({
    farmer,
    conversationId: input.conversation_id,
    sessionId: input.session_id,
    channel: input.channel || farmer?.channel || 'web'
  });

  const history = await listConversationMessages(conversation.id, 10);
  const weather = await resolveWeather(farmer);
  const crops = normalizeCrops(farmer?.primary_crops);
  const [marketPrices, advisories, loans] = await Promise.all([
    listMarketPrices({ crop: crops[0], country: farmer?.country, state_province: farmer?.state_province }),
    listAdvisories({ country: farmer?.country, crop: crops[0] }),
    listLoans(farmer?.country)
  ]);

  let reply = '';
  let entities = {};
  if (input.media_url) {
    reply = await generateImageDiagnosis(input.media_url, { language, farmer, weather, marketPrices, advisories, loans });
  } else {
    const aiResponse = await generateAdvice({
      language,
      farmer: { ...farmer, primary_crops: crops },
      weather,
      marketPrices,
      advisories,
      loans,
      history: history.slice(-10).map((item) => ({ role: item.role, content: item.content })),
      message
    });
    reply = aiResponse.reply;
    entities = aiResponse.entities;
  }

  const intent = extractSuggestedIntent(message, reply);
  await addMessage({
    conversation_id: conversation.id,
    role: 'user',
    content: message,
    language,
    intent,
    entities
  });
  await addMessage({
    conversation_id: conversation.id,
    role: 'assistant',
    content: reply,
    language,
    intent,
    entities
  });
  await updateConversation(conversation.id, {
    farmer_id: farmer?.id || conversation.farmer_id,
    message_count: (conversation.message_count || 0) + 2,
    primary_topic: intent,
    resolved: intent !== 'general'
  });

  return {
    reply,
    conversation_id: conversation.id,
    intent,
    language,
    suggested_follow_ups: suggestedFollowUps(intent, language),
    weather,
    market_prices: marketPrices,
    advisories,
    loans
  };
}

module.exports = { chatPipeline, resolveFarmer, resolveConversation, resolveWeather };