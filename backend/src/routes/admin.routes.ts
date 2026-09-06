import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/problems/pending', AdminController.getPending);
router.patch('/problems/:id/approve', AdminController.approve);
router.patch('/problems/:id/reject', AdminController.reject);
router.post('/match', AdminController.createMatch);
router.get('/matches', AdminController.getAllMatches);

export default router;
