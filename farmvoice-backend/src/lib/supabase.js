const { createClient } = require('@supabase/supabase-js');
const { getEnv } = require('./env');

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function upsertFarmerProfile(profile) {
  const payload = {
    phone: profile.phone || null,
    whatsapp_id: profile.whatsapp_id || null,
    full_name: profile.full_name || null,
    language: profile.language || 'en',
    country: profile.country || null,
    state_province: profile.state_province || null,
    primary_crops: profile.primary_crops || [],
    farm_size_hectares: profile.farm_size_hectares || null,
    channel: profile.channel || 'web'
  };

  const { data, error } = await supabase
    .from('farmer_profiles')
    .upsert(payload, { onConflict: profile.whatsapp_id ? 'whatsapp_id' : 'phone' })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function findFarmerByLookup(lookup) {
  let query = supabase.from('farmer_profiles').select('*').limit(1);
  if (lookup.whatsapp_id) query = query.eq('whatsapp_id', lookup.whatsapp_id);
  else if (lookup.phone) query = query.eq('phone', lookup.phone);
  else if (lookup.id) query = query.eq('id', lookup.id);
  const { data, error } = await query.single();
  if (error) return null;
  return data;
}

async function createConversation(payload) {
  const { data, error } = await supabase.from('conversations').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

async function findConversation(id) {
  const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

async function listConversationMessages(conversationId, limit = 10) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

async function addMessage(message) {
  const { data, error } = await supabase.from('messages').insert(message).select('*').single();
  if (error) throw error;
  return data;
}

async function updateConversation(id, patch) {
  const { data, error } = await supabase
    .from('conversations')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

async function listMarketPrices(filters = {}) {
  let query = supabase.from('market_prices').select('*').order('price_date', { ascending: false });
  if (filters.crop) query = query.ilike('crop', filters.crop);
  if (filters.country) query = query.ilike('country', filters.country);
  if (filters.state_province) query = query.ilike('state_province', filters.state_province);
  if (filters.market_name) query = query.ilike('market_name', filters.market_name);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function listCropPrices(crop) {
  const { data, error } = await supabase
    .from('market_prices')
    .select('*')
    .ilike('crop', crop)
    .order('price_per_kg', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function addMarketPrice(price) {
  const { data, error } = await supabase.from('market_prices').insert(price).select('*').single();
  if (error) throw error;
  return data;
}

async function listAdvisories(filters = {}) {
  let query = supabase.from('agro_advisories').select('*').order('valid_from', { ascending: false });
  if (filters.country) query = query.ilike('country', filters.country);
  if (filters.crop) query = query.ilike('crop', filters.crop);
  if (filters.advisory_type) query = query.eq('advisory_type', filters.advisory_type);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function addAdvisory(advisory) {
  const { data, error } = await supabase.from('agro_advisories').insert(advisory).select('*').single();
  if (error) throw error;
  return data;
}

async function listLoans(country) {
  let query = supabase.from('loan_products').select('*').eq('active', true).order('max_amount', { ascending: true });
  if (country) query = query.ilike('country', country);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function addFeedback(payload) {
  const { data, error } = await supabase.from('feedback').insert(payload).select('*').single();
  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  upsertFarmerProfile,
  findFarmerByLookup,
  createConversation,
  findConversation,
  listConversationMessages,
  addMessage,
  updateConversation,
  listMarketPrices,
  listCropPrices,
  addMarketPrice,
  listAdvisories,
  addAdvisory,
  listLoans,
  addFeedback
};