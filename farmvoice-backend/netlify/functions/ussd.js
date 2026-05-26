const { handleUssdWebhook } = require('../../src/services/ussdState');
const { parseBody, ok, methodNotAllowed, serverError, text } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'POST') return methodNotAllowed();
    const payload = parseBody(event);
    const sessionId = payload.sessionId || payload.session_id;
    const phoneNumber = payload.phoneNumber || payload.phone_number;
    const textInput = payload.text || '';
    const result = await handleUssdWebhook({ sessionId, phoneNumber, text: textInput });
    return text(200, `${result.prefix} ${result.text}`);
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };