import * as materiasRepository from "../repositories/materias.repositorio.js";
import { HttpError } from "../utils/http-error.js";


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

export async function getMateriaById(userId, id) {
  const materia = await materiasRepository.findByIddAndUseriId(id, userId);
  if (!materia) {
    throw new HttpError(404, "MATERIA_NOT_FOUND", "La materia no fue encontrada");
  }
  return materia;
}

async function assertNoDuplicate(userId, { nombre, codigo } = {}, excludeId = null) {
  if (nombre === undefined && codigo === undefined) {
    return;
  }

  const duplicate = await materiasRepository.existsByCodigoOrNombre(
    userId,
    { nombre: nombre ?? null, codigo: codigo ?? null },
    excludeId
  );

  if (duplicate) {
    throw new HttpError(409, "MATERIA_DUPLICADA", "Ya existe una materia con ese código o nombre.");
  }
}

export async function createMateria(userId, payload) {
  await assertNoDuplicate(userId, payload);
  return materiasRepository.insert(userId, payload);
}

export async function replaceMateria(userId, id, payload) {
  await getMateriaById(userId, id);
  await assertNoDuplicate(userId, payload, id);
  return materiasRepository.update(id, userId, payload);
}

export async function updateMateria(userId, id, payload) {
  await getMateriaById(userId, id);
  await assertNoDuplicate(userId, payload, id);
  return materiasRepository.update(id, userId, payload);
}

export async function deleteMateria(userId, id) {
  await getMateriaById(userId, id);
  await materiasRepository.remove(id, userId);
}