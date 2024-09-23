import { Router } from 'express';
import { getObjectives, addObjective, updateObjective, deleteObjective } from '../controllers/objectivesController';

const router = Router();

router.get('/', getObjectives);
router.post('/', addObjective);
router.put('/', updateObjective);
router.delete('/:objectiveID', deleteObjective);

export default router;