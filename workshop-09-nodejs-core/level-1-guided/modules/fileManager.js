// modules/fileManager.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class FileManager {
  constructor() {
    this.dataDir = config.dataDir;
  }

  // แสดงรายการไฟล์
  async listFiles() {
    try {
      const files = await fs.readdir(this.dataDir);
      
      if (files.length === 0) {
        logger.warning('No files found in data directory');
        return [];
      }

      logger.info(`Found ${files.length} file(s):`);
      
      for (const file of files) {
        const filePath = path.join(this.dataDir, file);
        const stats = await fs.stat(filePath);
        const type = stats.isDirectory() ? 'DIR ' : 'FILE';
        const size = stats.isFile() ? `${stats.size} bytes` : '';
        
        console.log(`  ${type} - ${file} ${size}`);
      }

      return files;
    } catch (error) {
      logger.error(`Failed to list files: ${error.message}`);
      throw error;
    }
  }

  // สร้างไฟล์
  async createFile(fileName, content = '') {
    try {
      const filePath = path.join(this.dataDir, fileName);
      
      // ตรวจสอบว่าไฟล์มีอยู่แล้วหรือไม่
      try {
        await fs.access(filePath);
        logger.warning(`File '${fileName}' already exists`);
        return false;
      } catch {
        // ไฟล์ยังไม่มี, ดำเนินการสร้าง
      }

      await fs.writeFile(filePath, content, 'utf-8');
      logger.success(`Created file: ${fileName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to create file: ${error.message}`);
      throw error;
    }
  }

  // อ่านไฟล์
  async readFile(fileName) {
    try {
      const filePath = path.join(this.dataDir, fileName);
      const content = await fs.readFile(filePath, 'utf-8');
      
      logger.info(`Content of '${fileName}':`);
      console.log('─'.repeat(50));
      console.log(content);
      console.log('─'.repeat(50));
      
      return content;
    } catch (error) {
      logger.error(`Failed to read file: ${error.message}`);
      throw error;
    }
  }

  // ลบไฟล์
  async deleteFile(fileName) {
    try {
      const filePath = path.join(this.dataDir, fileName);
      await fs.unlink(filePath);
      logger.success(`Deleted file: ${fileName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  // สร้างโฟลเดอร์
  async createDirectory(dirName) {
    try {
      const dirPath = path.join(this.dataDir, dirName);
      await fs.mkdir(dirPath, { recursive: true });
      logger.success(`Created directory: ${dirName}`);
      return true;
    } catch (error) {
      logger.error(`Failed to create directory: ${error.message}`);
      throw error;
    }
  }

  // คัดลอกไฟล์
  async copyFile(source, destination) {
    try {
      const sourcePath = path.join(this.dataDir, source);
      const destPath = path.join(this.dataDir, destination);
      
      await fs.copyFile(sourcePath, destPath);
      logger.success(`Copied ${source} to ${destination}`);
      return true;
    } catch (error) {
      logger.error(`Failed to copy file: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new FileManager();