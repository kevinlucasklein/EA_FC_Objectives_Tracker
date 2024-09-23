import { Router } from 'express';
import { getBodyTypes, addBodyType, updateBodyType, deleteBodyType } from '../controllers/bodyTypesController';

const router = Router();

router.get('/', getBodyTypes);
router.post('/', addBodyType);
router.put('/', updateBodyType);
router.delete('/:bodyTypeID', deleteBodyType);

export default router;