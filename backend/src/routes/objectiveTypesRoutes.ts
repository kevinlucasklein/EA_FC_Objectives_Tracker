import { Router } from 'express';
import { getObjectiveTypes, addObjectiveType, updateObjectiveType, deleteObjectiveType } from '../controllers/objectiveTypesController';

const router = Router();

router.get('/', getObjectiveTypes);
router.post('/', addObjectiveType);
router.put('/', updateObjectiveType);
router.delete('/:typeID', deleteObjectiveType);

export default router;