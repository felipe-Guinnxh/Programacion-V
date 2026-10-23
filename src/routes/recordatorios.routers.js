import { Router } from "express";

import {
    listRecordatorios,
    getRecordatorio,
    createRecordatorio,
    replaceRecordatorio,
    updateRecordatorio,
    deleteRecordatorio
} from "../controllers/recordatorios.controller.js";

const router = Router();

// Lista los recordatorios del usuario autenticado.
router.get("/", listRecordatorios);

// Obtiene un recordatorio específico usando su ID.
router.get("/:id", getRecordatorio);

// Crea un recordatorio para una tarea del usuario.
router.post("/", createRecordatorio);

// Reemplaza completamente un recordatorio existente.
router.put("/:id", replaceRecordatorio);

// Actualiza parcialmente un recordatorio existente.
router.patch("/:id", updateRecordatorio);

// Elimina un recordatorio usando su ID.
router.delete("/:id", deleteRecordatorio);

export default router;
