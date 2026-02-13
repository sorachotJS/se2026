// middleware/validate.js
const Joi = require('joi');

// ✅ 1. ต้องประกาศ Schema ตรงนี้ก่อน (ส่วนบนของไฟล์)
const authorSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(50).required(),
  // birthYear ต้องเป็นตัวเลขจำนวนเต็ม
  birthYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required()
});

const bookSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  authorId: Joi.number().integer().required(),
  year: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  genre: Joi.string().min(2).max(50).required(),
  // ISBN ต้องเป็นตัวเลขหรือขีดเท่านั้น
  isbn: Joi.string().pattern(/^[0-9-]+$/).required()
});

// ✅ 2. จากนั้นค่อยสร้างฟังก์ชัน validate
const validate = (schema) => {
  return (req, res, next) => {
    // abortEarly: false เพื่อให้แจ้ง error ทั้งหมดทีเดียว ไม่หยุดที่ตัวแรก
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // เอา message ของทุก error มารวมกัน
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      
      const err = new Error(errorMessage);
      err.status = 400;
      return next(err);
    }

    // แทนค่า req.body ด้วยค่าที่ผ่านการ validate (Joi อาจมีการแปลง type ให้)
    req.body = value;
    next();
  };
};

// ✅ 3. สุดท้าย Export ออกไปใช้งาน
module.exports = {
  validateAuthor: validate(authorSchema), // ส่ง authorSchema ที่ประกาศข้างบนเข้าไป
  validateBook: validate(bookSchema)
};