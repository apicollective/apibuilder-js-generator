import supertest from 'supertest';
import app from '../../../src/server/app';

const request = supertest(app);

describe('GET /_internal_/healthcheck', () => {
  test('healthy', async () => {
    const response = await request.get('/_internal_/healthcheck');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('text/html');
    expect(response.text).toBe('healthy');
  });
});
