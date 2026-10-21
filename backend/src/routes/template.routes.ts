import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller.js';

const router = Router();

router.get('/', TemplateController.getAll);
router.get('/:id', TemplateController.getById);

export default router;
