import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => { await loadSeed(); app = createApp(); });

/**
 * TODO W10-TEST (🏠 CP33) · เขียน test อย่างน้อย 6 เคส ที่ยิงเข้าฐานข้อมูลจริง
 *   1. GET /api/requests → 200 และได้ array
 *   2. คืน requesterName ไม่ใช่ requester_id
 *   3. GET /:id พบ → 200 · ไม่พบ → 404
 *   4. POST ถูกต้อง → 201
 *   5. POST ไม่ครบ → 400
 *   6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
 */
describe('GET /api/requests', () => {
  // เคสที่ 1: GET /api/requests → 200 และได้ array
  test('1. GET /api/requests → 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  // เคสที่ 2: คืน requesterName ไม่ใช่ requester_id
  test('2. คืน requesterName ไม่ใช่ requester_id', async () => {
    const res = await request(app).get('/api/requests');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.length > 0);
    assert.ok('requesterName' in res.body[0]);
    assert.strictEqual('requester_id' in res.body[0], false);
  });

  // เคสที่ 3: GET /:id พบ → 200 · ไม่พบ → 404
  test('3. GET /:id พบ → 200 · ไม่พบ → 404', async () => {
    const found = await request(app).get('/api/requests/REQ-001');
    assert.strictEqual(found.status, 200);
    assert.strictEqual(found.body.id, 'REQ-001');

    const notFound = await request(app).get('/api/requests/REQ-999');
    assert.strictEqual(notFound.status, 404);
  });

  // เคสที่ 4: POST ถูกต้อง → 201
  test('4. POST ถูกต้อง → 201', async () => {
    const payload = {
      requesterName: 'สมชาย ใจดี',
      requestType: 'แจ้งซ่อม',
      location: 'ห้องปฏิบัติการ 301',
      details: 'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า',
      priority: 'normal'
    };
    const res = await request(app).post('/api/requests').send(payload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.requesterName, payload.requesterName);
  });

  // เคสที่ 5: POST ไม่ครบ → 400
  test('5. POST ไม่ครบ → 400', async () => {
    const res = await request(app).post('/api/requests').send({ requesterName: 'ก' });
    assert.strictEqual(res.status, 400);
  });

  // เคสที่ 6: ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
  test('6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด', async () => {
    const res = await request(app).get(`/api/requests?status=${encodeURIComponent("x' OR '1'='1")}`);
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 0);
  });
});