import * as eventosService from "../services/eventos.service.js";

import { sendSuccess } from "../utils/api-response.js";

import { validateMateriaId } from "../validators/materias.validator.js";

/**
 * Lista los eventos asociados a una materia específica.
 * Recibe el ID de la materia desde la URL y el ID del usuario autenticado.
 * Devuelve los eventos encontrados o pasa cualquier error al middleware correspondiente.
 */
export async function listEventosByMateria(request, response, next) {
    try {
        // Valida que el ID recibido en la URL tenga un formato válido.
        const materiaId = validateMateriaId(request.params.id);

        // Consulta los eventos de la materia verificando también que pertenezca al usuario.
        const eventos = await eventosService.listEventosByMateria(request.user.id, materiaId);

        return sendSuccess(response, eventos, 200);
    } catch (error) {
        next(error);
    }
}