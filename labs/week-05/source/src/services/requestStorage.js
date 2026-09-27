/**
 * requestStorage.js — ชั้นจัดเก็บข้อมูลลง Web Storage
 *
 * กติกาที่ checker ตรวจจริง:
 *   - localStorage ต้องอยู่ในไฟล์นี้เท่านั้น
 *   - ห้ามใช้ localStorage.clear() ให้ใช้ localStorage.removeItem(STORAGE_KEY)
 *   - ข้อมูลที่เก็บต้องเป็น envelope มี schemaVersion เสมอ
 */

export const STORAGE_KEY = 'engse203-campus-requests-v1';
export const SCHEMA_VERSION = 1;

/**
 * TODO 5B-1 · อ่านข้อมูลคำร้องจาก localStorage
 *
 * คืน object { status, requests } โดย status เป็น:
 *   - 'missing' เมื่อไม่มีคีย์นี้ใน localStorage
 *   - 'valid'   เมื่อข้อมูลถูกต้องตาม schemaVersion และมี requests เป็น array
 *   - 'invalid' เมื่อ JSON เสีย หรือ schemaVersion ไม่ตรง หรือมี ID ซ้ำ
 *
 * ห้าม throw ออกจากฟังก์ชันนี้เด็ดขาด
 */
export function readStoredRequests() {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) {
    return { status: 'missing', requests: [] };
  }

  try {
    const parsed = JSON.parse(rawData);

    // ตรวจสอบ envelope structure และ schemaVersion
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed.schemaVersion !== SCHEMA_VERSION ||
      !Array.isArray(parsed.requests)
    ) {
      return { status: 'invalid', requests: [] };
    }

    // ตรวจสอบ id ซ้ำ
    const seenIds = new Set();
    for (const req of parsed.requests) {
      if (!req || typeof req !== 'object' || !req.id || seenIds.has(req.id)) {
        return { status: 'invalid', requests: [] };
      }
      seenIds.add(req.id);
    }

    return { status: 'valid', requests: parsed.requests };
  } catch {
    return { status: 'invalid', requests: [] };
  }
}

/**
 * TODO 5B-1 · บันทึกข้อมูลคำร้องลง localStorage
 *
 * ห่อ array ด้วย envelope ที่มี schemaVersion ก่อน serialize
 */
export function writeStoredRequests(requests) {
  const envelope = {
    schemaVersion: SCHEMA_VERSION,
    requests: requests,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

/**
 * TODO 5B-6 · ล้างข้อมูลคำร้องออกจาก localStorage
 *
 * ต้องใช้ removeItem ลบเฉพาะคีย์ของวิชานี้ ห้ามใช้ localStorage.clear()
 */
export function clearStoredRequests() {
  localStorage.removeItem(STORAGE_KEY);
}