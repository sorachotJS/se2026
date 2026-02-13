// src/controllers/productController.js
const Product = require('../data/products');

/**
 * GET /api/products
 * ดึงสินค้าทั้งหมด (with optional filters)
 */
exports.getAll = (req, res) => {
  try {
    // 1. ดึงค่า sort และ order จาก query string
    const { sort, order } = req.query;

    // 2. ส่ง options ไปให้ Model เพื่อดึงข้อมูลแบบเรียงลำดับมาให้
    // (Model จะจัดการเรื่อง case-insensitive และตัวเลขให้เราแล้ว)
    let products = Product.getAll({ sort, order });
    
    // --- จากนั้น Filter ข้อมูล (ลำดับการเรียงจะยังคงอยู่) ---

    // Filter by category
    if (req.query.category) {
      products = products.filter(p => 
        p.category === req.query.category
      );
    }
    
    // Filter by price range
    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      products = products.filter(p => p.price >= minPrice);
    }
    
    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      products = products.filter(p => p.price <= maxPrice);
    }
    
    // Search by name
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
      );
    }
    
    // --- Pagination ---
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const total = products.length;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      // ส่ง metadata กลับไปบอก client ด้วยว่าตอนนี้เรียงด้วยอะไรอยู่
      sort: {
        field: sort || 'default',
        order: order || 'asc'
      },
      count: paginatedProducts.length,
      data: paginatedProducts
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch products',
        details: error.message
      }
    });
  }
};

/**
 * GET /api/products/:id
 * ดึงสินค้าตาม ID
 */
exports.getById = (req, res) => {
  try {
    const product = Product.getById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch product',
        details: error.message
      }
    });
  }
};

/**
 * POST /api/products
 * สร้างสินค้าใหม่
 */
exports.create = (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const newProduct = Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create product',
        details: error.message
      }
    });
  }
};

/**
 * PUT /api/products/:id
 * แก้ไขสินค้าทั้งหมด (full replacement)
 */
exports.update = (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const updatedProduct = Product.update(req.params.id, {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    });
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in update:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update product',
        details: error.message
      }
    });
  }
};

/**
 * PATCH /api/products/:id
 * แก้ไขสินค้าบางส่วน (partial update)
 */
exports.partialUpdate = (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Convert types if present
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock) updates.stock = parseInt(updates.stock);
    
    const updatedProduct = Product.partialUpdate(req.params.id, updates);
    
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in partialUpdate:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update product',
        details: error.message
      }
    });
  }
};



/**
 * DELETE /api/products/:id
 * ลบสินค้า
 */
exports.remove = (req, res) => {
  try {
    const deleted = Product.remove(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: `Product with ID ${req.params.id} not found`
        }
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in remove:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete product',
        details: error.message
      }
    });
  }
};