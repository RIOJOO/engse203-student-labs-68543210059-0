import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

let app;

beforeEach(async () => {
  await loadSeed();
  app = createApp();
});

const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};

describe('GET /api/requests', () => {
  test('??? array ???????????????? ????? 200', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('??? requesterName ?????? requester_id', async () => {
    const res = await request(app).get('/api/requests');
    expect(res.status).toBe(200);
    expect(res.body[0]).toHaveProperty('requesterName');
    expect(res.body[0]).not.toHaveProperty('requester_id');
  });

  test('???? ?status= ?????', async () => {
    const res = await request(app).get('/api/requests?status=pending');
    expect(res.status).toBe(200);
    for (const r of res.body) {
      expect(r.status).toBe('pending');
    }
  });

  test('SQL injection ???? ?status= ???????', async () => {
    const res = await request(app).get("/api/requests?status=' OR '1'='1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/requests/:id', () => {
  test('?? ? 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('REQ-001');
  });

  test('????? ? 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/requests', () => {
  test('????????????? ? 201 ? ????????????', async () => {
    const res = await request(app).post('/api/requests').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  test('???????????? ? 400 ??????????? error', async () => {
    const res = await request(app).post('/api/requests').send({});
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.details)).toBe(true);
  });
});

describe('PUT /api/requests/:id & DELETE /api/requests/:id', () => {
  test('PUT ???????????????? ? 200', async () => {
    const res = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('completed');
  });

  test('PUT ??????????????? ? 400', async () => {
    const res = await request(app).put('/api/requests/REQ-001').send({ status: 'invalid-status' });
    expect(res.status).toBe(400);
  });

  test('DELETE ????????????????? ? 204', async () => {
    const res = await request(app).delete('/api/requests/REQ-001');
    expect(res.status).toBe(204);
  });

  test('DELETE ?????????????? ? 404', async () => {
    const res = await request(app).delete('/api/requests/REQ-999');
    expect(res.status).toBe(404);
  });
});

describe('Regression Tests', () => {
  test('regression BUG #1: ????????????????????????????? 201', async () => {
    await request(app).delete('/api/requests/REQ-003');
    const res = await request(app).post('/api/requests').send(valid);
    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^REQ-\d{3}$/);
  });

  test('regression BUG #3: ?????????????????????????? ? 404', async () => {
    const res = await request(app).put('/api/requests/REQ-999').send({ status: 'in-progress' });
    expect(res.status).toBe(404);
  });
});

describe('Additional Coverage Tests', () => {
  test('GET /api/health คืน 200 พร้อม status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  test('GET /api/users คืน 200 พร้อม array รายชื่อ', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/users/:id/requests คืนคำร้องของผู้ใช้', async () => {
    const res = await request(app).get('/api/users/1/requests');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Route ที่ไม่มีอยู่จริง คืน 404', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    expect(res.status).toBe(404);
  });
});

describe('Coverage Booster Tests', () => {
  test('POST /api/requests สร้างผู้ใช้ใหม่ถ้าไม่เคยมีชื่อในระบบ (resolveUserId)', async () => {
    const res = await request(app).post('/api/requests').send({
      requesterName: 'ผู้ใช้ใหม่แกะกล่อง ไม่เคยมีในฐานข้อมูล',
      requestType: 'แจ้งซ่อม',
      location: 'ห้องทดสอบ 999',
      details: 'รายละเอียดสำหรับทดสอบความครอบคลุม เกินสิบตัวอักษรแน่นอน',
      priority: 'urgent'
    });
    expect(res.status).toBe(201);
  });

  test('ทดสอบ service getDbStatus โดยตรง', async () => {
    const { getDbStatus } = await import('../../src/services/requestService.js');
    const status = getDbStatus();
    expect(status.connected).toBe(true);
  });

  test('POST /api/requests กรณีส่งข้อมูลผิดพลาดชนิดอื่น', async () => {
    const res = await request(app).post('/api/requests').send({
      requesterName: 'ก',
      requestType: 'ประเภทที่ไม่มีอยู่จริง',
      location: '',
      details: 'สั้น',
      priority: 'super-urgent'
    });
    expect(res.status).toBe(400);
  });
});

describe('Final 85% Coverage Push Tests', () => {
  test('ทดสอบ service listUsers และ listRequestsByUser โดยตรง', async () => {
    const service = await import('../../src/services/requestService.js');
    const users = service.listUsers();
    expect(Array.isArray(users)).toBe(true);
    if (users.length > 0) {
      const userReqs = service.listRequestsByUser(users[0].id);
      expect(Array.isArray(userReqs)).toBe(true);
    }
  });

  test('GET / หน้าแรกของ API (dev message)', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('POST /api/requests ส่ง null/ไม่ใช่ object', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Content-Type', 'application/json')
      .send('null');
    expect(res.status).toBe(400);
  });
});
