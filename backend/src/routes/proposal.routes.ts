import { Router } from 'express';
import { ProposalController } from '../controllers/proposal.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { csrfGuard } from '../middleware/csrfGuard.js';

const router = Router();

// Screening & Matching helpers
router.post('/eligibility-check', ProposalController.checkEligibility);
router.post('/calculate-match', ProposalController.calculateMatch);

// Proposals for a challenge
router.get('/challenge/:challengeId', ProposalController.getProposalsByChallenge);

// Submit proposal
router.post(
  '/',
  authenticate,
  csrfGuard,
  requireRole('STARTUP', 'INNOVATION_SOCIETY_ADMIN'),
  ProposalController.submitProposal
);

// Evaluator scoring
router.post(
  '/:id/evaluate',
  authenticate,
  csrfGuard,
  requireRole('EVALUATOR', 'INNOVATION_SOCIETY_ADMIN'),
  ProposalController.evaluateProposal
);

export default router;
