const fs = require('fs');
const path = require('path');

// 1. Update api/src/app.js (คงคอมเมนต์และโครงสร้างเดิม ย้าย / ไปที่ /api และเสิร์ฟ static ก่อน)
const appCode = `import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // ── Logging ──
  app.use(morgan(config.isProd ? 'combined' : 'dev'));

  // ── CORS ──
  app.use(cors({
    origin: config.corsOrigin
  }));

  // ── Body Parser ──
  app.use(express.json());

  // ── Static Files (Production) ──
  if (config.isProd && fs.existsSync(config.staticDir)) {
    app.use(express.static(config.staticDir));
  }

  // ── Welcome route ──
  app.get('/api', (req, res) => {
    res.json({ message: 'Campus Service Request API' });
  });

  // ── API Routes ──
  app.use('/api/health', healthRoutes);
  app.use('/api/requests', requestRoutes);

  // ── SPA Fallback (Production) ──
  if (config.isProd && fs.existsSync(config.staticDir)) {
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(config.staticDir, 'index.html'));
    });
  }

  // ── 404 Handler สำหรับ API ──
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // ── Centralized Error Handler ──
  app.use(errorHandler);

  return app;
}
`;
fs.writeFileSync('api/src/app.js', appCode, 'utf8');

// 2. เคลียร์ localhost:3001 ใน frontend/src
function cleanFrontend(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) cleanFrontend(full);
    else if (/\.(jsx?|tsx?)$/.test(f)) {
      let code = fs.readFileSync(full, 'utf8');
      if (code.includes('localhost:3001')) {
        code = code.replace(/import\.meta\.env\.VITE_API_BASE_URL\s*\|\|\s*['"]http:\/\/localhost:3001['"]/g, 'import.meta.env.VITE_API_BASE_URL || ""');
        code = code.replace(/['"]http:\/\/localhost:3001['"]/g, '""');
        fs.writeFileSync(full, code, 'utf8');
      }
    }
  }
}
cleanFrontend('frontend/src');

// 3. เขียน README.md
const readme = `# Campus Service Request System

## สถาปัตยกรรม 3 ชั้น (3-Tier Architecture)
ระบบถูกออกแบบโดยแบ่งเป็น 3 ชั้น:
1. ชั้นแสดงผล (Presentation tier / Frontend): พัฒนาด้วย React และ Vite ดูแลส่วน UI
2. ชั้นตรรกะประยุกต์ (Application tier / Logic tier / API): พัฒนาด้วย Node.js และ Express.js ควบคุม business logic, routing และ validation
3. ชั้นข้อมูล (Data tier / Database tier): ใช้ฐานข้อมูล SQLite ผ่าน node:sqlite จัดเก็บตาราง users และ requests

## วิธีการรันระบบ (How to run with npm)
### Development
\`\`\`bash
# รัน API
cd api && npm run dev

# รัน Frontend
cd frontend && npm run dev
\`\`\`

### Production
\`\`\`bash
npm run build
npm run start
\`\`\`
`;
fs.writeFileSync('README.md', readme, 'utf8');

// 4. เขียน DATABASE_CHOICES.md
const dbChoices = `# บันทึกการเลือกเทคโนโลยีฐานข้อมูล (Database Choices)

## 1. เหตุผลที่เลือก SQLite และข้อจำกัด
- เหตุผล: SQLite เป็น relational database แบบ embedded file ใช้งานง่าย สะดวกในการติดตั้งและทดสอบ ไม่ต้องเปิด database server แยก
- ข้อจำกัด: ไม่รองรับ high concurrent write เนื่องจากมีการล็อกไฟล์เวลาเขียน

## 2. การเปรียบเทียบกับ NoSQL
- ตาราง users และ requests มีแบบแผนชัดเจน (schema) และมี Foreign Key เชื่อมความสัมพันธ์
- Relational Database (SQL) จึงดูแล Data Integrity ได้ดีกว่า NoSQL

## 3. การทำงานแบบ Asynchronous vs Synchronous
- ใน node:sqlite ทำงานแบบ DatabaseSync ซึ่งเป็น synchronous เขียนง่ายตรงไปตรงมา
- แต่ระบบที่มี I/O สูง ควรเลือก async database driver แบบ non-blocking เพื่อไม่ให้กระทบ Event Loop
`;
fs.writeFileSync('DATABASE_CHOICES.md', dbChoices, 'utf8');

console.log('PATCH_COMPLETED');
