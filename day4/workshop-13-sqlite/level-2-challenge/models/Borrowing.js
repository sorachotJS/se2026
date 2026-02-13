// models/Borrowing.js
const { db } = require('../db');

class Borrowing {
  // ดึงการยืมทั้งหมด พร้อม JOIN เพื่อให้เห็นชื่อคนและชื่อหนังสือ
  static getAll() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        members.name as member,
        borrowings.borrow_date,
        borrowings.return_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
    `;
    return db.prepare(sql).all();
  }

  // ยืมหนังสือ (ใช้ Transaction เพื่อความปลอดภัยของข้อมูล)
  static borrow(bookId, memberId) {
    const doBorrow = db.transaction(() => {
      // 1. เพิ่มรายการใน borrowings
      const insertSql = 'INSERT INTO borrowings (book_id, member_id) VALUES (?, ?)';
      db.prepare(insertSql).run(bookId, memberId);

      // 2. อัพเดท books ให้ available = 0 (ไม่ว่าง)
      const updateBookSql = 'UPDATE books SET available = 0 WHERE id = ?';
      db.prepare(updateBookSql).run(bookId);
    });

    // เรียกทำงาน Transaction
    doBorrow();
    console.log(`✅ Book #${bookId} borrowed by Member #${memberId}`);
  }

  // คืนหนังสือ
  static returnBook(borrowingId) {
    const doReturn = db.transaction(() => {
      // 1. หา book_id จาก borrowing เพื่อจะได้รู้ว่าต้องไปแก้สถานะหนังสือเล่มไหน
      const findSql = 'SELECT book_id FROM borrowings WHERE id = ?';
      const borrowing = db.prepare(findSql).get(borrowingId);

      if (!borrowing) {
        throw new Error(`Borrowing transaction #${borrowingId} not found`);
      }

      // 2. อัพเดท borrowings ให้มี return_date เป็นเวลาปัจจุบัน
      const updateBorrowSql = 'UPDATE borrowings SET return_date = CURRENT_TIMESTAMP WHERE id = ?';
      db.prepare(updateBorrowSql).run(borrowingId);

      // 3. อัพเดท books ให้ available = 1 (ว่างแล้ว)
      const updateBookSql = 'UPDATE books SET available = 1 WHERE id = ?';
      db.prepare(updateBookSql).run(borrowing.book_id);
    });

    try {
      doReturn();
      console.log(`✅ Book returned (Borrowing #${borrowingId})`);
    } catch (error) {
      console.error('❌ Return failed:', error.message);
    }
  }

  // ดูหนังสือที่ยังไม่คืน (return_date IS NULL)
  static getUnreturned() {
    const sql = `
      SELECT 
        borrowings.id,
        books.title as book,
        members.name as member,
        borrowings.borrow_date
      FROM borrowings
      JOIN books ON borrowings.book_id = books.id
      JOIN members ON borrowings.member_id = members.id
      WHERE borrowings.return_date IS NULL
    `;
    return db.prepare(sql).all();
  }
}

module.exports = Borrowing;