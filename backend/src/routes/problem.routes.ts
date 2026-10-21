import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createProblemSchema, updateStatusSchema } from '../validators/problem.validator.js';
import { upload, enforceMagicBytesAndSave } from '../middleware/upload.js';
import { problemSubmitLimiter } from '../middleware/rateLimiter.js';
import { csrfGuard } from '../middleware/csrfGuard.js';

const router = Router();

router.get('/', ProblemController.list);
router.get('/:id', ProblemController.getById);

router.post(
  '/',
  authenticate,
  csrfGuard,
  requireRole('CITIZEN', 'DEPARTMENT_USER'),
  problemSubmitLimiter,
  upload.single('image'),
  enforceMagicBytesAndSave,
  validate(createProblemSchema),
  ProblemController.create
);

router.patch(
  '/:id/status',
  authenticate,
  csrfGuard,
  requireRole('INNOVATION_SOCIETY_ADMIN', 'ADMIN', 'DEPARTMENT_USER'),
  validate(updateStatusSchema),
  ProblemController.updateStatus
);

export default router;
