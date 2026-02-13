// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const productRoutes = require('./routes/products');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: '*', // ในโปรเจคจริงควรกำหนด origin ที่อนุญาต
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Product Management API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      documentation: '/api/docs'
    }
  });
});

// API routes
app.use('/api/products', productRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.url} not found`
    }
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;