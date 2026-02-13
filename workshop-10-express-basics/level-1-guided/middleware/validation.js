// middleware/validateUser.js
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  // 1. ตรวจสอบว่ามีข้อมูลส่งมาหรือไม่ (Required fields)
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name and email are required'
      }
    });
  }

  // 2. (Optional) ตรวจสอบรูปแบบ Email เบื้องต้น
  // Regex นี้เช็คแค่ว่าต้องมีตัวหนังสือ + @ + ตัวหนังสือ + . + ตัวหนังสือ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid email format'
      }
    });
  }

  // 3. ถ้าผ่านทุกด่าน ให้ไปทำงานต่อ (เรียก Controller)
  next();
};

module.exports = validateUser;