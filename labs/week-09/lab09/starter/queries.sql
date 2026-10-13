-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์ (CP22)
-- ENGSE203 สัปดาห์ที่ 9 · ทุกข้อทดสอบรันกับ campus.db แล้ว
-- ═══════════════════════════════════════════════════════════

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT * FROM requests ORDER BY id;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ (status = 'pending')
SELECT id, location, details
FROM requests
WHERE status = 'pending'
ORDER BY id;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ — ใช้เงื่อนไข 2 ข้อพร้อมกัน
SELECT id, location, details, status
FROM requests
WHERE priority = 'urgent'
  AND status != 'completed'
ORDER BY id;

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด (LIKE + % ทั้งสองข้าง)
SELECT id, details
FROM requests
WHERE details LIKE '%ห้องปฏิบัติการ%'
ORDER BY id;

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง — ต้อง JOIN เพราะชื่ออยู่คนละตาราง
--    ผลลัพธ์มีคอลัมน์ requesterName เหมือนที่ API ส่งให้ React ใน Week 07
SELECT r.id,
       u.name AS requesterName,
       r.request_type,
       r.location,
       r.status
FROM requests r
JOIN users u ON u.id = r.requester_id
ORDER BY r.id;

-- ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง (JOIN + WHERE)
SELECT r.id, u.name AS requesterName, r.details, r.status
FROM requests r
JOIN users u ON u.id = r.requester_id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน (DISTINCT)
SELECT DISTINCT u.name, u.department
FROM requests r
JOIN users u ON u.id = r.requester_id
ORDER BY u.name;

-- ⑧ คำร้อง 3 รายการล่าสุด (ORDER BY ... DESC + LIMIT)
SELECT id, location, details, created_at
FROM requests
ORDER BY created_at DESC
LIMIT 3;

-- ⭐ Challenge ─────────────────────────────────────────────
-- ⑨ นับจำนวนคำร้องแยกตามสถานะ (GROUP BY + COUNT)
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC, status;

-- ⑩ ใครแจ้งคำร้องมากที่สุด — LEFT JOIN เพื่อให้คนที่ยังไม่เคยแจ้งติดมาด้วย
SELECT u.name, u.department, COUNT(r.id) AS total
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id
ORDER BY total DESC, u.name;

-- ⑪ สร้าง INDEX ให้การค้นด้วย status เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
