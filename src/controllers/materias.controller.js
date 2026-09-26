import * as materiasService from "../services/materias.service.js";
import { sendNoContent, sendSuccess } from "../utils/api-response.js";

import {
    validateCreateMateria,
    validateMateriaId,
    validateMateriaListQuery,
    validatePatchMateria
} from "../validators/materias.validator.js";

/**
 * Lista las materias del usuario aplicando los filtros enviados en la consulta.
 * Recibe la solicitud, valida los filtros y usa el servicio para obtener los datos y la paginación.
 * Devuelve las materias con su información de paginación.
 */
export async function listMaterias(request, response, next) {
    try {
        const filters = validateMateriaListQuery(request.query);
        const result = await materiasService.listMaterias(request.user.id, filters);
        return sendSuccess(response, result.data, 200, result.meta);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene una materia específica por su ID.
 * Recibe el ID desde los parámetros de la URL y el usuario desde la sesión autenticada.
 * Devuelve la materia encontrada o pasa el error al middleware correspondiente.
 */
export async function getMaterias(request, response, next) {
    try {
        const id = validateMateriaId(request.params.id);
        const materia = await materiasService.getMateriaById(request.user.id, id);
        return sendSuccess(response, materia, 200);
    
    } catch (error) {
        return next(error);
    }
}

/**
 * Crea una nueva materia para el usuario autenticado.
 * Recibe los datos de la materia en el cuerpo de la solicitud.
 * Valida la información y devuelve la materia creada con código 201.
 */
export async function createMateria(request, response, next) {
    try {
        const payload = validateCreateMateria(request.body);
        const materia = await materiasService.createMateria(request.user.id, payload);
        return sendSuccess(response, materia, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * Reemplaza completamente una materia existente.
 * Recibe el ID de la materia en la URL y todos los datos necesarios en el cuerpo de la solicitud.
 * Valida ambos valores y devuelve la materia actualizada.
 */
export async function replaceMateria(request, response, next) {
    try {
        const id = validateMateriaId(request.params.id);
        const payload = validateCreateMateria(request.body);
        const materia = await materiasService.replaceMateria(request.user.id, id, payload);
        return sendSuccess(response, materia, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * Actualiza parcialmente una materia existente.
 * Recibe el ID de la materia y solo los campos que se desean modificar.
 * Valida los datos y devuelve la materia después de aplicar los cambios.
 */
export async function updateMateria(request, response, next) {
    try {
        const id = validateMateriaId(request.params.id);
        const payload = validatePatchMateria(request.body);
        const materia = await materiasService.updateMateria(request.user.id, id, payload);
        return sendSuccess(response, materia, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * Elimina una materia del usuario autenticado.
 * Recibe el ID de la materia desde los parámetros de la URL.
 * Si la eliminación es correcta, responde sin contenido con código 204.
 */
export async function deleteMateria(request, response, next) {
    try {
        const id = validateMateriaId(request.params.id);
        await materiasService.deleteMateria(request.user.id, id);
        return sendNoContent(response);
    } catch (error) {
        next(error);
    }
}