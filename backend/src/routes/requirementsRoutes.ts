import { Router } from 'express';
import { getRequirements, addRequirement, updateRequirement, deleteRequirement } from '../controllers/requirementsController';

const router = Router();

router.get('/', getRequirements);
router.post('/', addRequirement);
router.put('/', updateRequirement);
router.delete('/:requirementID', deleteRequirement);

export default router;