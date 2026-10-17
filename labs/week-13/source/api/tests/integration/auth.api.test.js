import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { config } from '../../src/config.js';

const app = createApp();
beforeEach(async () => { await loadSeed(); });

const STAFF = { email: 'staff@campus.local', password: 'staffpassword' };

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });

  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope' });
    expect(r.status).toBe(401);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r.status).toBe(401);
  });

  test('token ปลอม (secret อื่น) → 401', async () => {
    const fakeToken = jwt.sign({ role: 'staff' }, 'wrong-secret');
    const r = await request(app).put('/api/requests/REQ-001').set('Authorization', `Bearer ${fakeToken}`).send({ status: 'completed' });
    expect(r.status).toBe(401);
  });

  test('token ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const studentToken = jwt.sign({ role: 'student' }, config.jwtSecret);
    const r = await request(app).put('/api/requests/REQ-001').set('Authorization', `Bearer ${studentToken}`).send({ status: 'completed' });
    expect(r.status).toBe(403);
  });
});
