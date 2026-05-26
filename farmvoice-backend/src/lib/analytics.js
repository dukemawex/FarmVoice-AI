const { supabase } = require('./supabase');

async function dashboardStats() {
  const [farmers, conversations, feedback] = await Promise.all([
    supabase.from('farmer_profiles').select('id, channel, country, state_province', { count: 'exact' }),
    supabase.from('conversations').select('id, channel, primary_topic, created_at', { count: 'exact' }),
    supabase.from('feedback').select('rating', { count: 'exact' })
  ]);

  return {
    totalFarmers: farmers.count || 0,
    conversations: conversations.count || 0,
    averageRating: Array.isArray(feedback.data) && feedback.data.length
      ? feedback.data.reduce((sum, item) => sum + (item.rating || 0), 0) / feedback.data.length
      : 0,
    conversationChannels: [],
    topicDistribution: [],
    activeRegions: []
  };
}

module.exports = { dashboardStats };