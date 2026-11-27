import { Router } from 'express';
import {
  createOffice,
  deleteOffice,
  getOffice,
  listOffices,
  replaceOffice,
  updateOffice,
} from '../controllers/oficinas.controller.js';

const router = Router();
router.get('/', listOffices);
router.get('/:id', getOffice);
router.post('/', createOffice);
router.put('/:id', replaceOffice);
router.patch('/:id', updateOffice);
router.delete('/:id', deleteOffice);

export default router;
