import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { validate } from '../middleware/validate.js';
import { sessionSchema, profileSchema, assignRoleSchema } from '../validators/auth.validator.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { csrfGuard } from '../middleware/csrfGuard.js';

const router = Router();

// Session establishment via Firebase ID token exchange
router.post('/session', authLimiter, validate(sessionSchema), AuthController.session);
router.post('/login', authLimiter, AuthController.session); // Compatibility alias

// User profile registration and self-management
router.post('/profile', authenticate, csrfGuard, validate(profileSchema), AuthController.registerProfile);
router.get('/me', authenticate, AuthController.me);
router.post('/logout', authenticate, csrfGuard, AuthController.logout);

// MFA status recording
router.post('/mfa/enroll', authenticate, csrfGuard, AuthController.recordMfa);

// Administrative role assignment
router.post(
  '/assign-role',
  authenticate,
  csrfGuard,
  requireRole('INNOVATION_SOCIETY_ADMIN'),
  validate(assignRoleSchema),
  AuthController.assignRole
);

export default router;
