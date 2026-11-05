import { HttpError } from '../utils/http-error.js';

function requiredText(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      `El campo '${fieldName}' es obligatorio.`,
    );
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length > 80) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      `El campo '${fieldName}' no puede superar 80 caracteres.`,
    );
  }

  return normalizedValue;
}

function optionalText(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  return requiredText(value, fieldName);
}

export function validateCityId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new HttpError(400, 'INVALID_ID', 'El identificador no es válido.');
  }

  return parsedId;
}

export function validateCityListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      "El parámetro 'page' debe ser un entero mayor o igual a 1.",
    );
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      "El parámetro 'limit' debe ser un entero entre 1 y 100.",
    );
  }

  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const country = typeof query.pais === 'string' ? query.pais.trim() : '';

  if (search.length > 80 || country.length > 80) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      'Los filtros no pueden superar 80 caracteres.',
    );
  }

  return {
    page,
    limit,
    search,
    country,
    sort: query.sort,
    order: query.order,
  };
}

export function validateCreateCity(body = {}) {
  return {
    city: requiredText(body.ciudad, 'ciudad'),
    country: requiredText(body.pais, 'pais'),
  };
}

export function validatePatchCity(body = {}) {
  const payload = {
    city: optionalText(body.ciudad, 'ciudad'),
    country: optionalText(body.pais, 'pais'),
  };

  if (payload.city === undefined && payload.country === undefined) {
    throw new HttpError(
      422,
      'VALIDATION_ERROR',
      'Debe enviar al menos uno de los campos: ciudad o pais.',
    );
  }

  return payload;
}
