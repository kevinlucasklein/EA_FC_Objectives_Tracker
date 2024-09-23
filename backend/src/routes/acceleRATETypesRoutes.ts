import { Router } from 'express';
import { getAcceleRATETypes, addAcceleRATEType, updateAcceleRATEType, deleteAcceleRATEType } from '../controllers/acceleRATETypesController';

const router = Router();

router.get('/', getAcceleRATETypes);
router.post('/', addAcceleRATEType);
router.put('/', updateAcceleRATEType);
router.delete('/:acceleRATEID', deleteAcceleRATEType);

export default router;