import { Router } from 'express';
import { InterestController } from '../controllers/interest.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { expressInterestSchema } from '../validators/comment.validator.js';

const router = Router();

router.post('/:id/interest',
  authenticate,
  requireRole('UNIVERSITY', 'INDUSTRY'),
  validate(expressInterestSchema),
  InterestController.expressInterest
);
router.get('/:id/interests',
  authenticate,
  InterestController.listForProblem
);

export default router;
