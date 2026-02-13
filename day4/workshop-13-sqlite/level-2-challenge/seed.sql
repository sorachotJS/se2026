-- seed.sql

-- หนังสือ 5 เล่ม
INSERT INTO books (title, author) VALUES
  ('Harry Potter', 'J.K. Rowling'),
  ('The Hobbit', 'J.R.R. Tolkien'),
  ('1984', 'George Orwell'),
  ('Python Programming', 'John Doe'),
  ('Web Development', 'Jane Smith');

-- สมาชิก 3 คน
INSERT INTO members (name, email, phone) VALUES
  ('สมชาย ใจดี', 'somchai@email.com', '0812345678'),
  ('สมหญิง รักเรียน', 'somying@email.com', '0823456789'),
  ('ชาติชาย มั่นคง', 'chatichai@email.com', '0834567890');

-- การยืมบางรายการ (ยังไม่คืน)
INSERT INTO borrowings (book_id, member_id) VALUES
  (1, 1),  -- สมชายยืม Harry Potter
  (3, 2);  -- สมหญิงยืม 1984
  
-- อัพเดทว่าหนังสือถูกยืมไปแล้ว
UPDATE books SET available = 0 WHERE id IN (1, 3);