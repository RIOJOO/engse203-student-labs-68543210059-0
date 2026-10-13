import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

/**
 * Week 10 — เปลี่ยน service จากอ่านไฟล์ JSON เป็นฐานข้อมูล SQLite
 *
 * ตอนนี้ยังเป็นเวอร์ชัน Week 07 (อ่านไฟล์ JSON) อยู่
 * งานของสัปดาห์นี้คือเปลี่ยนให้ใช้ node:sqlite
 *
 * ⚠ กฎเหล็ก: signature ของทุกฟังก์ชันต้องเหมือนเดิมทุกตัว
 *   → controller และ frontend จะได้ไม่ต้องแก้เลย
 */

// ── ของเดิม Week 07 (อ่านไฟล์ JSON) — จะถูกแทนที่ ──
const HERE = path.dirname(fileURLToPath(import.meta.url));

// กำหนดตำแหน่งไฟล์ฐานข้อมูล (ใช้ DB_FILE ถ้า checker มีการกำหนดไว้)
const defaultDb = path.resolve(HERE, '../..', 'data', 'campus.db');
const DB_PATH = process.env.DB_FILE || defaultDb;

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');

// Helper หา user_id จากชื่อ ถ้าไม่มีให้สร้างใหม่ (Name Resolution)
function resolveUserId(name) {
  const findUser = db.prepare('SELECT id FROM users WHERE name = ?');
  const user = findUser.get(name);
  if (user) return user.id;

  const newId = `USR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
  const insertUser = db.prepare('INSERT INTO users (id, name) VALUES (?, ?)');
  insertUser.run(newId, name);
  return newId;
}

export async function loadSeed() {
  /**
   * TODO W10-1 (CP26) · เปิดฐานข้อมูลด้วย node:sqlite
   *   import { DatabaseSync } from 'node:sqlite'
   *   - เปิดไฟล์ campus.db (จากสัปดาห์ที่ 9)
   *   - สั่ง PRAGMA foreign_keys = ON  ⚠ สำคัญมาก
   *   - ถ้ายังไม่มีตาราง ให้สร้างจาก schema.sql
   *
   * TODO W10-2 (CP27) · ⚠ path ต้องอ้างจากตำแหน่งไฟล์นี้ ไม่ใช่จากที่รันคำสั่ง
   *   ใช้ fileURLToPath(import.meta.url) — ไม่งั้น dev กับ checker หาไฟล์คนละที่
   */
  const schemaPath = path.resolve(HERE, '../..', 'data', 'schema.sql');
  if (existsSync(schemaPath)) {
    const schemaSql = readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }
}

export function findAll(arg = {}) {
  /**
   * TODO W10-3 (CP28) · เปลี่ยนเป็น SELECT จากฐานข้อมูล
   *   - ใช้ JOIN กับตาราง users เพื่อคืน requesterName (ไม่ใช่ requester_id)
   *   - ตั้งชื่อคอลัมน์ด้วย AS ให้ตรงกับที่ frontend ใช้
   *   - ถ้ามี status ให้เติม WHERE r.status = ?
   *   คำใบ้: คัดลอก query จาก queries.sql ที่ทำสัปดาห์ที่แล้วมาปรับ
   */
  // รองรับทั้งแบบส่ง { status } เป็น object และแบบส่ง status เป็น string โดยตรง
  const status = typeof arg === 'string' ? arg : arg?.status;

  let query = `
    SELECT 
      r.id,
      u.name AS requesterName,
      r.request_type AS requestType,
      r.location,
      r.details,
      r.priority,
      r.status
    FROM requests r
    JOIN users u ON r.requester_id = u.id
  `;

  if (status) {
    query += ' WHERE r.status = ? ORDER BY r.created_at DESC';
    const stmt = db.prepare(query);
    return stmt.all(status);
  }

  query += ' ORDER BY r.created_at DESC';
  const stmt = db.prepare(query);
  return stmt.all();
}

export function findById(id) {
  /** TODO W10-4 (CP28) · SELECT ... WHERE r.id = ?  · ไม่พบให้คืน null */
  const query = `
    SELECT 
      r.id,
      u.name AS requesterName,
      r.request_type AS requestType,
      r.location,
      r.details,
      r.priority,
      r.status
    FROM requests r
    JOIN users u ON r.requester_id = u.id
    WHERE r.id = ?
  `;
  const stmt = db.prepare(query);
  const row = stmt.get(id);
  return row ?? null;
}

export function create(input) {
  /**
   * TODO W10-5 (CP29) · INSERT ลงฐานข้อมูล
   *   ⚠ frontend ส่ง requesterName (ชื่อ) มา แต่ตารางเก็บ requester_id (ตัวเลข)
   *   → ต้องหา id ของชื่อนั้นก่อน ถ้ายังไม่มีในระบบให้สร้าง user ใหม่
   *   นี่คือ "หน้าที่ของ service" ที่พูดถึงในบทที่ 9 ของสัปดาห์ที่แล้ว
   */
  const id = `REQ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();

  // รองรับ Transaction สำหรับ Challenge
  db.exec('BEGIN TRANSACTION;');
  try {
    const requesterId = resolveUserId(input.requesterName);

    const stmt = db.prepare(`
      INSERT INTO requests (id, requester_id, request_type, location, details, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      requesterId,
      input.requestType,
      input.location,
      input.details,
      input.priority || 'normal',
      'pending'
    );

    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }

  return findById(id);
}

export function updateStatus(id, status) {
  /** TODO W10-6 (CP30) · UPDATE requests SET status = ? WHERE id = ? · ไม่พบคืน null */
  const existing = findById(id);
  if (!existing) return null;

  const stmt = db.prepare('UPDATE requests SET status = ? WHERE id = ?');
  stmt.run(status, id);
  return findById(id);
}

export function remove(id) {
  /** TODO W10-7 (CP30) · DELETE FROM requests WHERE id = ? · ไม่พบคืน null */
  const existing = findById(id);
  if (!existing) return null;

  const stmt = db.prepare('DELETE FROM requests WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0 ? existing : null;
}