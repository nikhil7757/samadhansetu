import { Router } from 'express';
import { PilotController } from '../controllers/pilot.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { csrfGuard } from '../middleware/csrfGuard.js';

const router = Router();

// Public / listing
router.get('/', PilotController.listPilots);
router.get('/:id', PilotController.getPilotById);

// Create pilot (Admin / Dept)
router.post(
  '/',
  authenticate,
  csrfGuard,
  requireRole('DEPARTMENT_USER', 'INNOVATION_SOCIETY_ADMIN'),
  PilotController.createPilot
);

// Milestone deliverable submission (Startup)
router.post(
  '/:id/milestones/:mId/submit',
  authenticate,
  csrfGuard,
  requireRole('STARTUP', 'INNOVATION_SOCIETY_ADMIN'),
  PilotController.submitMilestoneDeliverable
);

// Milestone validation (Independent Validator)
router.post(
  '/:id/milestones/:mId/validate',
  authenticate,
  csrfGuard,
  requireRole('VALIDATOR', 'INNOVATION_SOCIETY_ADMIN'),
  PilotController.validateMilestone
);

// Milestone payment release (Department / Finance)
router.post(
  '/:id/milestones/:mId/release-payment',
  authenticate,
  csrfGuard,
  requireRole('DEPARTMENT_USER', 'INNOVATION_SOCIETY_ADMIN'),
  PilotController.approveAndReleasePayment
);

// Scale-up decision (Admin / Committee)
router.post(
  '/:id/scale-up-decision',
  authenticate,
  csrfGuard,
  requireRole('INNOVATION_SOCIETY_ADMIN'),
  PilotController.recordScaleUpDecision
);

export default router;
