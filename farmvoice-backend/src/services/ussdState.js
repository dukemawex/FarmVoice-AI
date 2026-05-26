const { addMessage, createConversation, findFarmerByLookup, listLoans, listMarketPrices, updateConversation } = require('../lib/supabase');
const { chatPipeline } = require('./chatPipeline');
const { compactUSSD } = require('../lib/rules');
const { normalizeLanguage, languageName } = require('../lib/language');
const { geocodeLocation } = require('../lib/location');
const { fetchWeatherByCoords } = require('../lib/weather');
const { supabase } = require('../lib/supabase');

async function getSession(sessionId) {
  const { data } = await supabase.from('ussd_sessions').select('*').eq('session_id', sessionId).maybeSingle();
  return data || null;
}

async function saveSession(session) {
  const { data, error } = await supabase
    .from('ussd_sessions')
    .upsert({
      session_id: session.session_id,
      phone_number: session.phone_number,
      farmer_id: session.farmer_id || null,
      conversation_id: session.conversation_id || null,
      state: session.state,
      payload: session.payload || {},
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function deleteSession(sessionId) {
  await supabase.from('ussd_sessions').delete().eq('session_id', sessionId);
}

function menuRoot() {
  return [
    'Welcome to FarmVoice AI',
    '1. Ask a question',
    '2. Market prices',
    '3. Weather forecast',
    '4. Loan options',
    '5. Change language'
  ].join('\n');
}

function languageMenu() {
  return ['Select language:', '1. English', '2. Hausa', '3. Yoruba', '4. Swahili', '5. French'].join('\n');
}

function cropMenu() {
  return ['Select crop:', '1. Maize', '2. Cassava', '3. Rice', '4. Tomato', '5. Yam'].join('\n');
}

function languageFromChoice(choice) {
  return {
    '1': 'en',
    '2': 'ha',
    '3': 'yo',
    '4': 'sw',
    '5': 'fr'
  }[choice] || 'en';
}

function cropFromChoice(choice) {
  return {
    '1': 'maize',
    '2': 'cassava',
    '3': 'rice',
    '4': 'tomato',
    '5': 'yam'
  }[choice] || 'maize';
}

async function ensureConversationForPhone(session, farmer) {
  if (session.conversation_id) return session.conversation_id;
  const conversation = await createConversation({
    farmer_id: farmer?.id || null,
    channel: 'ussd',
    session_id: session.session_id,
    primary_topic: null,
    message_count: 0,
    resolved: false
  });
  session.conversation_id = conversation.id;
  await saveSession(session);
  return conversation.id;
}

async function handleUssdWebhook({ sessionId, phoneNumber, text }) {
  const segments = String(text || '').split('*').filter(Boolean);
  const current = segments[segments.length - 1] || '';
  let session = (await getSession(sessionId)) || {
    session_id: sessionId,
    phone_number: phoneNumber,
    state: 'root',
    payload: {}
  };

  const farmer = (await findFarmerByLookup({ phone: phoneNumber })) || null;
  session.farmer_id = farmer?.id || session.farmer_id || null;

  if (segments.length === 0) {
    session.state = 'root';
    await saveSession(session);
    return { prefix: 'CON', text: menuRoot() };
  }

  if (session.state === 'root') {
    if (current === '1') {
      session.state = 'ask_question';
      await saveSession(session);
      return { prefix: 'CON', text: 'Type your farming question:' };
    }
    if (current === '2') {
      session.state = 'market_crop';
      await saveSession(session);
      return { prefix: 'CON', text: cropMenu() };
    }
    if (current === '3') {
      const locationQuery = [farmer?.state_province, farmer?.country].filter(Boolean).join(', ');
      const geocoded = await geocodeLocation(locationQuery);
      const weather = geocoded ? await fetchWeatherByCoords(geocoded.lat, geocoded.lng) : await fetchWeatherByCoords(9.0765, 7.3986);
      const currentWeather = weather.current || {};
      const summary = compactUSSD(`Weather for ${farmer?.state_province || 'your area'}: ${currentWeather.temp_c ?? 'N/A'}°C, ${currentWeather.summary || 'unknown'}. Rain chance ${currentWeather.rain_probability ?? 0}% over the next day.`);
      await deleteSession(sessionId);
      return { prefix: 'END', text: summary };
    }
    if (current === '4') {
      session.state = 'loan_list';
      await saveSession(session);
      const loans = await listLoans(farmer?.country);
      const top = loans.slice(0, 3).map((loan, index) => `${index + 1}. ${loan.provider_name} ${loan.product_name}: ${loan.currency}${loan.min_amount}-${loan.currency}${loan.max_amount}, ${loan.interest_rate}%`).join('\n');
      await deleteSession(sessionId);
      return { prefix: 'END', text: compactUSSD(top || 'No active loans available.') };
    }
    if (current === '5') {
      session.state = 'language_menu';
      await saveSession(session);
      return { prefix: 'CON', text: languageMenu() };
    }
    return { prefix: 'CON', text: menuRoot() };
  }

  if (session.state === 'ask_question') {
    const response = await chatPipeline({
      farmer_id: farmer?.id || null,
      message: current,
      language: farmer?.language || 'en',
      session_id: session.session_id,
      conversation_id: session.conversation_id,
      channel: 'ussd',
      phone: phoneNumber
    });
    await ensureConversationForPhone(session, farmer);
    await addMessage({
      conversation_id: session.conversation_id,
      role: 'system',
      content: 'USSD session question answered',
      language: normalizeLanguage(farmer?.language || 'en'),
      intent: response.intent,
      entities: {}
    });
    await deleteSession(sessionId);
    return { prefix: 'END', text: compactUSSD(`${response.reply} Reply for more.`) };
  }

  if (session.state === 'market_crop') {
    const crop = cropFromChoice(current);
    const prices = await listMarketPrices({ crop, country: farmer?.country, state_province: farmer?.state_province });
    const grouped = prices.slice(0, 4).map((price) => `${price.crop}: ${price.currency}${price.price_per_kg}/kg in ${price.market_name}`).join(' | ');
    await deleteSession(sessionId);
    return { prefix: 'END', text: compactUSSD(grouped || 'No market prices available.') };
  }

  if (session.state === 'language_menu') {
    const language = languageFromChoice(current);
    if (farmer) {
      await supabase.from('farmer_profiles').update({ language }).eq('id', farmer.id);
    }
    await deleteSession(sessionId);
    return { prefix: 'END', text: compactUSSD(`Language changed to ${languageName(language)}.`) };
  }

  return { prefix: 'CON', text: menuRoot() };
}

module.exports = { handleUssdWebhook, getSession, saveSession, deleteSession };
module.exports.menuRoot = menuRoot;
module.exports.languageMenu = languageMenu;
module.exports.cropMenu = cropMenu;
module.exports.languageFromChoice = languageFromChoice;
module.exports.cropFromChoice = cropFromChoice;