import * as recordatoriosService from "../services/recordatorios.service.js";

import { sendNoContent, sendSuccess } from "../utils/api-response.js";

import {
    validateCreateRecordatorio,
    validatePatchRecordatorio,
    validateRecordatorioId,
    validateRecordatorioListQuery
} from "../validators/recordatorios.validator.js";

/**
 * Lista los recordatorios del usuario autenticado con filtros y paginación.
 * Valida los parámetros de la URL y devuelve los datos con su meta de paginación.
 */
export async function listRecordatorios(request, response, next) {
    try {
        const filters = validateRecordatorioListQuery(request.query);
        const result = await recordatoriosService.listRecordatorios(request.user.id, filters);
        return sendSuccess(response, result.data, 200, result.meta);
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene un recordatorio específico del usuario por su ID.
 */
export async function getRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        const recordatorio = await recordatoriosService.getRecordatorioById(request.user.id, id);
        return sendSuccess(response, recordatorio, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * Crea un recordatorio para una tarea del usuario. Responde con 201.
 */
export async function createRecordatorio(request, response, next) {
    try {
        const payload = validateCreateRecordatorio(request.body);
        const recordatorio = await recordatoriosService.createRecordatorio(request.user.id, payload);
        return sendSuccess(response, recordatorio, 201);
    } catch (error) {
        next(error);
    }
}

/**
 * Reemplaza todos los datos de un recordatorio existente (PUT).
 */
export async function replaceRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        const payload = validateCreateRecordatorio(request.body);
        const recordatorio = await recordatoriosService.replaceRecordatorio(request.user.id, id, payload);
        return sendSuccess(response, recordatorio, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * Actualiza solo los campos enviados de un recordatorio (PATCH).
 */
export async function updateRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        const payload = validatePatchRecordatorio(request.body);
        const recordatorio = await recordatoriosService.updateRecordatorio(request.user.id, id, payload);
        return sendSuccess(response, recordatorio, 200);
    } catch (error) {
        next(error);
    }
}

/**
 * Elimina un recordatorio del usuario. Responde con 204 sin contenido.
 */
export async function deleteRecordatorio(request, response, next) {
    try {
        const id = validateRecordatorioId(request.params.id);
        await recordatoriosService.deleteRecordatorio(request.user.id, id);
        return sendNoContent(response);
    } catch (error) {
        next(error);
    }
}
