// models/Member.js
const { db } = require('../db');

class Member {
  // ดึงสมาชิกทั้งหมด
  static getAll() {
    const sql = 'SELECT * FROM members';
    return db.prepare(sql).all();
  }

  // ดูหนังสือที่สมาชิกยืมอยู่
  static getBorrowedBooks(memberId) {
    // JOIN 2 ตาราง: borrowings (การยืม) และ books (หนังสือ)
    // เพื่อให้รู้ว่า id ของหนังสือที่ยืม คือหนังสือชื่ออะไร
    const sql = `
      SELECT 
        books.title,
        books.author,
        borrowings.borrow_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      WHERE borrowings.member_id = ? 
      AND borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all(memberId);
  }

  // เพิ่มสมาชิกใหม่
  static add(name, email, phone) {
    const sql = 'INSERT INTO members (name, email, phone) VALUES (?, ?, ?)';
    
    // ใช้ .run() เพราะเป็นการเพิ่มข้อมูลใหม่
    // ส่ง parameter 3 ตัวเข้าไปแทนที่ ? ทั้ง 3 จุด
    return db.prepare(sql).run(name, email, phone);
  }
}

module.exports = Member;