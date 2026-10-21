import { Router } from 'express';
import { ChallengeController } from '../controllers/challenge.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { csrfGuard } from '../middleware/csrfGuard.js';

const router = Router();

// Public routes
router.get('/', ChallengeController.listChallenges);
router.post('/evaluate-quality', ChallengeController.evaluateQuality);
router.get('/:id', ChallengeController.getChallengeById);

// Protected routes
router.post(
  '/',
  authenticate,
  csrfGuard,
  requireRole('DEPARTMENT_USER', 'INNOVATION_SOCIETY_ADMIN'),
  ChallengeController.createChallenge
);

router.patch(
  '/:id/status',
  authenticate,
  csrfGuard,
  requireRole('INNOVATION_SOCIETY_ADMIN'),
  ChallengeController.updateStatus
);

export default router;
