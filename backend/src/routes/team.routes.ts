import { Router } from 'express';
import { TeamController } from '../controllers/team.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/my', authenticate, TeamController.getMyTeams);
router.get('/:teamId', authenticate, TeamController.getTeam);
router.post('/:teamId/notes', authenticate, TeamController.addNote);

export default router;
