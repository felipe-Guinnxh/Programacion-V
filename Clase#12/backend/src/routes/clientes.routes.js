import { Router } from 'express';
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  replaceClient,
  updateClient,
} from '../controllers/clientes.controller.js';

const router = Router();
router.get('/', listClients);
router.get('/:id', getClient);
router.post('/', createClient);
router.put('/:id', replaceClient);
router.patch('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
