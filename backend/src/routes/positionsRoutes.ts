import { Router } from 'express';
import { getPositions, addPosition, updatePosition, deletePosition } from '../controllers/positionsController';

const router = Router();

router.get('/', getPositions);
router.post('/', addPosition);
router.put('/', updatePosition);
router.delete('/:positionID', deletePosition);

export default router;