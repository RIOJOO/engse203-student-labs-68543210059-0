# Debug Log & Root Cause Analysis

## BUG #0: Validation Details Length Boundary Issue
- **อาการ:** คำร้องที่มีความยาวรายละเอียด 10 ตัวอักษรพอดีถูกปฏิเสธด้วยรหัส 400
- **สาเหตุ:** ใน `api/src/validators/requestValidator.js` ใช้เงื่อนไข `details.length <= 10` ทำให้ค่าขอบ (10 ตัวอักษร) ตกเงื่อนไขข้อผิดพลาด
- **วิธีแก้:** เปลี่ยนเครื่องหมายเงื่อนไขเป็น `< 10` (`< MIN_DETAILS`)
- **การทดสอบ:** เพิ่ม Unit Test ครอบคลุมเคส 9 ตัวอักษร, 10 ตัวอักษรพอดี, และ 11 ตัวอักษร

## BUG #1: Conflict on ID Generation after Deleting Record
- **อาการ:** เมื่อลบคำร้องรายการตรงกลางออก แล้วเพิ่มคำร้องใหม่ เซิร์ฟเวอร์ตอบกลับ 500 (Internal Server Error)
- **สาเหตุ:** การสร้าง ID ถัดไปใน `nextId()` ใช้คำสั่ง `SELECT COUNT(*) FROM requests` พอลบข้อมูลกลางออก `COUNT(*) + 1` จะได้เลขที่ชนกับ Primary Key เดิมใน SQLite
- **วิธีแก้:** เปลี่ยนจากการนับ `COUNT(*)` มาเป็นการค้นหาค่าตัวเลข ID ที่มากที่สุด (`MAX`) แล้วบวก 1
- **การทดสอบ:** เขียน Regression Test ลบรายการแล้วส่ง POST สร้างคำร้องใหม่ ต้องได้ 201 Created

## BUG #2: Dashboard Count for In-Progress Requests Miscalculated
- **อาการ:** แดชบอร์ดสรุปยอดคำร้องแสดงจำนวน "กำลังดำเนินการ" เป็น 0 ทั้งที่มีข้อมูล
- **สาเหตุ:** ใน `frontend/src/utils/requestSummary.js` มีการระบุคีย์สถานะไม่ตรงกับ API
- **วิธีแก้:** แก้ไขให้ฟังก์ชัน `count('in-progress')` ตรงกับสถานะในฐานข้อมูล
- **การทดสอบ:** เขียน Unit Test ในฝั่ง Frontend ทดสอบการนับรวมสถานะต่างๆ รวมถึง in-progress

## BUG #3: PUT Request with Non-existent ID Causes 500 Error
- **อาการ:** ยิง PUT อัปเดตคำร้องที่ไม่มีในระบบแล้วได้ HTTP 500 แทนที่จะได้ HTTP 404
- **สาเหตุ:** ใน `requestController.js` มีการเรียก `console.log(updated.id)` ก่อนที่จะตรวจสอบว่า `updated` เป็น `null` หรือไม่ เมื่อหาไม่เจอจึงโยน TypeError
- **วิธีแก้:** ย้ายเงื่อนไขเช็ค `if (!updated)` ให้ส่งตอบกลับ 404 ก่อนที่จะเข้าถึง property ของอ็อบเจกต์
- **การทดสอบ:** เขียน Regression Test สำหรับยิง PUT `/api/requests/REQ-999` ต้องได้รับ HTTP 404
