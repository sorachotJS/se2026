// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Book Library API',
    version: process.env.API_VERSION,
    endpoints: {
      authors: '/api/authors',
      books: '/api/books',
      docs: '/api/docs'
    }
  });
});

// API routes
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;