// 6-todo-app.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

// ==========================================
// Todo App Functions
// ==========================================

class TodoApp {
  // เพิ่ม todo ใหม่
  addTodo(task) {
    const insert = db.prepare('INSERT INTO todos (task) VALUES (?)');
    const result = insert.run(task);
    console.log(`✅ Added: "${task}" (ID: ${result.lastInsertRowid})`);
  }

  // แสดง todos ทั้งหมด
  showAll() {
    const todos = db.prepare('SELECT * FROM todos').all();
    console.log('\n📋 All Todos:');
    console.table(todos);
  }

  // แสดง todos ที่ยังไม่เสร็จ
  showPending() {
    const todos = db.prepare('SELECT * FROM todos WHERE done = 0').all();
    console.log('\n⏳ Pending Todos:');
    console.table(todos);
  }

  // แสดง todos ที่เสร็จแล้ว
  showCompleted() {
    const todos = db.prepare('SELECT * FROM todos WHERE done = 1').all();
    console.log('\n✅ Completed Todos:');
    console.table(todos);
  }

  // ทำเครื่องหมายว่าเสร็จ
  markAsDone(id) {
    const update = db.prepare('UPDATE todos SET done = 1 WHERE id = ?');
    const result = update.run(id);
    if (result.changes > 0) {
      console.log(`✅ Marked todo #${id} as done`);
    } else {
      console.log(`❌ Todo #${id} not found`);
    }
  }

  // ลบ todo
  deleteTodo(id) {
    const del = db.prepare('DELETE FROM todos WHERE id = ?');
    const result = del.run(id);
    if (result.changes > 0) {
      console.log(`🗑️ Deleted todo #${id}`);
    } else {
      console.log(`❌ Todo #${id} not found`);
    }
  }

  // แสดงสถิติ
  showStats() {
    const total = db.prepare('SELECT COUNT(*) as count FROM todos').get();
    const completed = db.prepare('SELECT COUNT(*) as count FROM todos WHERE done = 1').get();
    const pending = db.prepare('SELECT COUNT(*) as count FROM todos WHERE done = 0').get();

    console.log('\n📊 Statistics:');
    console.log(`  Total: ${total.count}`);
    console.log(`  ✅ Completed: ${completed.count}`);
    console.log(`  ⏳ Pending: ${pending.count}`);
  }
}

// ==========================================
// ทดสอบใช้งาน
// ==========================================

const app = new TodoApp();

console.log('🎮 Todo App Demo');
console.log('='.repeat(50));

// แสดงทั้งหมด
app.showAll();

// แสดงสถิติ
app.showStats();

// แสดงที่ยังไม่เสร็จ
app.showPending();

// ทำเครื่องหมายบางรายการว่าเสร็จ
app.markAsDone(2);
app.markAsDone(3);

// แสดงที่เสร็จแล้ว
app.showCompleted();

// แสดงสถิติใหม่
app.showStats();

// ปิดการเชื่อมต่อ
db.close();