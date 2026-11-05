import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  replaceProject,
  updateProject,
} from '../controllers/proyectos.controller.js';

const router = Router();
router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', replaceProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
