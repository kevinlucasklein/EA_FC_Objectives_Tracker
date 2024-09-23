import { Router } from 'express';
import { getTeams, addTeam, updateTeam, deleteTeam } from '../controllers/teamsController';

const router = Router();

router.get('/', getTeams);
router.post('/', addTeam);
router.put('/', updateTeam);
router.delete('/:teamID', deleteTeam);

export default router;