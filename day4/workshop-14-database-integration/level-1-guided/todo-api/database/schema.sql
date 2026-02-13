-- database/schema.sql

-- ลบ table เก่า
DROP TABLE IF EXISTS todos;

-- สร้าง table todos
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL,
  done INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาเร็วขึ้น
CREATE INDEX idx_todos_done ON todos(done);

-- Trigger สำหรับ updated_at
CREATE TRIGGER update_todos_timestamp
AFTER UPDATE ON todos
FOR EACH ROW
BEGIN
  UPDATE todos SET updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.id;
END;