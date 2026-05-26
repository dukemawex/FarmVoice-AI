const { listLoans } = require('../../src/lib/supabase');
const { ok, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'GET') return methodNotAllowed();
    const country = event.path.split('/').slice(-1)[0];
    const loans = await listLoans(country && country !== 'loans' ? country : event.queryStringParameters?.country);
    return ok({ loans });
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };