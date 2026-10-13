import { describe, test, expect } from 'vitest';
import { validateRequestInput, isValidStatus } from '../../src/validators/requestValidator.js';

const valid = {
  requesterName: 'สมชาย ใจดี',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 301',
  details: 'แอร์ไม่เย็นตั้งแต่เช้า',
  priority: 'normal',
};
const withField = (patch) => ({ ...valid, ...patch });

describe('validateRequestInput — ข้อมูลถูกต้อง', () => {
  test('TC-01 ทุกช่องถูกต้อง → ไม่มี error', () => {
    expect(validateRequestInput(valid)).toEqual([]);
  });
});

describe('validateRequestInput — รายละเอียด (ค่าขอบ 10 ตัวอักษร)', () => {
  test('TC-02: 9 ตัวอักษร → error (ต่ำกว่าขอบ 1)', () => {
    expect(validateRequestInput(withField({ details: '123456789' }))).toHaveLength(1);
  });

  test('TC-03: 10 ตัวอักษรพอดี → ผ่าน (ค่าขอบ)', () => {
    expect(validateRequestInput(withField({ details: '1234567890' }))).toEqual([]);
  });

  test('TC-04: 11 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ details: '12345678901' }))).toEqual([]);
  });

  test('TC-05: ช่องว่างล้วน → error', () => {
    expect(validateRequestInput(withField({ details: '          ' }))).toHaveLength(1);
  });
});

describe('validateRequestInput — ชื่อผู้แจ้งและประเภทคำร้อง', () => {
  test('TC-06: ชื่อผู้แจ้งสั้นเกินไป (1 ตัวอักษร) → error', () => {
    expect(validateRequestInput(withField({ requesterName: 'ก' }))).toHaveLength(1);
  });

  test('TC-07: ชื่อผู้แจ้ง 2 ตัวอักษร → ผ่าน', () => {
    expect(validateRequestInput(withField({ requesterName: 'สม' }))).toEqual([]);
  });

  test('TC-08: ประเภทคำร้องนอกรายการ → error', () => {
    expect(validateRequestInput(withField({ requestType: 'ประเภทที่ไม่มีจริง' }))).toHaveLength(1);
  });

  test('TC-09: priority "urgent" → ผ่าน', () => {
    expect(validateRequestInput(withField({ priority: 'urgent' }))).toEqual([]);
  });
});

describe('validateRequestInput — input ผิดรูปแบบ', () => {
  test.each([
    ['null', null],
    ['array', []],
    ['ตัวเลข', 12345],
    ['undefined', undefined]
  ])('TC-10: input เป็น %s → error', (_, invalidInput) => {
    const errors = validateRequestInput(invalidInput);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('isValidStatus', () => {
  test('TC-11: "pending" → true', () => {
    expect(isValidStatus('pending')).toBe(true);
  });

  test('TC-12: "in-progress" → true', () => {
    expect(isValidStatus('in-progress')).toBe(true);
  });

  test('TC-13: "completed" → true', () => {
    expect(isValidStatus('completed')).toBe(true);
  });

  test('TC-14: สถานะนอกรายการ "done" → false', () => {
    expect(isValidStatus('done')).toBe(false);
  });
});
