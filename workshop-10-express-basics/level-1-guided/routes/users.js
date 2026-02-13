// routes/users.js
const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validation');

// Dummy data (จะใช้ database ในภายหลัง)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

/**
 * GET /api/users - Get all users
 * Query params: ?role=admin
 */
router.get('/',validateUser, (req, res) => {
  // 1. รับค่า page และ limit (ถ้าไม่มีให้กำหนดค่า Default เป็น หน้า 1, 10 รายการต่อหน้า)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { role } = req.query;

  // 2. กรองข้อมูลตาม role ก่อน (ถ้ามี)
  let filteredUsers = users;
  if (role) {
    filteredUsers = users.filter(u => u.role === role);
  }

  // 3. คำนวณตำแหน่งข้อมูล (Pagination Logic)
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // 4. ตัดข้อมูลตามหน้า (Slice array)
  const results = filteredUsers.slice(startIndex, endIndex);

  // 5. ส่งผลลัพธ์กลับไปพร้อม Pagination Metadata
  res.json({
    success: true,
    pagination: {
      totalItems: filteredUsers.length,       // จำนวนข้อมูลทั้งหมด (หลังกรอง)
      totalPages: Math.ceil(filteredUsers.length / limit), // จำนวนหน้าทั้งหมด
      currentPage: page,                      // หน้าปัจจุบัน
      limit: limit                            // จำนวนต่อหน้า
    },
    data: results // ข้อมูลของหน้านั้นๆ
  });
});

/**
 * GET /api/users/:id - Get user by ID
 * Route parameter: id
 */

// GET /api/users/search?q=John Doe
router.get('/search', (req, res) => {
  const query = req.query.q; // เปลี่ยนชื่อตัวแปรจาก id เป็น query ให้ไม่งง

  if (!query) {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
  }
  
  // ปรับปรุงการค้นหาให้รวมบางส่วน (Partial Match) และไม่สนตัวพิมพ์เล็กใหญ่ (Case Insensitive)
  const user = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));

  // หมายเหตุ: ใช้ filter แทน find เพราะอาจเจอหลายคน
  res.json({
    success: true,
    data: user
  });
});


router.get('/:id', (req, res) => {
  // แปลง id จาก string เป็น number
  const id = parseInt(req.params.id);

  // หา user
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: user
  });
});



/**
 * POST /api/users - Create new user
 * Body: { name, email, role }
 */
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name and email are required'
      }
    });
  }

  // สร้าง user ใหม่
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id - Update user
 * Body: { name, email, role }
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

/**
 * DELETE /api/users/:id - Delete user
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // ลบ user
  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;