import { Router } from 'express';
import { getCountries, addCountry, updateCountry, deleteCountry } from '../controllers/countriesController';

const router = Router();

router.get('/', getCountries);
router.post('/', addCountry);
router.put('/', updateCountry);
router.delete('/:countryID', deleteCountry);

export default router;