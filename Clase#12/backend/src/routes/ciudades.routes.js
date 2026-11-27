import { Router } from 'express';

import {
  createCity,
  deleteCity,
  getCity,
  listCities,
  replaceCity,
  updateCity,
} from '../controllers/ciudades.controller.js';

const router = Router();

router.get('/', listCities);
router.get('/:id', getCity);
router.post('/', createCity);
router.put('/:id', replaceCity);
router.patch('/:id', updateCity);
router.delete('/:id', deleteCity);

export default router;
