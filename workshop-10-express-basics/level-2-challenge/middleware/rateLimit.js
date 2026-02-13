// middleware/rateLimit.js

const rateLimit = () => {
  // ใช้ Map เก็บ request count
  // Key: IP Address, Value: { count: number, startTime: number }
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000; // 15 min
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    // 1. เช็คว่า IP นี้มีใน Map หรือยัง
    if (!requests.has(ip)) {
      // ถ้ายังไม่มี ให้เริ่มบันทึกใหม่
      requests.set(ip, {
        count: 1,
        startTime: now
      });
      return next();
    }

    const requestData = requests.get(ip);

    // 2. ถ้ามี ให้เช็คว่าอยู่ใน time window หรือไม่
    // ถ้าเวลาปัจจุบัน - เวลาเริ่มต้น มากกว่า windowMs แสดงว่าหมดเวลาช่วงเดิมแล้ว -> รีเซ็ต
    if (now - requestData.startTime > windowMs) {
      requestData.count = 1;
      requestData.startTime = now;
      return next();
    }

    // 3. ถ้ายังอยู่ใน Time Window เดิม ให้นับจำนวน requests เพิ่ม
    requestData.count++;

    // 4. ถ้าเกิน limit ส่ง error 429
    if (requestData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests, please try again later.'
        }
      });
    }

    // ถ้าไม่เกิน ก็ให้ผ่านไปได้
    next();
  };
};

module.exports = rateLimit;