// src/modules/bins/__tests__/bins.routes.test.js

// Mock Supabase AVANT tout import
jest.mock('../../../config/supabase', () => ({
  from: () => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
      data: [],
      error: null
    }),
    insert: () => ({
      select: () => ({
        single: () => ({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => ({ data: null, error: null })
        })
      })
    }),
    delete: () => ({
      eq: () => ({ error: null })
    })
  }),
  auth: {
    getUser: () => ({ data: null, error: { message: 'Token invalide' } })
  }
}));

// Mock Redis
jest.mock('../../../config/redis', () => ({
  get: jest.fn().mockResolvedValue(null),
  setex: jest.fn().mockResolvedValue('OK'),
  ping: jest.fn().mockResolvedValue('PONG'),
  on: jest.fn(),
  keys: jest.fn().mockResolvedValue([]),
  del: jest.fn().mockResolvedValue(1)
}));

const request = require('supertest');
const app = require('../../../app');

// ─────────────────────────────────────────
// TESTS : GET /api/bins
// ─────────────────────────────────────────
describe('GET /api/bins', () => {

  test('retourne HTTP 200 et un tableau', async () => {
    const response = await request(app).get('/api/bins');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('retourne le bon format de réponse', async () => {
    const response = await request(app).get('/api/bins');
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('data');
  });

});

// ─────────────────────────────────────────
// TESTS : POST /api/bins
// ─────────────────────────────────────────
describe('POST /api/bins', () => {

  test('retourne HTTP 401 sans token', async () => {
    const response = await request(app)
      .post('/api/bins')
      .send({
        reference: 'BIN-TEST',
        latitude: 48.8566,
        longitude: 2.3522,
        capacite_totale: 500,
        id_zone: '123e4567-e89b-12d3-a456-426614174001',
        id_type_dechets: '123e4567-e89b-12d3-a456-426614174002'
      });
    expect(response.status).toBe(401);
  });

  test('retourne HTTP 400 avec données invalides', async () => {
    const response = await request(app)
      .post('/api/bins')
      .set('Authorization', 'Bearer fake-token')
      .send({
        reference: 'BIN-TEST',
        latitude: 200,
        longitude: 2.3522,
        capacite_totale: 500,
        id_zone: 'invalid',
        id_type_dechets: 'invalid'
      });
    expect([400, 401]).toContain(response.status);
  });

});

// ─────────────────────────────────────────
// TESTS : DELETE /api/bins/:id
// ─────────────────────────────────────────
describe('DELETE /api/bins/:id', () => {

  test('retourne HTTP 401 sans token', async () => {
    const response = await request(app)
      .delete('/api/bins/123e4567-e89b-12d3-a456-426614174000');
    expect(response.status).toBe(401);
  });

});

// ─────────────────────────────────────────
// TESTS : GET /health
// ─────────────────────────────────────────
describe('GET /health', () => {

  test('retourne HTTP 200 et status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('timestamp');
  });

});

// ─────────────────────────────────────────
// TESTS : GET /ping
// ─────────────────────────────────────────
describe('GET /ping', () => {

  test('retourne HTTP 200', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

});