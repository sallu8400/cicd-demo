const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/products', () => {
  it('returns all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(5);
  });

  it('filters by search text (case-insensitive)', async () => {
    const res = await request(app).get('/api/products?search=GOLD');
    expect(res.status).toBe(200);
    expect(res.body.map((p) => p.name)).toEqual(['Gold Ring', 'Gold Bangle']);
  });
});

describe('GET /api/products/:id', () => {
  it('returns one product', async () => {
    const res = await request(app).get('/api/products/3');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Diamond Earrings');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/products/999');
    expect(res.status).toBe(404);
  });
});
