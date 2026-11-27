import { HttpError } from '../utils/http-error.js';

function name(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(422, 'VALIDATION_ERROR', "El campo 'nombre' es obligatorio.");
  }
  const normalized = value.trim();
  if (normalized.length > 80) {
    throw new HttpError(422, 'VALIDATION_ERROR', "El campo 'nombre' no puede superar 80 caracteres.");
  }
  return normalized;
}

export function validateOfficeId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new HttpError(400, 'INVALID_ID', 'El identificador no es válido.');
  }
  return parsed;
}

export function validateOfficeListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(422, 'VALIDATION_ERROR', "'page' debe ser mayor o igual a 1.");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(422, 'VALIDATION_ERROR', "'limit' debe estar entre 1 y 100.");
  }
  return {
    page,
    limit,
    search: typeof query.search === 'string' ? query.search.trim() : '',
    sort: query.sort,
    order: query.order,
  };
}

export function validateCreateOffice(body = {}) {
  return { name: name(body.nombre) };
}

export function validatePatchOffice(body = {}) {
  if (body.nombre === undefined) {
    throw new HttpError(422, 'VALIDATION_ERROR', "Debe enviar el campo 'nombre'.");
  }
  return { name: name(body.nombre) };
}
