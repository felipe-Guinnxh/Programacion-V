import * as tareasRepository from "../repositories/tareas.repositorio.js";

import * as materiasService from "./materias.service.js";

/**
 * Obtiene todas las tareas asociadas a una materia del usuario.
 * Recibe el ID del usuario y el ID de la materia.
 * Verifica primero que la materia exista y pertenezca al usuario, y luego devuelve sus tareas.
 */
export async function listTareasByMateria(userId, materiaId) {

    // Verifica que la materia exista y pertenezca al usuario antes de consultar sus tareas.
    await materiasService.getMateriaById(userId, materiaId);

    // Busca y devuelve todas las tareas asociadas a la materia.
    return tareasRepository.findAllByMateriaId(materiaId);

}