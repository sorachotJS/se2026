// models/Book.js
const { db } = require('../db');

class Book {
  // 1. ดึงหนังสือทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM books';
    return db.prepare(sql).all();
  }

  // 2. ดึงหนังสือที่ว่าง (available = 1)
  static getAvailable() {
    // เลือกเฉพาะแถวที่ column available มีค่าเป็น 1
    const sql = 'SELECT * FROM books WHERE available = 1';
    return db.prepare(sql).all();
  }

  // 3. ค้นหาหนังสือ (จาก title หรือ author)
  static search(keyword) {
    // ใช้ LIKE ร่วมกับ % เพื่อหาข้อความที่ "มีคำนี้ปนอยู่"
    // เช่น search('Harry') จะเจอ 'Harry Potter'
    const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
    
    const term = `%${keyword}%`;
    
    // ส่งตัวแปร term เข้าไป 2 ครั้ง (สำหรับ ? ตัวแรก และ ? ตัวที่สอง)
    return db.prepare(sql).all(term, term);
  }

  // 4. เพิ่มหนังสือใหม่
  static add(title, author) {
    const sql = 'INSERT INTO books (title, author) VALUES (?, ?)';
    
    // ใช้ .run() เพราะเป็นการแก้ไขข้อมูล (ไม่ต้องการผลลัพธ์เป็นตาราง)
    // ผลลัพธ์ที่ได้จะเป็น object ที่บอกว่า lastInsertRowid คือเลขอะไร
    return db.prepare(sql).run(title, author);
  }
}

module.exports = Book;