import { HttpError } from "../utils/http-error.js";

/**
 * Valores del enum recordatorio_canal_enum.
 * AJUSTAR a los valores reales de la BD (en el DER y la captura solo aparece 'in_app').
 */
export const CANALES_VALIDOS = ["in_app"];

const MAX_MENSAJE = 255;

// Convierte un valor en booleano y acepta solo true o false.
function parseBoolean(value, fieldName) {
  if (typeof value === "boolean") return value;

  const normalized = String(value).toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;

  throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' debe ser true o false.`);
}

// Valida un entero positivo (usado para idTarea).
function parsePositiveInteger(value, fieldName) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' debe ser un entero mayor o igual a 1.`);
  }
  return parsed;
}

// Valida texto no vacío y quita espacios sobrantes.
function normalizeString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' es obligatorio.`);
  }
  return value.trim();
}

// Convierte 'YYYY-MM-DD HH:MM[:SS]' o 'YYYY-MM-DDTHH:MM[:SS]' al formato DATETIME de MySQL.
function parseFechaHora(value) {
  const texto = normalizeString(value, "fechaHora");
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(:\d{2})?$/.exec(texto);

  if (!match || Number.isNaN(new Date(texto.replace(" ", "T")).getTime())) {
    throw new HttpError(422, "VALIDATION_ERROR", "El campo 'fechaHora' debe tener formato YYYY-MM-DD HH:MM[:SS].");
  }

  return `${match[1]} ${match[2]}${match[3] ?? ":00"}`;
}

function validateCanal(canal) {
  if (!CANALES_VALIDOS.includes(canal)) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo 'canal' debe ser uno de: ${CANALES_VALIDOS.join(", ")}.`);
  }
  return canal;
}

function validateMensaje(mensaje) {
  const texto = normalizeString(mensaje, "mensaje");
  if (texto.length > MAX_MENSAJE) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo 'mensaje' no puede superar ${MAX_MENSAJE} caracteres.`);
  }
  return texto;
}

/**
 * Valida y normaliza los parámetros del listado de recordatorios.
 * Recibe los parámetros de la URL y aplica valores por defecto para page, limit, sort y order.
 * Devuelve los filtros listos para el servicio.
 */
export function validateRecordatorioListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'page' debe ser un entero mayor o igual a 1.");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'limit' debe ser un entero entre 1 y 100.");
  }

  return {
    leido: query.leido === undefined ? undefined : parseBoolean(query.leido, "leido"),
    sort: query.sort,
    order: query.order,
    page,
    limit
  };
}

/**
 * Valida el identificador de un recordatorio recibido en la URL.
 * Devuelve el ID convertido a número o lanza INVALID_ID.
 */
export function validateRecordatorioId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new HttpError(400, "INVALID_ID", "El identificador de recordatorio no es válido.");
  }

  return parsedId;
}

/**
 * Valida los datos para crear o reemplazar un recordatorio.
 * idTarea, mensaje, fechaHora y canal son obligatorios; leido es opcional y su valor por defecto es false.
 */
export function validateCreateRecordatorio(body = {}) {
  return {
    idTarea: parsePositiveInteger(body.idTarea, "idTarea"),
    mensaje: validateMensaje(body.mensaje),
    fechaHora: parseFechaHora(body.fechaHora),
    canal: validateCanal(body.canal),
    leido: body.leido === undefined ? false : parseBoolean(body.leido, "leido")
  };
}

/**
 * Valida los campos enviados para actualizar parcialmente un recordatorio (PATCH).
 * Solo valida los campos presentes y lanza error si no se envió ninguno.
 */
export function validatePatchRecordatorio(body = {}) {
  const payload = {};

  if (body.idTarea !== undefined) payload.idTarea = parsePositiveInteger(body.idTarea, "idTarea");
  if (body.mensaje !== undefined) payload.mensaje = validateMensaje(body.mensaje);
  if (body.fechaHora !== undefined) payload.fechaHora = parseFechaHora(body.fechaHora);
  if (body.canal !== undefined) payload.canal = validateCanal(body.canal);
  if (body.leido !== undefined) payload.leido = parseBoolean(body.leido, "leido");

  if (Object.keys(payload).length === 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "No se enviaron campos válidos para actualizar.");
  }

  return payload;
}
