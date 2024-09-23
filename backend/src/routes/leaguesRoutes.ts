import { Router } from 'express';
import { getLeagues, addLeague, updateLeague, deleteLeague } from '../controllers/leaguesController';

const router = Router();

router.get('/', getLeagues);
router.post('/', addLeague);
router.put('/', updateLeague);
router.delete('/:leagueID', deleteLeague);

export default router;