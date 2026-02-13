// modules/storage.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class Storage {
  constructor() {
    this.dataFile = config.dataFile;
  }

  // อ่านข้อมูล tasks จากไฟล์
  async read() {
    try {
      // 1. ตรวจสอบว่าไฟล์มีอยู่หรือไม่
      // เราใช้ try-catch ซ้อนตรงนี้ เพราะ fs.access จะ throw error ถ้าหาไฟล์ไม่เจอ
      try {
        await fs.access(this.dataFile);
      } catch {
        // ถ้าไม่มีไฟล์ ให้ return empty array ตามโจทย์
        return [];
      }

      // 2. ถ้ามี ให้อ่านไฟล์ (ระบุ 'utf-8' เพื่อให้อ่านออกมาเป็นตัวหนังสือ)
      const data = await fs.readFile(this.dataFile, 'utf-8');

      // 3. แปลง JSON string เป็น Object แล้ว return
      return JSON.parse(data);

    } catch (error) {
      // กรณีไฟล์มีปัญหาอื่นๆ (เช่น permission, หรือ JSON ผิด format) จะเข้าตรงนี้
      logger.error(`Failed to read data: ${error.message}`);
      return [];
    }
  }

  // บันทึกข้อมูล tasks ลงไฟล์
  async write(data) {
    try {
      // 1. หาชื่อโฟลเดอร์จาก path ของไฟล์ (เช่นถ้า path คือ 'data/users.json' จะได้ 'data')
      const dir = path.dirname(this.dataFile);

      // 2. สร้างโฟลเดอร์ data ถ้ายังไม่มี
      // recursive: true คือหัวใจสำคัญ -> ถ้ามีโฟลเดอร์อยู่แล้วก็จะไม่ error, ถ้าไม่มีก็จะสร้างให้
      await fs.mkdir(dir, { recursive: true });

      // 3. แปลง data เป็น JSON string (แบบ pretty print)
      // null = ไม่มีการ filter ข้อมูล, 2 = ย่อหน้า 2 spaces ให้อ่านง่าย
      const jsonContent = JSON.stringify(data, null, 2);

      // 4. เขียนลงไฟล์
      await fs.writeFile(this.dataFile, jsonContent, 'utf-8');
      
      logger.success('Data saved successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
 async exportTo(filename, data) {
    try {
      // 1. หาโฟลเดอร์จาก filename ที่ระบุมา (เช่น 'backups/2023.json' -> 'backups')
      const dir = path.dirname(filename);

      // 2. สร้างโฟลเดอร์นั้นถ้ายังไม่มี (สำคัญมากสำหรับการ export ไป path ใหม่ๆ)
      await fs.mkdir(dir, { recursive: true });

      // 3. แปลง data เป็น JSON string
      const jsonContent = JSON.stringify(data, null, 2);

      // 4. เขียนไฟล์ไปยัง filename ที่ระบุ
      await fs.writeFile(filename, jsonContent, 'utf-8');
      
      logger.success(`Data exported to ${filename}`);
      return true;

    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      // 1. อ่านไฟล์จาก path ที่ระบุ (filename)
      // การใส่ 'utf-8' สำคัญมาก เพื่อให้ได้ผลลัพธ์เป็น String ไม่ใช่ Buffer
      const data = await fs.readFile(filename, 'utf-8');

      // 2. แปลง JSON string เป็น Object แล้ว return ออกไป
      // ถ้าไฟล์มี แต่ข้างในไม่ใช่ JSON ที่ถูกต้อง บรรทัดนี้จะ throw error ไปที่ catch
      return JSON.parse(data);

    } catch (error) {
      // กรณีไฟล์หาไม่เจอ (ENOENT) หรือ JSON พัง (SyntaxError)
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();