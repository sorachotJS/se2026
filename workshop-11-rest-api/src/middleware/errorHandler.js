// src/middleware/errorHandler.js

/**
 * Global error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled error:', err);
  
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;