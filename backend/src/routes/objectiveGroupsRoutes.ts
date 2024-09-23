import { Router } from 'express';
import { getObjectiveGroups, addObjectiveGroup, updateObjectiveGroup, deleteObjectiveGroup } from '../controllers/objectiveGroupsController';

const router = Router();

router.get('/', getObjectiveGroups);
router.post('/', addObjectiveGroup);
router.put('/', updateObjectiveGroup);
router.delete('/:groupID', deleteObjectiveGroup);

export default router;