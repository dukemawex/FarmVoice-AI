const { corsify, json, parseBody, text } = require('../../src/lib/http');

function methodNotAllowed() {
  return corsify(json(405, { error: 'Method not allowed' }));
}

function ok(body) {
  return corsify(json(200, body));
}

function created(body) {
  return corsify(json(201, body));
}

function badRequest(message) {
  return corsify(json(400, { error: message }));
}

function unauthorized(message = 'Unauthorized') {
  return corsify(json(401, { error: message }));
}

function forbidden(message = 'Forbidden') {
  return corsify(json(403, { error: message }));
}

function serverError(error) {
  return corsify(json(500, { error: error?.message || 'Internal server error' }));
}

module.exports = { corsify, json, parseBody, text, ok, created, badRequest, unauthorized, forbidden, serverError, methodNotAllowed };