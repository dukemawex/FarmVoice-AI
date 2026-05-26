const { handler: whatsappHandler } = require('../netlify/functions/whatsapp');
const { handler: authHandler } = require('../netlify/functions/auth');

describe('endpoint guards', () => {
  test('whatsapp endpoint rejects GET', async () => {
    const response = await whatsappHandler({ httpMethod: 'GET', headers: {}, path: '/.netlify/functions/whatsapp', body: '' });
    expect(response.statusCode).toBe(405);
  });

  test('auth endpoint rejects login without identifiers', async () => {
    const response = await authHandler({ httpMethod: 'POST', path: '/.netlify/functions/auth/login', body: JSON.stringify({}) });
    expect(response.statusCode).toBe(400);
  });
});