// modules/taskManager.js
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');
const logger = require('./logger');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
    this.storage = storage; // สำคัญมาก! ต้องเก็บค่าไว้ใน this
  }

  // โหลด tasks จาก storage
  async loadTasks() {
    this.tasks = await storage.read();
    if (this.tasks.length > 0) {
      this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
    }
  }

  // บันทึก tasks ไปยัง storage
  async saveTasks() {
    await storage.write(this.tasks);
  }

  // เพิ่ม task ใหม่
  async addTask(title, priority = 'medium') {
    await this.loadTasks();

    // 1. ตรวจสอบ Priority (Validation)
    // ตรวจสอบว่า priority ที่ส่งมาเป็น low, medium, หรือ high หรือไม่?
    // ถ้าไม่ใช่ หรือพิมพ์ผิดมา ให้ดีดกลับไปเป็น 'medium' โดยอัตโนมัติ (หรือจะ throw error ก็ได้)
    const validPriorities = ['low', 'medium', 'high'];
    const finalPriority = validPriorities.includes(priority.toLowerCase()) 
      ? priority.toLowerCase() 
      : 'medium';

    // 2. สร้าง task object ใหม่
    const task = {
      id: this.nextId++,                 // ใช้ Timestamp เป็น ID (ง่ายและไม่ซ้ำสำหรับ Local App)
      title: title,
      priority: finalPriority,
      completed: false,               // เริ่มต้น Task ต้องยังไม่เสร็จ (false)
      createdAt: new Date().toISOString() // เก็บวันที่แบบมาตรฐานสากล (ISO format)
    };

    this.tasks.push(task);
    await this.saveTasks();
    
    logger.success(`Task added: "${title}" (ID: ${task.id})`);
    return task;
  }

  // แสดงรายการ tasks
  async listTasks(filter = 'all') {
    await this.loadTasks();

    if (this.tasks.length === 0) {
      logger.warning('No tasks found');
      return;
    }

    // 1. กรอง tasks ตาม filter (all/pending/completed)
    let filteredTasks = this.tasks;
    
    if (filter === 'pending') {
      filteredTasks = this.tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filteredTasks = this.tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
      logger.warning(`No ${filter} tasks found`);
      return;
    }

    // แสดงผลแบบ table
    logger.info(`\n${filter.toUpperCase()} TASKS:\n`);
    
    // 2. จัดรูปแบบข้อมูลให้แสดงเป็น table
    // เราใช้ .map() เพื่อแปลงข้อมูลดิบ (Raw Data) ให้เป็น format ที่อ่านง่ายขึ้นสำหรับมนุษย์
    const tableData = filteredTasks.map(task => ({
      ID: task.id,
      Title: task.title,
      Priority: task.priority.toUpperCase(), // ทำเป็นตัวพิมพ์ใหญ่ให้ดูเด่น
      Status: task.completed ? 'DONE' : 'PENDING', // แปลง true/false เป็นข้อความ
      Created: new Date(task.createdAt).toLocaleString() // แปลงวันที่ให้เป็นเวลาท้องถิ่น
    }));

    // ใช้ console.table เพื่อแสดงผลเป็นตารางอัตโนมัติ
    console.table(tableData);
    
    console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
  }

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    // 1. หา task จาก id
    // ใช้ == (Loose equality) เพื่อให้เทียบ string '123' กับ number 123 ได้
    // เพราะค่าที่รับจาก CLI มักจะเป็น String แต่ ID เราเก็บเป็น Number
    const task = this.tasks.find(t => t.id == id);

    // กรณีหาไม่เจอ ให้แจ้ง Error และจบการทำงานทันที
    if (!task) {
      logger.error(`Task with ID ${id} not found.`);
      return;
    }

    // 2. เปลี่ยน completed เป็น true
    // เนื่องจาก object ใน JS เป็น Reference type การแก้ค่าตรงนี้จะไปแก้ใน this.tasks ด้วย
    task.completed = true;

    // 3. เพิ่ม completedAt timestamp
    task.completedAt = new Date().toISOString();
    
    await this.saveTasks();
    logger.success(`Task ${id} marked as completed`);
  }

  // ลบ task
  async deleteTask(id) {
    await this.loadTasks();

    // 1. หาตำแหน่ง (Index) ของ Task ที่มี id ตรงกัน
    // ใช้ == เพื่อรองรับกรณี id เป็น String (จาก CLI) เทียบกับ Number (ในไฟล์)
    const index = this.tasks.findIndex(t => t.id == id);

    // 2. ตรวจสอบว่าหา task เจอหรือไม่
    // ถ้า findIndex หาไม่เจอ มันจะคืนค่า -1
    if (index === -1) {
      logger.error(`Task with ID ${id} not found.`);
      return;
    }

    // 3. ลบ Task ออกจาก Array
    // splice(ตำแหน่งที่จะลบ, จำนวนที่จะลบ)
    this.tasks.splice(index, 1);

    await this.saveTasks();
    logger.success(`Task ${id} deleted`);
  }

  // แก้ไข task
  async updateTask(id, newTitle) {
    await this.loadTasks();

    // 1. หา task จาก id
    // ใช้ == เพื่อรองรับทั้ง id ที่เป็นตัวเลขและ string
    const task = this.tasks.find(t => t.id == id);

    // ตรวจสอบว่าหาเจอหรือไม่
    if (!task) {
      logger.error(`Task with ID ${id} not found.`);
      return;
    }

    // เก็บชื่อเก่าไว้ (เผื่ออยากแสดงใน Log ว่าเปลี่ยนจากอะไรเป็นอะไร)
    const oldTitle = task.title;

    // 2. แก้ไข title
    task.title = newTitle;

    // 3. เพิ่ม updatedAt timestamp
    // การมี field นี้ช่วยให้รู้ว่าข้อมูลมีการแก้ไขล่าสุดเมื่อไหร่
    task.updatedAt = new Date().toISOString();
    
    await this.saveTasks();
    logger.success(`Task ${id} updated: "${oldTitle}" -> "${newTitle}"`);
  }

  // แสดง statistics
 async showStats() {
    await this.loadTasks();

    // 1. คำนวณ statistics พื้นฐาน
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = total - completed;

    // 2. คำนวณเปอร์เซ็นต์ความสำเร็จ (กันกรณีหารด้วย 0)
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // 3. แยกตาม priority
    // ใช้ filter นับจำนวนของแต่ละ priority
    const high = this.tasks.filter(t => t.priority === 'high').length;
    const medium = this.tasks.filter(t => t.priority === 'medium').length;
    const low = this.tasks.filter(t => t.priority === 'low').length;
    
    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
    
    // แสดงผล statistics
    console.log(`\n📂 Total Tasks:    ${total}`);
    console.log(`✅ Completed:      ${completed} (${percent}%)`);
    console.log(`⏳ Pending:        ${pending}`);
    
    console.log('\n--- By Priority ---');
    console.log(`🔴 High:           ${high}`);
    console.log(`🟡 Medium:         ${medium}`);
    console.log(`🟢 Low:            ${low}`);

    console.log('\n' + '='.repeat(40) + '\n');
  }

  // Export tasks
 async exportTasks(filename) {
    await this.loadTasks(); // โหลดข้อมูลล่าสุดให้ชัวร์ก่อน export
    
    // TODO: ใช้ storage.exportTo() เพื่อ export
    
    // เรียกใช้เมธอด exportTo ของ object storage
    // พารามิเตอร์ที่ 1: ชื่อไฟล์ปลายทาง (filename)
    // พารามิเตอร์ที่ 2: ข้อมูลที่ต้องการเขียน (this.tasks)
    // await this.storage.exportTo(filename, this.tasks);
    await this.storage.exportTo(filename, this.tasks);
    
    // logger.success จะทำงานก็ต่อเมื่อบรรทัดบนไม่เกิด Error
    logger.success(`Tasks exported to ${filename}`);
  }

  // Import tasks
  async importTasks(filename) {
    // โหลด task ปัจจุบันมารอก่อน
    await this.loadTasks(); 
    
    // 1. ใช้ storage.importFrom() เพื่อ import
    const importedTasks = await this.storage.importFrom(filename);

    // Validation: ตรวจสอบว่าไฟล์ที่ import มาเป็น Array จริงไหม
    if (!Array.isArray(importedTasks)) {
      throw new Error('Invalid file format: content is not a list of tasks');
    }

    // 2. Merge และจัดการ ID ซ้ำ
    let addedCount = 0;
    let skippedCount = 0;

    for (const newTask of importedTasks) {
      // ตรวจสอบว่า ID นี้มีอยู่ในระบบเราแล้วหรือยัง?
      const exists = this.tasks.some(existingTask => existingTask.id === newTask.id);

      if (exists) {
        // ถ้ามีซ้ำ -> ข้าม (ไม่ทับข้อมูลเก่า)
        skippedCount++;
      } else {
        // ถ้าไม่ซ้ำ -> เพิ่มเข้า list
        this.tasks.push(newTask);
        addedCount++;
      }
    }
    
    // 3. บันทึกข้อมูลที่รวมร่างแล้วลงไฟล์
    await this.saveTasks();
    
    // แจ้งผลสรุปให้ User ทราบว่าเพิ่มไปกี่อัน และข้ามไปกี่อัน
    logger.success(`Imported ${addedCount} tasks from ${filename}`);
    if (skippedCount > 0) {
      logger.warning(`Skipped ${skippedCount} duplicate tasks`);
    }
  }
}

module.exports = new TaskManager();