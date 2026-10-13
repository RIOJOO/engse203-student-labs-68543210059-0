# Campus Service Request System

## สถาปัตยกรรม 3 ชั้น (3-Tier Architecture)
ระบบถูกออกแบบโดยแบ่งเป็น 3 ชั้น:
1. ชั้นแสดงผล (Presentation tier / Frontend): พัฒนาด้วย React และ Vite ดูแลส่วน UI
2. ชั้นตรรกะประยุกต์ (Application tier / Logic tier / API): พัฒนาด้วย Node.js และ Express.js ควบคุม business logic, routing และ validation
3. ชั้นข้อมูล (Data tier / Database tier): ใช้ฐานข้อมูล SQLite ผ่าน node:sqlite จัดเก็บตาราง users และ requests

## วิธีการรันระบบ (How to run with npm)
### Development
```bash
# รัน API
cd api && npm run dev

# รัน Frontend
cd frontend && npm run dev
```

### Production
```bash
npm run build
npm run start
```
