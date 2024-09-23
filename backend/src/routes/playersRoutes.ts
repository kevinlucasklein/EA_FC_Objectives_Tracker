import { Router } from 'express';
import { getPlayers, addPlayer, updatePlayer, deletePlayer } from '../controllers/playersController';

const router = Router();

router.get('/', getPlayers);
router.post('/', addPlayer);
router.put('/', updatePlayer);
router.delete('/:playerID', deletePlayer);

export default router;