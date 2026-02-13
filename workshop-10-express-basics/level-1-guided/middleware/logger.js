// middleware/logger.js

/**
 * Logger middleware - บันทึกข้อมูล request
 * จะแสดง: HTTP Method, URL, Timestamp
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`[${timestamp}] ${method} ${url}`);
  
  // เรียก next() เพื่อส่งต่อไปยัง middleware ถัดไป
  next();
};

module.exports = logger;