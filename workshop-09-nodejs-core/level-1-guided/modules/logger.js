// modules/logger.js
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { config } = require('./config');

class Logger {
  constructor() {
    this.logFile = path.join(config.logDir, 'app.log');
  }

  // เขียน log ลงไฟล์
  async writeLog(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    try {
      await fs.appendFile(this.logFile, logMessage);
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
  }

  // Log ข้อความธรรมดา
  info(message) {
    console.log(chalk.blue('ℹ'), message);
    this.writeLog('info', message);
  }

  // Log ความสำเร็จ
  success(message) {
    console.log(chalk.green('✔'), message);
    this.writeLog('success', message);
  }

  // Log คำเตือน
  warning(message) {
    console.log(chalk.yellow('⚠'), message);
    this.writeLog('warning', message);
  }

  // Log ข้อผิดพลาด
  error(message) {
    console.log(chalk.red('✖'), message);
    this.writeLog('error', message);
  }
}

module.exports = new Logger();