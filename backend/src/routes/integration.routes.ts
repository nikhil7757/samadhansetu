import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller.js';

const router = Router();

// Simulated DPIIT Verification
router.get('/dpiit/:certificateNumber', IntegrationController.verifyDpiit);

// Simulated GeM Startup Runway Handoff Export
router.post('/gem/export', IntegrationController.exportToGem);

export default router;
