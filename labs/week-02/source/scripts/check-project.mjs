import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'index.html',
  'vite.config.js',
  'public/data/learning-tasks.json',
  'src/api.js',
  'src/utils.js',
  'src/ui.js',
  'src/main.js',
  'src/style.css'
];

let missing = 0;
for (const file of requiredFiles) {
  if (!fs.existsSync(path.resolve(process.cwd(), file))) {
    console.error(`❌ ไม่พบไฟล์: ${file}`);
    missing++;
  }
}

if (missing > 0) {
  console.error(`\nตรวจสอบล้มเหลว: ขาดไฟล์ทั้งหมด ${missing} รายการ`);
  process.exit(1);
} else {
  console.log('✅ ตรวจสอบโครงสร้างโปรเจกต์ผ่านครบถ้วน');
}                                                                                                                               