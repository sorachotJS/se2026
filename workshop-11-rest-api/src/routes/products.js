// src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Import ตัว Validator ที่คุณเพิ่งเขียน
const validator = require('../validators/productValidator');

/**
 * GET /api/products
 * ตรวจสอบ Query params -> จัดการ Error -> เรียก Controller
 */
router.get('/',
  validator.validateQuery,           // 1. เช็คกฎ
  validator.handleValidationErrors,  // 2. ถ้าผิดกฎ ส่ง error กลับเลย
  productController.getAll           // 3. ถ้าผ่าน ไปทำงานต่อ
);

/**
 * GET /api/products/:id
 * ตรวจสอบ ID -> จัดการ Error -> เรียก Controller
 */
router.get('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.getById
);

/**
 * POST /api/products
 * ตรวจสอบ Body -> จัดการ Error -> สร้างสินค้า
 */
router.post('/',
  validator.createProduct,
  validator.handleValidationErrors,
  productController.create
);

/**
 * PUT /api/products/:id
 * ตรวจสอบ ID และ Body ครบทุกช่อง -> จัดการ Error -> แก้ไขสินค้า
 */
router.put('/:id',
  validator.updateProduct,
  validator.handleValidationErrors,
  productController.update
);

/**
 * PATCH /api/products/:id
 * ตรวจสอบ ID และ Body บางช่อง -> จัดการ Error -> แก้ไขบางส่วน
 */
router.patch('/:id',
  validator.patchProduct,
  validator.handleValidationErrors,
  productController.partialUpdate
);

/**
 * DELETE /api/products/:id
 * ตรวจสอบ ID -> จัดการ Error -> ลบสินค้า
 */
router.delete('/:id',
  validator.validateId,
  validator.handleValidationErrors,
  productController.remove
);

module.exports = router;