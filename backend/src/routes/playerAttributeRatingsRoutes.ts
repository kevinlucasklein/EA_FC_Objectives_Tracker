import { Router } from 'express';
import { getPlayerAttributeRatings, addPlayerAttributeRating, updatePlayerAttributeRating, deletePlayerAttributeRating } from '../controllers/playerAttributeRatingsController';

const router = Router();

router.get('/', getPlayerAttributeRatings);
router.post('/', addPlayerAttributeRating);
router.put('/', updatePlayerAttributeRating);
router.delete('/:ratingID', deletePlayerAttributeRating);

export default router;