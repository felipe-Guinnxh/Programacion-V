import * as eventosRepository from "../repositories/eventos.repositorio.js";

import * as materiasService from "./materias.service.js";

/**
 * Obtiene todos los eventos asociados a una materia del usuario.
 * Recibe el ID del usuario y el ID de la materia.
 * Verifica primero que la materia exista y pertenezca al usuario, y luego devuelve sus eventos.
 */
export async function listEventosByMateria(userId, materiaId) {

    // Verifica que la materia exista y pertenezca al usuario antes de consultar sus eventos.
    await materiasService.getMateriaById(userId, materiaId);

    // Busca y devuelve todos los eventos asociados a la materia.
    return eventosRepository.findEventosByMateriaAndUserId(materiaId, userId);

}