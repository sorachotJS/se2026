// routes/books.js
const express = require('express');
const router = express.Router();
const dataStore = require('../data/dataStore');
const { validateBook } = require('../middleware/validate');

/**
 * GET /api/books - Get all books
 * Query: ?genre=Fantasy&page=1&limit=10
 */
router.get('/', (req, res) => {
  // 1. รับค่าและตั้งค่า Default
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { genre } = req.query;

  let results = dataStore.books;

  // 2. กรองตาม genre ถ้ามี
  if (genre) {
    results = results.filter(b => b.genre.toLowerCase() === genre.toLowerCase());
  }

  // 3. Pagination Logic
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalItems = results.length;

  const paginatedBooks = results.slice(startIndex, endIndex);

  // 4. เพิ่มข้อมูล author ใน response (Data Embedding/Joining)
  const booksWithAuthors = paginatedBooks.map(book => {
    const author = dataStore.authors.find(a => a.id === book.authorId);
    return {
      ...book,
      author: author || null // ถ้าหาไม่เจอให้เป็น null
    };
  });

  res.json({
    success: true,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      limit
    },
    data: booksWithAuthors
  });
});

/**
 * ⚠️ สำคัญ: ต้องวาง Route /search ไว้ก่อน /:id เสมอ
 * GET /api/books/search - Search books
 * Query: ?q=harry
 */
router.get('/search', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
  }

  // ค้นหา books จาก title (Case insensitive)
  const results = dataStore.books.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase())
  );

  // แถมข้อมูล author ไปด้วย
  const booksWithAuthors = results.map(book => {
    const author = dataStore.authors.find(a => a.id === book.authorId);
    return { ...book, author: author || null };
  });

  res.json({
    success: true,
    count: results.length,
    data: booksWithAuthors
  });
});

/**
 * GET /api/books/:id - Get book by ID
 */
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const book = dataStore.books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      error: { message: `Book with ID ${id} not found` }
    });
  }

  // เพิ่มข้อมูล author
  const author = dataStore.authors.find(a => a.id === book.authorId);

  res.json({
    success: true,
    data: {
      ...book,
      author: author || null
    }
  });
});

/**
 * POST /api/books - Create new book
 */
router.post('/', validateBook, (req, res, next) => {
  // 1. ตรวจสอบว่า authorId มีอยู่จริง (Foreign Key Constraint)
  const authorExists = dataStore.authors.some(a => a.id === req.body.authorId);
  
  if (!authorExists) {
    return res.status(400).json({
      success: false,
      error: { message: `Author with ID ${req.body.authorId} does not exist` }
    });
  }

  // 2. สร้าง book ใหม่
  const newId = dataStore.books.length > 0 
    ? Math.max(...dataStore.books.map(b => b.id)) + 1 
    : 1;

  const newBook = {
    id: newId,
    ...req.body // ข้อมูลจาก req.body ผ่าน validate มาแล้ว
  };

  dataStore.books.push(newBook);

  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});

/**
 * PUT /api/books/:id - Update book
 */
router.put('/:id', validateBook, (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = dataStore.books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Book with ID ${id} not found` }
    });
  }

  // ตรวจสอบ authorId ถ้ามีการส่งมาแก้ไข
  if (req.body.authorId) {
    const authorExists = dataStore.authors.some(a => a.id === req.body.authorId);
    if (!authorExists) {
      return res.status(400).json({
        success: false,
        error: { message: `Author with ID ${req.body.authorId} does not exist` }
      });
    }
  }

  // อัพเดท book
  dataStore.books[index] = {
    ...dataStore.books[index],
    ...req.body
  };

  res.json({
    success: true,
    message: 'Book updated successfully',
    data: dataStore.books[index]
  });
});

/**
 * DELETE /api/books/:id - Delete book
 */
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = dataStore.books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Book with ID ${id} not found` }
    });
  }

  // ลบ book
  const deletedBook = dataStore.books.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook
  });
});

module.exports = router;