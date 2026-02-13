// middleware/requestTimer.js

/**
 * Request Timer middleware - วัดเวลาที่ใช้ในการ process request
 */
const requestTimer = (req, res, next) => {
  // บันทึกเวลาเริ่มต้น
  const start = Date.now();

  // Intercept res.send() เพื่อคำนวณเวลา
  const originalSend = res.send;
  
  res.send = function(...args) {
    // คำนวณเวลาที่ใช้
    const duration = Date.now() - start;
    console.log(`Request took ${duration}ms`);
    
    // เรียก original send
    originalSend.apply(res, args);
  };

  next();
};

module.exports = requestTimer;