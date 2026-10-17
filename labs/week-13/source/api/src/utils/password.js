import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  if (typeof plain !== 'string') {
    throw new TypeError('Password must be a string');
  }
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  if (!plain || !stored || typeof plain !== 'string' || typeof stored !== 'string') {
    return false;
  }

  const parts = stored.split('$');
  if (parts.length !== 3) {
    return false;
  }

  const [scheme, salt, originalHash] = parts;
  if (scheme !== 'scrypt' || !salt || !originalHash) {
    return false;
  }

  try {
    const originalHashBuf = Buffer.from(originalHash, 'hex');
    const hashBuf = scryptSync(plain, salt, originalHashBuf.length);

    if (hashBuf.length !== originalHashBuf.length) {
      return false;
    }

    return timingSafeEqual(hashBuf, originalHashBuf);
  } catch {
    return false;
  }
}
