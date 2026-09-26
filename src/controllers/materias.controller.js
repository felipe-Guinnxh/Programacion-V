import * as materiasService from "../services/materias.service.js";
import { sendNoContent, sendSuccess } from "../utils/api-response.js";

import {
    validateCreateMateria,
    validateMateriaId,
    validateMateriaListQuery,
    validatePatchMateria
} from "../validators/materias.validator.js";

export async function listMaterias(request, response, next) {
    try {
        const filters = validateMateriaListQuery(request.query);
        const result = await materiasService.listMaterias(request.user.id, filters);
        return sendSuccess(response, result.data, 200, result.meta);
    } catch (error) {
        next(error);
    }
}
export async function getMaterias(request, response, next) {
    try {
        const id = validateMateriaId(request.params.id);
        const materia = await materiasService.getMateriaById(request.user.id, id);
        return sendSuccess(response, materia, 200);
    
    } catch (error) {
        return next(error);
    }
}

export async function createMateria(request, response, next) {
    try {
        const payload = validateCreateMateria(request.body);
        const materia = await materiasService.createMateria(request.user.id, payload);
        return sendSuccess(response, materia, 201);
    } catch (error) {
        next(error);
    }
}

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

export async function deleteMateria(request, response, next) {
    try {
        const id = validateMateriaId(request.params.id);
        await materiasService.deleteMateria(request.user.id, id);
        return sendNoContent(response);
    } catch (error) {
        next(error);
    }
}