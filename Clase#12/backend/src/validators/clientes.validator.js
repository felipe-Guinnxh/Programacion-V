import { HttpError } from '../utils/http-error.js';

const VALID_SEGMENTS = new Set(['persona', 'empresa']);

function positiveInteger(value, fieldName) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      `El campo '${fieldName}' debe ser un entero positivo.`,
    );
  }

  return parsed;
}

function requiredText(value, fieldName, maximumLength) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      `El campo '${fieldName}' es obligatorio.`,
    );
  }

  const normalized = value.trim();

  if (normalized.length > maximumLength) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      `El campo '${fieldName}' no puede superar ${maximumLength} caracteres.`,
    );
  }

  return normalized;
}

function optionalPhone(value) {
  if (value === undefined || value === null || value === '') {
    return value === undefined ? undefined : null;
  }

  return requiredText(value, 'telefono', 20);
}

function segment(value, defaultValue) {
  const normalized = value === undefined ? defaultValue : String(value).toLowerCase();

  if (!VALID_SEGMENTS.has(normalized)) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      "El campo 'segmento' debe ser 'persona' o 'empresa'.",
    );
  }

  return normalized;
}

export function validateClientId(id) {
  const parsed = Number(id);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new HttpError(400, 'INVALID_ID', 'El identificador no es válido.');
  }

  return parsed;
}

export function validateClientListQuery(query) {
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
    cityId: query.ciudadId === undefined ? undefined : positiveInteger(query.ciudadId, 'ciudadId'),
    segment: query.segmento === undefined ? undefined : segment(query.segmento),
    sort: query.sort,
    order: query.order,
  };
}

export function validateCreateClient(body = {}) {
  return {
    cityId: positiveInteger(body.ciudadId, 'ciudadId'),
    name: requiredText(body.nombre, 'nombre', 80),
    phone: optionalPhone(body.telefono) ?? null,
    segment: segment(body.segmento, 'persona'),
  };
}

export function validatePatchClient(body = {}) {
  const payload = {};

  if (body.ciudadId !== undefined) payload.cityId = positiveInteger(body.ciudadId, 'ciudadId');
  if (body.nombre !== undefined) payload.name = requiredText(body.nombre, 'nombre', 80);
  if (body.telefono !== undefined) payload.phone = optionalPhone(body.telefono);
  if (body.segmento !== undefined) payload.segment = segment(body.segmento);

  if (Object.keys(payload).length === 0) {
    throw new HttpError(422, 'VALIDATION_ERROR', 'No se enviaron campos válidos para actualizar.');
  }

  return payload;
}
