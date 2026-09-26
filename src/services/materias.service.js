import * as materiasRepository from "../repositories/materias.repositorio.js";

import { HttpError } from "../utils/http-error.js";

/**
 * Obtiene las materias de un usuario aplicando los filtros recibidos.
 * Recibe el ID del usuario y los filtros de búsqueda, orden y paginación.
 * Devuelve las materias junto con la información de paginación.
 */
export async function listMaterias(userId, filters) {
  const { materias, total } = await materiasRepository.findAllByUserId(userId, filters);

  return {
    data: materias,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      pages: Math.ceil(total / filters.limit)
    }
  };
}

/**
 * Busca una materia específica perteneciente al usuario.
 * Recibe el ID del usuario y el ID de la materia.
 * Devuelve la materia encontrada o lanza un error 404 si no existe.
 */
export async function getMateriaById(userId, id) {
  const materia = await materiasRepository.findByIddAndUseriId(id, userId);

  // Evita continuar si la materia no existe o no pertenece al usuario.
  if (!materia) {
    throw new HttpError(404, "MATERIA_NOT_FOUND", "La materia no fue encontrada");
  }

  return materia;
}

/**
 * Comprueba que no exista otra materia con el mismo nombre o código.
 * Recibe el ID del usuario, los datos a validar y opcionalmente el ID de la materia que se está modificando.
 * Lanza un error 409 cuando encuentra una materia duplicada.
 */
async function assertNoDuplicate(userId, { nombre, codigo } = {}, excludeId = null) {
  // Si no se está enviando ninguno de estos campos, no es necesario validar duplicados.
  if (nombre === undefined && codigo === undefined) {
    return;
  }

  const duplicate = await materiasRepository.existsByCodigoOrNombre(
    userId,
    { nombre: nombre ?? null, codigo: codigo ?? null },
    excludeId
  );

  // En una actualización se excluye la materia actual para evitar que coincida consigo misma.
  if (duplicate) {
    throw new HttpError(409, "MATERIA_DUPLICADA", "Ya existe una materia con ese código o nombre.");
  }
}

/**
 * Crea una nueva materia para el usuario.
 * Recibe el ID del usuario y los datos de la materia.
 * Primero valida que no exista otra con el mismo nombre o código y luego la guarda.
 */
export async function createMateria(userId, payload) {
  await assertNoDuplicate(userId, payload);
  return materiasRepository.insert(userId, payload);
}

/**
 * Reemplaza los datos de una materia existente.
 * Recibe el ID del usuario, el ID de la materia y el nuevo contenido.
 * Verifica que la materia exista y que los datos no generen duplicados antes de actualizarla.
 */
export async function replaceMateria(userId, id, payload) {
  await getMateriaById(userId, id);
  await assertNoDuplicate(userId, payload, id);

  return materiasRepository.update(id, userId, payload);
}

/**
 * Actualiza una materia existente con los datos enviados.
 * Recibe el ID del usuario, el ID de la materia y los campos que se quieren modificar.
 * Verifica la existencia de la materia y evita duplicados antes de guardar los cambios.
 */
export async function updateMateria(userId, id, payload) {
  await getMateriaById(userId, id);
  await assertNoDuplicate(userId, payload, id);

  return materiasRepository.update(id, userId, payload);
}

/**
 * Elimina una materia perteneciente al usuario.
 * Recibe el ID del usuario y el ID de la materia.
 * Verifica primero que la materia exista y después solicita su eliminación al repositorio.
 */
export async function deleteMateria(userId, id) {
  await getMateriaById(userId, id);
  await materiasRepository.remove(id, userId);
}