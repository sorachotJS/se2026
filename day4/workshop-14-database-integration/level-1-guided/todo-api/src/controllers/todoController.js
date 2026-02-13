// src/controllers/todoController.js
const Todo = require('../models/Todo');

/**
 * ดึง todos ทั้งหมด
 * GET /api/todos
 */
exports.getAll = (req, res) => {
  try {
    const todos = Todo.getAll();
    
    res.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch todos',
        details: error.message
      }
    });
  }
};

/**
 * ดึง todo ตาม ID
 * GET /api/todos/:id
 */
exports.getById = (req, res) => {
  try {
    const { id } = req.params;
    const todo = Todo.getById(id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          code: 'TODO_NOT_FOUND'
        }
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error in getById:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch todo',
        details: error.message
      }
    });
  }
};

/**
 * สร้าง todo ใหม่
 * POST /api/todos
 */
exports.create = (req, res) => {
  try {
    const { task } = req.body;
    
    // Validation
    if (!task || task.trim() === '') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Task is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    if (task.length > 200) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Task must be less than 200 characters',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const newTodo = Todo.create(task.trim());
    
    res.status(201).json({
      success: true,
      data: newTodo
    });
  } catch (error) {
    console.error('Error in create:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create todo',
        details: error.message
      }
    });
  }
};

/**
 * อัพเดทสถานะ
 * PATCH /api/todos/:id
 */
exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    
    // Validation
    if (done === undefined || done === null) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'done field is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    if (typeof done !== 'boolean' && done !== 0 && done !== 1) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'done must be boolean or 0/1',
          code: 'VALIDATION_ERROR'
        }
      });
    }
    
    const doneValue = done ? 1 : 0;
    const updatedTodo = Todo.updateStatus(id, doneValue);
    
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          code: 'TODO_NOT_FOUND'
        }
      });
    }
    
    res.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update todo',
        details: error.message
      }
    });
  }
};

/**
 * ลบ todo
 * DELETE /api/todos/:id
 */
exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = Todo.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found',
          code: 'TODO_NOT_FOUND'
        }
      });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in delete:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete todo',
        details: error.message
      }
    });
  }
};

/**
 * ดูสถิติ
 * GET /api/todos/stats
 */
exports.getStats = (req, res) => {
  try {
    const stats = Todo.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch stats',
        details: error.message
      }
    });
  }
};