// server.js
require('dotenv').config();
const app = require('./src/app');
const dbManager = require('./src/db');

const PORT = process.env.PORT || 3000;

// เชื่อมต่อ database
dbManager.connect();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/todos`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  dbManager.close();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});