// routes/authors.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateAuthor } = require('../middleware/validate');

/**
 * GET /api/authors - Get all authors
 * Query: ?country=UK
 */
router.get('/', (req, res) => {
  // 1. ดึง authors ทั้งหมดเริ่มต้น
  let results = dataStore.authors;

  // 2. ถ้ามี query param 'country' ให้กรองตาม country
  const { country } = req.query;
  if (country) {
    results = results.filter(a => a.country.toLowerCase() === country.toLowerCase());
  }

  // 3. ส่ง response พร้อม count และ data
  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

/**
 * GET /api/authors/:id - Get author by ID
 */
router.get('/:id', (req, res, next) => {
  // 1. แปลง id เป็น number
  const id = parseInt(req.params.id);

  // 2. หา author จาก dataStore
  const author = dataStore.authors.find(a => a.id === id);

  // 3. ถ้าไม่เจอ ส่ง 404
  if (!author) {
    return res.status(404).json({
      success: false,
      error: { message: `Author with ID ${id} not found` }
    });
  }

  // 4. ถ้าเจอ ส่ง author พร้อม books ของ author
  // กรองหาหนังสือที่เป็นของ author คนนี้
  const authorBooks = dataStore.books.filter(b => b.authorId === id);

  res.json({
    success: true,
    data: {
      ...author,
      books: authorBooks // แนบข้อมูลหนังสือไปด้วย
    }
  });
});

/**
 * POST /api/authors - Create new author
 */
router.post('/', validateAuthor, (req, res) => {
  // 1. สร้าง author ใหม่
  // หา ID ใหม่ (Max ID + 1)
  const newId = dataStore.authors.length > 0 
    ? Math.max(...dataStore.authors.map(a => a.id)) + 1 
    : 1;

  const newAuthor = {
    id: newId,
    ...req.body // ข้อมูลผ่าน validate มาแล้วจาก Middleware
  };

  dataStore.authors.push(newAuthor);

  // 2. ส่ง response status 201
  res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: newAuthor
  });
});

/**
 * PUT /api/authors/:id - Update author
 */
router.put('/:id', validateAuthor, (req, res, next) => {
  // 1. แปลง id และหา index
  const id = parseInt(req.params.id);
  const index = dataStore.authors.findIndex(a => a.id === id);

  // 2. ถ้าไม่เจอ ส่ง 404
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Author with ID ${id} not found` }
    });
  }

  // 3. อัพเดท author
  // ใช้ spread operator เพื่อรวมข้อมูลเดิมกับข้อมูลใหม่
  dataStore.authors[index] = {
    ...dataStore.authors[index],
    ...req.body
  };

  res.json({
    success: true,
    message: 'Author updated successfully',
    data: dataStore.authors[index]
  });
});

/**
 * DELETE /api/authors/:id - Delete author
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = dataStore.authors.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Author with ID ${id} not found` }
    });
  }

  // 1. ตรวจสอบว่า author มี books หรือไม่ (Constraint Check)
  const hasBooks = dataStore.books.some(b => b.authorId === id);

  // 2. ถ้ามี books ไม่ให้ลบ (ส่ง 400 Bad Request)
  if (hasBooks) {
    return res.status(400).json({
      success: false,
      error: { 
        message: 'Cannot delete author. This author still has books in the system.',
        code: 'FOREIGN_KEY_CONSTRAINT'
      }
    });
  }

  // 3. ลบ author
  const deletedAuthor = dataStore.authors.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Author deleted successfully',
    data: deletedAuthor
  });
});

module.exports = router;