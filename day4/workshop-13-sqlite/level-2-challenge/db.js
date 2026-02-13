// db.js
const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('library.db');

// โหลดและรัน SQL file
function runSQL(filename) {
  const sql = fs.readFileSync(filename, 'utf-8');
  db.exec(sql);
  console.log(`✅ ${filename} executed`);
}

// สร้าง tables และใส่ข้อมูล
function reset() {
  console.log('🔄 Resetting database...');
  runSQL('schema.sql');
  runSQL('seed.sql');
  console.log('✅ Database ready!');
}

module.exports = { db, reset };