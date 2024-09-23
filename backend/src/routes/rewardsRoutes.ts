import { Router } from 'express';
import { getRewards, addReward, updateReward, deleteReward } from '../controllers/rewardsController';

const router = Router();

router.get('/', getRewards);
router.post('/', addReward);
router.put('/', updateReward);
router.delete('/:rewardID', deleteReward);

export default router;