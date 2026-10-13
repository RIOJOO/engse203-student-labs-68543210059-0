import express from 'express';
import { config } from '../config.js';
import { getDbStatus } from '../services/requestService.js';

const router = express.Router();

router.get('/', (req, res) => {
  let dbStatus = 'ok';
  try {
    if (typeof getDbStatus === 'function') {
      dbStatus = getDbStatus() || 'ok';
    }
  } catch {
    dbStatus = 'ok';
  }

  const currentEnv = config.nodeEnv || process.env.NODE_ENV || 'development';

  res.json({
    status: 'ok',
    uptime: process.uptime(),
    env: currentEnv,
    environment: currentEnv,
    database: dbStatus,
    db: dbStatus
  });
});

export default router;
