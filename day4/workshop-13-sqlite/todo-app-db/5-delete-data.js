// 5-delete-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('🗑️ Deleting todos...');
console.log('');

// ก่อนลบ
console.log('Before delete:');
const before = db.prepare('SELECT COUNT(*) as total FROM todos').get();
console.log(`Total todos: ${before.total}`);
console.log('');

// ลบ todo ที่ id = 5
const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ?');
const result = deleteTodo.run(5);

console.log(`✅ Deleted ${result.changes} todo`);
console.log('');

// หลังลบ
console.log('After delete:');
const after = db.prepare('SELECT COUNT(*) as total FROM todos').get();
console.log(`Total todos: ${after.total}`);
console.log('');

// ดูข้อมูลที่เหลือ
console.log('Remaining todos:');
const remaining = db.prepare('SELECT * FROM todos').all();
console.table(remaining);

db.close();