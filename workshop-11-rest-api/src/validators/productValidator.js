// src/validators/productValidator.js
const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation rules for creating product
 */
exports.createProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for updating product
 */
exports.updateProduct = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for partial update
 */
exports.patchProduct = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

/**
 * Validation rules for ID parameter
 */
exports.validateId = [
  param('id')
    .isInt({ min: 1 }).withMessage('Invalid product ID')
];

/**
 * Validation rules for query parameters
 */
exports.validateQuery = [
  query('category')
    .optional()
    .isIn(['Electronics', 'Clothing', 'Food', 'Books', 'Other'])
    .withMessage('Invalid category'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be a positive number'),

    // เพิ่มการตรวจสอบ Sort
  query('sort')
    .optional()
    .isIn(['price', 'name', 'stock', 'id', 'createdAt']) // field ที่อนุญาตให้ sort
    .withMessage('Invalid sort field'),

  query('order')
    .optional()
    .isIn(['asc', 'desc']) // ต้องเป็น asc หรือ desc เท่านั้น
    .withMessage('Order must be asc or desc'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

/**
 * Middleware to handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Input validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }
  
  next();
};