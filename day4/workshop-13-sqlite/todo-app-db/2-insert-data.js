// 2-insert-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db'); // จะสร้างไฟล์ database.db ให้เองถ้ายังไม่มี

try {
  // 1. สร้างตาราง (ถ้ายังไม่มี)
  // สำคัญมาก! ต้องมีส่วนนี้ไม่งั้นจะเจอ Error "no such table: todos"
  console.log('🔨 Preparing database...');
  db.prepare(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL
    )
  `).run();

  // 2. ล้างข้อมูลเก่าก่อน (เพื่อให้ผลลัพธ์สวยงาม ไม่ซ้ำซ้อนตอนรันซ้ำ)
  // ถ้าใช้งานจริง ให้ลบบรรทัดนี้ออก
  db.prepare('DELETE FROM todos').run();
  console.log('🧹 Cleared old data');

  // 3. เตรียมข้อมูล
  const taskList = [
    'ซื้อของที่ตลาด',
    'ทำการบ้านคณิตศาสตร์',
    'ออกกำลังกาย',
    'อ่านหนังสือ',
    'ทำความสะอาดห้อง'
  ];

  // 4. เตรียม Statement
  const insertStmt = db.prepare('INSERT INTO todos (task) VALUES (?)');

  // 5. ใช้ Transaction (เพิ่มประสิทธิภาพ)
  // การทำงาน: จะรันคำสั่ง Insert ทั้งหมดรวดเดียว ถ้ามีอันไหนพัง จะยกเลิกทั้งหมด (Rollback)
  const insertMany = db.transaction((tasks) => {
    for (const task of tasks) {
      insertStmt.run(task);
    }
  });

  console.log('➕ Inserting new tasks...');
  insertMany(taskList); // เริ่มทำงาน

  console.log(`✅ Added ${taskList.length} todos successfully`);
  console.log('');

  // 6. ดูข้อมูลทั้งหมดเพื่อยืนยัน
  const todos = db.prepare('SELECT * FROM todos').all();
  
  console.log('📋 Current Todo List:');
  console.table(todos);

} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  // 7. ปิดการเชื่อมต่อเสมอ
  db.close();
  console.log('🔒 Database connection closed');
}