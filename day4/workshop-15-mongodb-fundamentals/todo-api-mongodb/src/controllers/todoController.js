// src/controllers/todoController.js
const Todo = require('../models/Todo');

/**
 * GET /api/todos
 * ดึง todos ทั้งหมด
 */
exports.getAll = async (req, res) => {
  try {
    const { done, priority, sort } = req.query;
    
    // Build filter
    const filter = {};
    if (done !== undefined) {
      filter.done = done === 'true';
    }
    if (priority) {
      filter.priority = priority;
    }

    // Build sort
    let sortOption = {};
    if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1 };
    }

    const todos = await Todo.find(filter).sort(sortOption);

    res.json({
      success: true,
      count: todos.length,
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
 * GET /api/todos/:id
 * ดึง todo ตาม ID
 */
exports.getById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

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
 * POST /api/todos
 * สร้าง todo ใหม่
 */
exports.create = async (req, res) => {
  try {
    const { task, priority, dueDate } = req.body;

    const todo = await Todo.create({
      task,
      priority,
      dueDate
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    // Validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }

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
 * PUT /api/todos/:id
 * แก้ไข todo ทั้งหมด
 */
exports.update = async (req, res) => {
  try {
    const { task, done, priority, dueDate } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { task, done, priority, dueDate },
      {
        new: true,           // return updated document
        runValidators: true  // run validations
      }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }

    console.error('Error in update:', error);
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
 * PATCH /api/todos/:id/done
 * Toggle done status
 */
exports.toggleDone = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    // ใช้ instance method
    await todo.toggleDone();

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

    console.error('Error in toggleDone:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to toggle todo',
        details: error.message
      }
    });
  }
};

/**
 * DELETE /api/todos/:id
 * ลบ todo
 */
exports.delete = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Todo not found'
        }
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid todo ID'
        }
      });
    }

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
 * GET /api/todos/stats
 * ดูสถิติ
 */
exports.getStats = async (req, res) => {
  try {
    // ใช้ static method
    const stats = await Todo.getStats();

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


// src/controllers/todoController.js
exports.getAll = async (req, res, next) => {
  try {
    // 1. Pagination Params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Query Params (เพิ่ม overdue เข้ามา)
    const { done, priority, sort, search, overdue } = req.query;

    // 3. Build Filter
    const filter = {};

    // --- Search ---
    if (search) {
      filter.task = { $regex: search, $options: 'i' };
    }

    // --- Priority ---
    if (priority) {
      filter.priority = priority;
    }

    // --- Overdue Logic ---
    if (overdue === 'true') {
      // งานที่เกินกำหนด คือ:
      // 1. วันที่ครบกำหนด (dueDate) น้อยกว่า ($lt) เวลาปัจจุบัน
      // 2. สถานะยังไม่เสร็จ (done: false)
      filter.dueDate = { $lt: new Date() };
      filter.done = false; 
    } else if (done !== undefined) {
      // ถ้าไม่ได้หา overdue ค่อยมาเช็ค filter done ปกติ
      filter.done = done === 'true';
    }

    // 4. Build Sort
    let sortOption = { createdAt: -1 }; // Default: ใหม่สุดขึ้นก่อน
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      sortOption = { priority: -1 };
    }

    // 5. Execute Query
    const todos = await Todo.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // นับจำนวนทั้งหมด (สำหรับ Pagination)
    const total = await Todo.countDocuments(filter);

    // 6. Response
    res.json({
      success: true,
      count: todos.length,
      pagination: {
        current: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit)
      },
      data: todos
    });

  } catch (error) {
    next(error);
  }
};

