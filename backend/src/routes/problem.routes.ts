import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { createProblemSchema, updateStatusSchema } from '../validators/problem.validator.js';
import { upload } from '../middleware/upload.js';
import { problemSubmitLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', ProblemController.list);
router.get('/:id', ProblemController.getById);
router.post('/',
  authenticate,
  requireRole('CITIZEN'),
  problemSubmitLimiter,
  upload.single('image'),
  validate(createProblemSchema),
  ProblemController.create
);
router.patch('/:id/status',
  authenticate,
  validate(updateStatusSchema),
  ProblemController.updateStatus
);

export default router;
