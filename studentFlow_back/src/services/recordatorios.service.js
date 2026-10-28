import * as recordatoriosRepository from "../repositories/recordatorios.repositorio.js";

import { HttpError } from "../utils/http-error.js";

/**
 * Obtiene los recordatorios del usuario aplicando filtros y paginación.
 * Devuelve los datos junto con la información de paginación.
 */
export async function listRecordatorios(userId, filters) {
  const { recordatorios, total } = await recordatoriosRepository.findAllByUserId(userId, filters);

  return {
    data: recordatorios,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      pages: Math.ceil(total / filters.limit)
    }
  };
}

/**
 * Busca un recordatorio del usuario.
 * Lanza 404 si no existe o pertenece a otro usuario.
 */
export async function getRecordatorioById(userId, id) {
  const recordatorio = await recordatoriosRepository.findByIdAndUserId(id, userId);

  if (!recordatorio) {
    throw new HttpError(404, "RECORDATORIO_NOT_FOUND", "El recordatorio no fue encontrado");
  }

  return recordatorio;
}

/**
 * Verifica que la tarea indicada exista y sea del usuario.
 * Lanza 404 si no lo es, para no crear recordatorios sobre tareas ajenas.
 */
async function assertTareaDelUsuario(userId, idTarea) {
  const esSuya = await recordatoriosRepository.tareaPerteneceAUsuario(idTarea, userId);

  if (!esSuya) {
    throw new HttpError(404, "TAREA_NOT_FOUND", "La tarea no fue encontrada");
  }
}

/**
 * Crea un recordatorio para una tarea del usuario.
 */
export async function createRecordatorio(userId, payload) {
  await assertTareaDelUsuario(userId, payload.idTarea);
  return recordatoriosRepository.insert(userId, payload);
}

/**
 * Reemplaza todos los datos de un recordatorio (PUT).
 */
export async function replaceRecordatorio(userId, id, payload) {
  await getRecordatorioById(userId, id);
  await assertTareaDelUsuario(userId, payload.idTarea);

  return recordatoriosRepository.update(id, userId, payload);
}

/**
 * Actualiza solo los campos enviados de un recordatorio (PATCH).
 */
export async function updateRecordatorio(userId, id, payload) {
  await getRecordatorioById(userId, id);

  if (payload.idTarea !== undefined) {
    await assertTareaDelUsuario(userId, payload.idTarea);
  }

  return recordatoriosRepository.update(id, userId, payload);
}

/**
 * Elimina un recordatorio del usuario.
 */
export async function deleteRecordatorio(userId, id) {
  await getRecordatorioById(userId, id);
  await recordatoriosRepository.remove(id, userId);
}
