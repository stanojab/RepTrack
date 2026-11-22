import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../src/db.js', () => ({ default: {} }));
const { default: app } = await import('../src/app.js');

const tokenFor = (role) => jwt.sign({ sub: 1, role }, process.env.JWT_SECRET);

describe('API endpoints', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('returns 404 for an unknown address', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('POST /api/auth/login without a password returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'ana@reptrack.test' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

  it('rejects a protected endpoint without a token with 401 (US-01)', async () => {
    const res = await request(app).get('/api/plans');
    expect(res.status).toBe(401);
  });

  it('rejects an invalid token with 401', async () => {
    const res = await request(app).get('/api/plans').set('Authorization', 'Bearer not-a-token');
    expect(res.status).toBe(401);
  });

  it('rejects an endpoint of another role with 403 (US-01)', async () => {
    const res = await request(app).get('/api/plans').set('Authorization', `Bearer ${tokenFor('Client')}`);
    expect(res.status).toBe(403);
  });
});
