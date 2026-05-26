const { addFeedback } = require('../../src/lib/supabase');
const { parseBody, ok, created, badRequest, methodNotAllowed, serverError } = require('./_common');

async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
    if (event.httpMethod !== 'POST') return methodNotAllowed();
    const body = parseBody(event);
    const rating = Number(body.rating);
    if (!body.conversation_id || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return badRequest('conversation_id and rating 1-5 are required');
    }
    const feedback = await addFeedback({
      farmer_id: body.farmer_id || null,
      conversation_id: body.conversation_id,
      rating,
      comment: body.comment || null
    });
    return created({ feedback });
  } catch (error) {
    return serverError(error);
  }
}

module.exports = { handler };