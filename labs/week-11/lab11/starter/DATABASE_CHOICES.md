# บันทึกการเลือกเทคโนโลยีฐานข้อมูล (Database Choices)

## 1. เหตุผลที่เลือก SQLite และข้อจำกัด
- เหตุผล: SQLite เป็น relational database แบบ embedded file ใช้งานง่าย สะดวกในการติดตั้งและทดสอบ ไม่ต้องเปิด database server แยก
- ข้อจำกัด: ไม่รองรับ high concurrent write เนื่องจากมีการล็อกไฟล์เวลาเขียน

## 2. การเปรียบเทียบกับ NoSQL
- ตาราง users และ requests มีแบบแผนชัดเจน (schema) และมี Foreign Key เชื่อมความสัมพันธ์
- Relational Database (SQL) จึงดูแล Data Integrity ได้ดีกว่า NoSQL

## 3. การทำงานแบบ Asynchronous vs Synchronous
- ใน node:sqlite ทำงานแบบ DatabaseSync ซึ่งเป็น synchronous เขียนง่ายตรงไปตรงมา
- แต่ระบบที่มี I/O สูง ควรเลือก async database driver แบบ non-blocking เพื่อไม่ให้กระทบ Event Loop
