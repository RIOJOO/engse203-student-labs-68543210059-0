import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate, requireRole } from '../middleware/auth.js';


const router = Router();

// route เจาะจงต้องมาก่อน route ที่มี :id เสมอ
router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);
// 🏫 TODO W13-AUTH (CP51): เปลี่ยนสถานะและลบ ได้เฉพาะเจ้าหน้าที่
//   router.put('/:id', authenticate, requireRole('staff'), controller.updateRequestStatus);
//router.put('/:id', controller.updateRequestStatus);
//router.delete('/:id', controller.deleteRequest);

router.put('/:id', authenticate, requireRole('staff'), controller.updateRequestStatus); // เปลี่ยนเป็น รูปแบบที่ต้อง authenticate และ requireRole('staff') ก่อนเรียก controller
router.delete('/:id', authenticate, requireRole('staff'), controller.deleteRequest); //staff เท่านั้นที่สามารถลบคำร้องได้

export default router;