// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation error',
        details: err.details.map(d => d.message)
      }
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };