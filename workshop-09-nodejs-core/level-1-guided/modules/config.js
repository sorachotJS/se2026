require('dotenv').config();

const config = {
  appName: process.env.APP_NAME || 'File Manager',
  logLevel: process.env.LOG_LEVEL || 'info',
  dataDir: process.env.DATA_DIR || './data',
  logDir: process.env.LOG_DIR || './logs',
};

// ตรวจสอบ required environment variables
function validateConfig() {
  const required = ['APP_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = {
  config,
  validateConfig
};