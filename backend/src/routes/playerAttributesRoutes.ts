import { Router } from 'express';
import { getPlayerAttributes, addPlayerAttribute, updatePlayerAttribute, deletePlayerAttribute } from '../controllers/playerAttributesController';

const router = Router();

router.get('/', getPlayerAttributes);
router.post('/', addPlayerAttribute);
router.put('/', updatePlayerAttribute);
router.delete('/:attributeID', deletePlayerAttribute);

export default router;