import { Router } from 'express';
import { getConditions, addCondition, updateCondition, deleteCondition } from '../controllers/conditionsController';

const router = Router();

router.get('/', getConditions);
router.post('/', addCondition);
router.put('/', updateCondition);
router.delete('/:conditionID', deleteCondition);

export default router;