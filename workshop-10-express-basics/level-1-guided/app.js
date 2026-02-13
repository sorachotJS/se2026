// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Import custom middleware
const logger = require('./middleware/logger');
const requestTimer = require('./middleware/requestTimer');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Import routes
const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

// Create Express app
const app = express();

// ========================================
// Middleware Setup
// ========================================

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Third-party middleware
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logger

// Custom middleware
app.use(logger); // Custom logger
app.use(requestTimer); // Request timer

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ========================================
// Routes
// ========================================

app.use('/', indexRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

// ========================================
// Error Handling
// ========================================

// 404 handler (ต้องอยู่หลัง routes ทั้งหมด)
app.use(notFoundHandler);

// Error handler (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

module.exports = app;