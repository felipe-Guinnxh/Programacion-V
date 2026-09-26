import { Router } from 'express';

import {
    listMaterias,
    getMaterias,
    createMateria,
    replaceMateria,
    updateMateria,
    deleteMateria
} from '../controllers/materias.controller.js';

import { listTareasByMateria } from '../controllers/tareas.controller.js';

const router = Router();

// Obtiene la lista de materias del usuario autenticado.
router.get("/", listMaterias);

// Obtiene una materia específica usando su ID.
router.get("/:id", getMaterias);

// Obtiene las tareas asociadas a una materia específica.
router.get("/:id/tareas", listTareasByMateria);

// Crea una nueva materia para el usuario autenticado.
router.post("/", createMateria);

// Reemplaza completamente una materia existente.
router.put("/:id", replaceMateria);

// Actualiza parcialmente una materia existente.
router.patch("/:id", updateMateria);

// Elimina una materia usando su ID.
router.delete("/:id", deleteMateria);

export default router;