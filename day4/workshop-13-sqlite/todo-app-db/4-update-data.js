// 4-update-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('✏️ Updating todos...');
console.log('');

// ก่อนแก้ไข
console.log('Before update:');
const before = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log(before);
console.log('');

// ทำเครื่องหมายว่าเสร็จแล้ว (done = 1)
const updateDone = db.prepare('UPDATE todos SET done = 1 WHERE id = ?');
updateDone.run(1);

console.log('✅ Marked todo #1 as done');
console.log('');

// หลังแก้ไข
console.log('After update:');
const after = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log(after);
console.log('');

// แก้ไขข้อความ
const updateTask = db.prepare('UPDATE todos SET task = ? WHERE id = ?');
updateTask.run('ซื้อของที่ตลาดและร้านขายยา', 1);

console.log('✅ Updated task text');
console.log('');

// ดูผลลัพธ์
console.log('Final result:');
const final = db.prepare('SELECT * FROM todos WHERE id = 1').get();
console.log(final);

db.close();