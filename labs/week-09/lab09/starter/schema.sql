-- ═══════════════════════════════════════════════════════════
-- Campus Service Request — โครงสร้างฐานข้อมูล
-- ENGSE203 สัปดาห์ที่ 9 · หน่วยที่ 4
--
-- รันแล้วสร้างฐานข้อมูลได้ครบในครั้งเดียว และรันซ้ำได้โดยไม่ error
-- ═══════════════════════════════════════════════════════════

PRAGMA foreign_keys = ON;

-- ① ลบตารางเดิมก่อน เพื่อให้รันซ้ำได้
--   ลำดับสำคัญ: ลบ requests (ฝั่งที่ชี้ไป) ก่อน users (ฝั่งที่ถูกชี้)
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

-- ② ตาราง users — เก็บข้อมูลผู้แจ้งไว้ที่เดียว
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE
);

-- ③ ตาราง requests — อ้างถึงผู้แจ้งด้วย requester_id (FK)
CREATE TABLE requests (
  id            TEXT PRIMARY KEY,
  requester_id  INTEGER NOT NULL,
  request_type  TEXT NOT NULL
                CHECK (request_type IN ('แจ้งซ่อม','บริการบัญชีผู้ใช้','ขอใช้อุปกรณ์','อื่น ๆ')),
  location      TEXT NOT NULL,
  details       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('normal','urgent')),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','in-progress','completed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

-- ④ Index สำหรับคอลัมน์ที่ใช้ค้นและ JOIN บ่อย (Challenge)
CREATE INDEX IF NOT EXISTS idx_requests_status    ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);

-- ⑤ ข้อมูลตั้งต้น
INSERT INTO users (name, department, email) VALUES
  ('สมชาย ใจดี',       'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th'),
  ('สุภาวดี รักเรียน',  'วิศวกรรมซอฟต์แวร์', 'supawadee@rmutl.ac.th'),
  ('ธนกฤต ตั้งใจ',      'วิศวกรรมไฟฟ้า',     'thanakrit@rmutl.ac.th'),
  ('ปรียา ขยันยิ่ง',    'สำนักวิทยบริการ',   'preeya@rmutl.ac.th'),
  ('วรินทร์ มานะ',      'วิศวกรรมไฟฟ้า',     'warin@rmutl.ac.th');

INSERT INTO requests (id, requester_id, request_type, location, details, priority, status, created_at) VALUES
  ('REQ-001', 1, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 301',       'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า',        'urgent', 'pending',     '2026-10-05 08:30:00'),
  ('REQ-002', 2, 'บริการบัญชีผู้ใช้', 'อาคารวิศวกรรมซอฟต์แวร์',   'เข้าสู่ระบบห้องปฏิบัติการไม่ได้',           'normal', 'in-progress', '2026-10-05 09:15:00'),
  ('REQ-003', 3, 'ขอใช้อุปกรณ์',      'ห้องประชุม 2',             'ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน',       'normal', 'completed',   '2026-10-06 10:00:00'),
  ('REQ-004', 1, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 302',       'คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด',        'urgent', 'pending',     '2026-10-06 13:45:00'),
  ('REQ-005', 4, 'อื่น ๆ',             'ห้องสมุด ชั้น 2',          'ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ',       'normal', 'pending',     '2026-10-07 11:20:00'),
  ('REQ-006', 2, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 401',       'ไฟในห้องกะพริบตลอดเวลา',                   'normal', 'pending',     '2026-10-08 08:00:00'),
  ('REQ-007', 3, 'แจ้งซ่อม',          'อาคารวิศวกรรมไฟฟ้า ชั้น 3', 'น้ำรั่วจากเพดานหน้าห้องปฏิบัติการ',          'urgent', 'in-progress', '2026-10-09 14:10:00'),
  ('REQ-008', 4, 'บริการบัญชีผู้ใช้', 'ห้องสมุด ชั้น 1',          'ขอรีเซ็ตรหัสผ่านระบบยืมหนังสือ',            'normal', 'completed',   '2026-10-10 09:30:00'),
  ('REQ-009', 1, 'ขอใช้อุปกรณ์',      'ห้องประชุม 1',             'ขอยืมไมโครโฟนสำหรับงานสัมมนา',              'urgent', 'completed',   '2026-10-12 15:00:00');
