const { dashboardStats } = require('../../src/lib/analytics');
const { ok, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'GET') return methodNotAllowed();
    const dashboard = await dashboardStats();
    return ok({ dashboard });
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };