const db = require('../../src/config/database');

class Todo {
  static async getAll() {
    return await db.query('SELECT * FROM todos');
  }
  
  static async getById(id) {
    const result = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    return result[0];
  }
  
  static async create(data) {
    const result = await db.query('INSERT INTO todos SET ?', data);
    return { id: result.insertId, ...data };
  }
}

module.exports = Todo;