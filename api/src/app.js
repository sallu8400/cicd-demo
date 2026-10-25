const express = require('express');
const products = require('./products');

const app = express();
app.use(express.json());

// Health check: deploy ke baad Jenkins isi se check karta hai ki app chal raha hai.
// APP_ENV batata hai ki yeh staging hai ya production.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.APP_ENV || 'local',
    version: process.env.APP_VERSION || 'dev',
  });
});

app.get('/api/products', (req, res) => {
  const search = (req.query.search || '').trim().toLowerCase();
  const result = search
    ? products.filter((p) => p.name.toLowerCase().includes(search))
    : products;
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

module.exports = app;
