// modules/config.js
require('dotenv').config();

const config = {
  appName: process.env.APP_NAME || 'Task Manager',
  dataFile: process.env.DATA_FILE || './data/tasks.json',
  logLevel: process.env.LOG_LEVEL || 'info',
};

function validateConfig() {
  if (!config.dataFile) {
    throw new Error('DATA_FILE is required in .env');
  }
}

module.exports = { config, validateConfig };