import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();

// เก็บประวัติความผิดพลาดและเวลาปลดล็อก แยกตามอีเมล
const loginAttempts = new Map();
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 นาที (หน่วยเป็นมิลลิวินาที)

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }

  const { email, password } = req.body;
  const now = Date.now();

  let record = loginAttempts.get(email);

// 1. ตรวจสอบว่าบัญชีนี้กำลังโดนล็อกอยู่หรือไม่
  if (record && record.lockUntil && now < record.lockUntil) {
    const remainingMinutes = Math.ceil((record.lockUntil - now) / (60 * 1000));
    return res.status(429).json({ 
      error: `Too Many Requests: บัญชีถูกระงับชั่วคราว กรุณาลองใหม่ในอีก ${remainingMinutes} นาที` 
    });
  }

  // ถ้าพ้นเวลาล็อกแล้ว ให้รีเซ็ตสถานะ
  if (record && record.lockUntil && now >= record.lockUntil) {
    loginAttempts.delete(email);
    record = undefined;
  }

  const result = authService.login(email, password);
  
  if (!result) {
    // 2. ถ้าล็อกอินไม่ผ่าน ให้บันทึก/เพิ่มจำนวนครั้งที่ผิด
    if (!record) {
      record = { count: 1, lockUntil: null };
    } else {
      record.count += 1;
    }

    // ถ้าผิดครบ 5 ครั้ง ให้เริ่มตั้งเวลาล็อก 15 นาที
    if (record.count >= 5) {
      record.lockUntil = now + LOCKOUT_TIME;
    }

    loginAttempts.set(email, record);
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  // 3. ถ้าล็อกอินสำเร็จ (ได้ 200) ให้เคลียร์ประวัติทิ้ง
  loginAttempts.delete(email);

  res.status(200).json(result);
});

export default router;