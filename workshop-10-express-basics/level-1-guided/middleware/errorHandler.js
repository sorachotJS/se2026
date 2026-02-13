// middleware/errorHandler.js

/**
 * Error handling middleware - จัดการ errors แบบ centralized
 * ต้องมี 4 parameters (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  // Log error สำหรับ debugging
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // กำหนด status code (default 500)
  const statusCode = err.statusCode || 500;

  // ส่ง error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};