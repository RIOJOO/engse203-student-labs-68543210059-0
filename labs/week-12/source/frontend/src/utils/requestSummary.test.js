import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('คืนค่าเริ่มต้น 0 เมื่ออาร์เรย์ว่าง', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

  test('นับสถานะต่างๆ ได้อย่างถูกต้องรวมถึง in-progress (BUG #2)', () => {
    const data = [
      { id: 'REQ-001', status: 'pending' },
      { id: 'REQ-002', status: 'in-progress' },
      { id: 'REQ-003', status: 'in-progress' },
      { id: 'REQ-004', status: 'completed' }
    ];
    expect(summarizeRequests(data)).toEqual({ total: 4, pending: 1, inProgress: 2, completed: 1 });
  });

  test('รองรับ input ที่ไม่ใช่ array หรือ null/undefined', () => {
    expect(summarizeRequests(null)).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    expect(summarizeRequests(undefined)).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });
});
