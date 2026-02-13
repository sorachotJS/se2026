// src/config/database.js
const mongoose = require('mongoose');

/**
 * เชื่อมต่อ MongoDB
 */
const connectDB = async () => {
  try {
    const options = {
      // ไม่ต้องใส่ useNewUrlParser และ useUnifiedTopology แล้ว (deprecated)
      // autoIndex: process.env.NODE_ENV === 'development', // สร้าง index อัตโนมัติใน dev
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📚 Database: ${conn.connection.name}`);

    // Event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 MongoDB connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;