import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'ต้องเข้าสู่ระบบก่อนดำเนินการ' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
}

export function requireStaff(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'staff') {
      return res.status(403).json({ error: 'ต้องเป็นเจ้าหน้าที่เท่านั้น' });
    }
    next();
  });
}
