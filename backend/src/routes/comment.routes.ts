import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCommentSchema } from '../validators/comment.validator.js';
import { commentLimiter } from '../middleware/rateLimiter.js';
import { csrfGuard } from '../middleware/csrfGuard.js';

const router = Router();

router.get('/:id/comments', CommentController.list);
router.post(
  '/:id/comments',
  authenticate,
  csrfGuard,
  commentLimiter,
  validate(createCommentSchema),
  CommentController.create
);

export default router;
