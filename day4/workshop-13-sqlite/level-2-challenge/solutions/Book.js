// models/Book.js
const { db } = require('../db');

class Book {
  // ดึงหนังสือทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM books ORDER BY title';
    return db.prepare(sql).all();
  }

  // ดึงหนังสือที่ว่าง (available = 1)
  static getAvailable() {
    const sql = `
      SELECT * FROM books 
      WHERE available = 1
      ORDER BY title
    `;
    return db.prepare(sql).all();
  }

  // ค้นหาหนังสือ
  static search(keyword) {
    const sql = `
      SELECT * FROM books 
      WHERE title LIKE ? OR author LIKE ?
      ORDER BY title
    `;
    const pattern = `%${keyword}%`;
    return db.prepare(sql).all(pattern, pattern);
  }

  // เพิ่มหนังสือใหม่
  static add(title, author) {
    const sql = `
      INSERT INTO books (title, author)
      VALUES (?, ?)
    `;
    const result = db.prepare(sql).run(title, author);
    console.log(`✅ Added book: "${title}" by ${author} (ID: ${result.lastInsertRowid})`);
    return result.lastInsertRowid;
  }

  // ดึงหนังสือตาม ID
  static getById(id) {
    const sql = 'SELECT * FROM books WHERE id = ?';
    return db.prepare(sql).get(id);
  }
}

module.exports = Book;