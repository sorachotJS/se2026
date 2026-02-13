// src/app.js
const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todos');
const path = require('path'); // 1. อย่าลืม require path ไว้บนสุดไฟล์

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// Routes
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Todo API with MongoDB',
//     version: '1.0.0',
//     database: 'MongoDB',
//     endpoints: {
//       todos: '/api/todos'
//     }
//   });
// });
app.get('/', (req, res) => {
  // 2. ใช้ res.sendFile แทน res.json
  // __dirname คือโฟลเดอร์ปัจจุบันของไฟล์นี้
  // path.join จะช่วยต่อ path ให้ถูกต้องไม่ว่าใช้ Windows หรือ Mac
  res.sendFile('C:/Users/ASUS/OneDrive/เอกสาร/index.html');
});

app.use('/api/todos', todoRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found'
    }
  });
});

// Error Handler
app.use((err, req, res) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

module.exports = app;