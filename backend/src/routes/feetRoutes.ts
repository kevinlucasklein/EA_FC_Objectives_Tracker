import { Router } from 'express';
import { getFeet, addFoot, updateFoot, deleteFoot } from '../controllers/feetController';

const router = Router();

router.get('/', getFeet);
router.post('/', addFoot);
router.put('/', updateFoot);
router.delete('/:footID', deleteFoot);

export default router;