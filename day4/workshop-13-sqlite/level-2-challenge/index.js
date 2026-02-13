// index.js
const { db, reset } = require('./db');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Borrowing = require('./models/Borrowing');

// Reset database
reset();

console.log('\n📚 Library System Demo');
console.log('='.repeat(50));

// 1. แสดงหนังสือทั้งหมด
console.log('\n1️⃣ All Books:');
const books = Book.getAll();
console.table(books);

// 2. แสดงสมาชิกทั้งหมด
console.log('\n2️⃣ All Members:');
const members = Member.getAll();
console.table(members);

// 3. แสดงหนังสือที่ว่าง (available)
console.log('\n3️⃣ Available Books:');
const available = Book.getAvailable();
console.table(available);

// 4. ยืมหนังสือ
console.log('\n4️⃣ Borrow a book:');
Borrowing.borrow(2, 3); // ชาติชายยืม The Hobbit

// 5. แสดงการยืมทั้งหมด
console.log('\n5️⃣ All Borrowings:');
const borrowings = Borrowing.getAll();
console.table(borrowings);

// 6. ดูว่าสมาชิกคนนี้ยืมอะไรบ้าง
console.log('\n6️⃣ Books borrowed by Member #1:');
const memberBooks = Member.getBorrowedBooks(1);
console.table(memberBooks);

// 7. คืนหนังสือ
console.log('\n7️⃣ Return a book:');
Borrowing.returnBook(1); // คืนหนังสือที่ยืมรายการที่ 1

// 8. แสดงหนังสือที่ว่างอีกครั้ง
console.log('\n8️⃣ Available Books (after return):');
const availableAfter = Book.getAvailable();
console.table(availableAfter);

db.close();