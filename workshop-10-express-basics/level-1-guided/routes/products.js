// routes/products.js
const express = require('express');
const router = express.Router();

// Dummy data
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'electronics', stock: 50 },
  { id: 2, name: 'Mouse', price: 29.99, category: 'electronics', stock: 200 },
  { id: 3, name: 'Desk', price: 199.99, category: 'furniture', stock: 30 }
];

/**
 * GET /api/products - Get all products
 * Query params: ?category=electronics&minPrice=100
 */
router.get('/', (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  let filteredProducts = products;

  // กรองตาม category
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // กรองตาม minPrice
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }

  // กรองตาม maxPrice
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts
  });
});

/**
 * GET /api/products/:id - Get product by ID
 */
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: {
        message: `Product with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: product
  });
});

/**
 * POST /api/products - Create new product
 */
router.post('/', (req, res) => {
  const { name, price, category, stock } = req.body;

  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name, price, and category are required'
      }
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category,
    stock: stock || 0
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
});

module.exports = router;