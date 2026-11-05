import { HttpError } from '../utils/http-error.js';

function positiveInteger(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new HttpError(422, 'VALIDATION_ERROR', `El campo '${fieldName}' debe ser un entero positivo.`);
  }
  return parsed;
}

function projectName(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(422, 'VALIDATION_ERROR', "El campo 'proyecto' es obligatorio.");
  }
  const normalized = value.trim();
  if (normalized.length > 80) {
    throw new HttpError(422, 'VALIDATION_ERROR', "El campo 'proyecto' no puede superar 80 caracteres.");
  }
  return normalized;
}

function dateTime(value, required = false) {
  if (value === undefined) {
    if (required) {
      throw new HttpError(422, 'VALIDATION_ERROR', "El campo 'fechaInicioProyecto' es obligatorio.");
    }
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new HttpError(422, 'VALIDATION_ERROR', "'fechaInicioProyecto' debe ser una fecha válida.");
  }

  const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}:\d{2}))?$/);
  if (!match) {
    throw new HttpError(422, 'VALIDATION_ERROR', "'fechaInicioProyecto' debe usar YYYY-MM-DD o YYYY-MM-DD HH:mm:ss.");
  }

  const time = match[2] || '00:00:00';
  const normalized = `${match[1]} ${time}`;
  const parsed = new Date(`${match[1]}T${time}Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 19) !== `${match[1]}T${time}`) {
    throw new HttpError(422, 'VALIDATION_ERROR', "'fechaInicioProyecto' no representa una fecha real.");
  }
  return normalized;
}

function nullableDate(value, fieldName) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    throw new HttpError(422, 'VALIDATION_ERROR', `El campo '${fieldName}' debe usar YYYY-MM-DD.`);
  }
  const normalized = value.trim();
  const parsed = new Date(`${normalized}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== normalized) {
    throw new HttpError(422, 'VALIDATION_ERROR', `El campo '${fieldName}' no representa una fecha real.`);
  }
  return normalized;
}

function nullableCost(value) {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 99999999.99) {
    throw new HttpError(422, 'VALIDATION_ERROR', "'costoProyecto' debe estar entre 0 y 99999999.99.");
  }
  return Math.round(parsed * 100) / 100;
}

export function validateProjectId(id) {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new HttpError(400, 'INVALID_ID', 'El identificador no es válido.');
  }
  return parsed;
}

export function validateProjectListQuery(query) {
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
    clientId: query.clienteId === undefined ? undefined : positiveInteger(query.clienteId, 'clienteId'),
    officeId: query.oficinaId === undefined ? undefined : positiveInteger(query.oficinaId, 'oficinaId'),
    startDate: nullableDate(query.fechaDesde, 'fechaDesde'),
    endDate: nullableDate(query.fechaHasta, 'fechaHasta'),
    sort: query.sort,
    order: query.order,
  };
}

export function validateCreateProject(body = {}, { requireStart = false } = {}) {
  return {
    clientId: positiveInteger(body.clienteId, 'clienteId'),
    officeId: positiveInteger(body.oficinaId, 'oficinaId'),
    project: projectName(body.proyecto),
    startDate: dateTime(body.fechaInicioProyecto, requireStart),
    endDate: nullableDate(body.fechaFinProyecto, 'fechaFinProyecto') ?? null,
    cost: nullableCost(body.costoProyecto) ?? null,
  };
}

export function validatePatchProject(body = {}) {
  const payload = {};
  if (body.clienteId !== undefined) payload.clientId = positiveInteger(body.clienteId, 'clienteId');
  if (body.oficinaId !== undefined) payload.officeId = positiveInteger(body.oficinaId, 'oficinaId');
  if (body.proyecto !== undefined) payload.project = projectName(body.proyecto);
  if (body.fechaInicioProyecto !== undefined) payload.startDate = dateTime(body.fechaInicioProyecto, true);
  if (body.fechaFinProyecto !== undefined) payload.endDate = nullableDate(body.fechaFinProyecto, 'fechaFinProyecto');
  if (body.costoProyecto !== undefined) payload.cost = nullableCost(body.costoProyecto);
  if (Object.keys(payload).length === 0) {
    throw new HttpError(422, 'VALIDATION_ERROR', 'No se enviaron campos válidos para actualizar.');
  }
  return payload;
}
