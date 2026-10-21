import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Secure file access requires authentication
router.get('/:filename', authenticate, UploadController.serveFile);

export default router;
