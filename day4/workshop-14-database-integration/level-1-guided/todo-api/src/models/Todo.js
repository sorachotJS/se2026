// src/models/Todo.js
const dbManager = require('../db');

class Todo {
  constructor() {
    this.db = dbManager.getDb();
  }

  /**
   * ดึง todos ทั้งหมด
   */
  getAll() {
    const sql = `
      SELECT * FROM todos
      ORDER BY created_at DESC
    `;
    return this.db.prepare(sql).all();
  }

  /**
   * ดึง todo ตาม ID
   */
  getById(id) {
    const sql = `SELECT * FROM todos WHERE id = ?`;
    return this.db.prepare(sql).get(id);
  }

  /**
   * สร้าง todo ใหม่
   */
  create(task) {
    const sql = `
      INSERT INTO todos (task)
      VALUES (?)
    `;
    const result = this.db.prepare(sql).run(task);
    return this.getById(result.lastInsertRowid);
  }

  /**
   * อัพเดทสถานะ
   */
  updateStatus(id, done) {
    const sql = `
      UPDATE todos
      SET done = ?
      WHERE id = ?
    `;
    const result = this.db.prepare(sql).run(done, id);
    
    if (result.changes === 0) {
      return null;
    }
    
    return this.getById(id);
  }

  /**
   * ลบ todo
   */
  delete(id) {
    const sql = `DELETE FROM todos WHERE id = ?`;
    const result = this.db.prepare(sql).run(id);
    return result.changes > 0;
  }

  /**
   * ดูสถิติ
   */
  getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN done = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN done = 0 THEN 1 ELSE 0 END) as pending
      FROM todos
    `;
    return this.db.prepare(sql).get();
  }
}

module.exports = new Todo();