// 3-select-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('🔍 Selecting todos...');
console.log('');

// 1. ดึงทั้งหมด
console.log('1️⃣ All todos:');
const allTodos = db.prepare('SELECT * FROM todos').all();
console.table(allTodos);
console.log('');

// 2. ดึงเฉพาะที่ยังไม่เสร็จ (done = 0)
console.log('2️⃣ Pending todos (done = 0):');
const pendingTodos = db.prepare('SELECT * FROM todos WHERE done = 0').all();
console.table(pendingTodos);
console.log('');

// 3. ดึงตาม id
console.log('3️⃣ Todo with id = 1:');
const oneTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(1);
console.log(oneTodo);
console.log('');

// 4. นับจำนวน
console.log('4️⃣ Count todos:');
const count = db.prepare('SELECT COUNT(*) as total FROM todos').get();
console.log(`Total todos: ${count.total}`);
console.log('');

// 5. ดึงเฉพาะ columns ที่ต้องการ
console.log('5️⃣ Only task and done:');
const taskOnly = db.prepare('SELECT id, task, done FROM todos').all();
console.table(taskOnly);

db.close();