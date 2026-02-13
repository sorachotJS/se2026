// models/Borrowing.js
const { db } = require('../db');

class Borrowing {
  // ดึงการยืมทั้งหมด พร้อม JOIN
  static getAll() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        members.name as member,
        borrowings.borrow_date,
        borrowings.return_date,
        CASE 
          WHEN borrowings.return_date IS NULL THEN 'ยังไม่คืน'
          ELSE 'คืนแล้ว'
        END as status
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      ORDER BY borrowings.borrow_date DESC
    `;
    return db.prepare(sql).all();
  }

  // ยืมหนังสือ
  static borrow(bookId, memberId) {
    // 1. ตรวจสอบว่าหนังสือว่างไหม
    const book = db.prepare('SELECT available FROM books WHERE id = ?').get(bookId);
    
    if (!book) {
      console.log('❌ ไม่พบหนังสือ');
      return false;
    }
    
    if (book.available === 0) {
      console.log('❌ หนังสือถูกยืมไปแล้ว');
      return false;
    }

    // 2. เพิ่มรายการยืม
    const insertSql = `
      INSERT INTO borrowings (book_id, member_id)
      VALUES (?, ?)
    `;
    const result = db.prepare(insertSql).run(bookId, memberId);

    // 3. อัพเดทหนังสือว่าไม่ว่าง
    const updateSql = `
      UPDATE books SET available = 0 WHERE id = ?
    `;
    db.prepare(updateSql).run(bookId);

    console.log(`✅ Book #${bookId} borrowed by Member #${memberId}`);
    return result.lastInsertRowid;
  }

  // คืนหนังสือ
  static returnBook(borrowingId) {
    // 1. หา book_id จาก borrowing
    const getBorrowingSql = `
      SELECT book_id, return_date FROM borrowings WHERE id = ?
    `;
    const borrowing = db.prepare(getBorrowingSql).get(borrowingId);

    if (!borrowing) {
      console.log('❌ ไม่พบรายการยืม');
      return false;
    }

    if (borrowing.return_date !== null) {
      console.log('❌ คืนหนังสือไปแล้ว');
      return false;
    }

    // 2. อัพเดทว่าคืนแล้ว
    const updateBorrowingSql = `
      UPDATE borrowings 
      SET return_date = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    db.prepare(updateBorrowingSql).run(borrowingId);

    // 3. อัพเดทหนังสือว่าว่าง
    const updateBookSql = `
      UPDATE books SET available = 1 WHERE id = ?
    `;
    db.prepare(updateBookSql).run(borrowing.book_id);

    console.log(`✅ Book returned (Borrowing #${borrowingId})`);
    return true;
  }

  // ดูหนังสือที่ยังไม่คืน
  static getUnreturned() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title,
        members.name as borrower,
        borrowings.borrow_date,
        julianday('now') - julianday(borrowings.borrow_date) as days_borrowed
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      WHERE borrowings.return_date IS NULL
      ORDER BY borrowings.borrow_date ASC
    `;
    return db.prepare(sql).all();
  }

  // ดึงรายการยืมตาม ID
  static getById(id) {
    const sql = `
      SELECT 
        borrowings.*,
        books.title,
        members.name
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      WHERE borrowings.id = ?
    `;
    return db.prepare(sql).get(id);
  }
}

module.exports = Borrowing;