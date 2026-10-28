import * as tareasService from "../services/tareas.service.js";

import { sendSuccess } from "../utils/api-response.js";

import { validateMateriaId } from "../validators/materias.validator.js";

/**
 * Lista las tareas asociadas a una materia específica.
 * Recibe el ID de la materia desde la URL y el ID del usuario autenticado.
 * Devuelve las tareas encontradas o pasa cualquier error al middleware correspondiente.
 */
export async function listTareasByMateria(request, response, next) {
    try {
        // Valida que el ID recibido en la URL tenga un formato válido.
        const materiaId = validateMateriaId(request.params.id);

        // Consulta las tareas de la materia verificando también que pertenezca al usuario.
        const tareas = await tareasService.listTareasByMateria(request.user.id, materiaId);

        return sendSuccess(response, tareas, 200);
    } catch (error) {
        next(error);
    }
}