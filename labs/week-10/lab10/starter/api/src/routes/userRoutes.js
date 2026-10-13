import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_FILE || path.resolve(__dirname, '../../data/campus.db');
const db = new DatabaseSync(dbPath);

// GET /api/users - ดูรายชื่อ users ทั้งหมด
router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, name, created_at FROM users ORDER BY name ASC').all();
  res.json(users);
});

export default router;
