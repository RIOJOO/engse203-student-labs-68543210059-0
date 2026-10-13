PRAGMA foreign_keys = ON;

-- 1. ตาราง users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. ตาราง requests
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  requester_id TEXT NOT NULL,
  request_type TEXT NOT NULL,
  location TEXT NOT NULL,
  details TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);

-- Mock Data
INSERT OR IGNORE INTO users (id, name) VALUES 
  ('USR-001', 'สมชาย ใจดี'),
  ('USR-002', 'สุภาวดี รักเรียน');

INSERT OR IGNORE INTO requests (id, requester_id, request_type, location, details, priority, status) VALUES 
  ('REQ-001', 'USR-001', 'แจ้งซ่อม', 'ห้องปฏิบัติการ 301', 'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า', 'urgent', 'pending');
