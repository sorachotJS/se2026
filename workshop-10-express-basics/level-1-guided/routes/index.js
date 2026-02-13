// routes/index.js
const express = require('express');
const router = express.Router();

/**
 * GET / - Home page
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Express.js API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products'
    }
  });
});

/**
 * GET /health - Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /info - Server information
 */
router.get('/info', (req, res) => {
  res.json({
    success: true,
    info: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV
    }
  });
});

module.exports = router;