import { HttpError } from "../utils/http-error.js";

// Convierte un valor en booleano y valida que solo se acepten true o false.
function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).toLowerCase();

  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new HttpError(422, "VALIDATION_ERROR", "El filtro 'activa' debe ser true o false.");
}

// Convierte un valor a entero y comprueba que sea mayor o igual a cero.
function parsePositiveInteger(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' debe ser un entero positivo o cero.`);
  }

  return parsed;
}

// Valida que el valor sea un texto no vacío y elimina espacios innecesarios al inicio y al final.
function normalizeString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(422, "VALIDATION_ERROR", `El campo '${fieldName}' es obligatorio.`);
  }

  return value.trim();
}

// Comprueba que el color tenga el formato hexadecimal de seis caracteres, por ejemplo #FFFFFF.
function validateColor(color) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new HttpError(422, "VALIDATION_ERROR", "El campo 'color' debe tener formato hexadecimal #RRGGBB.");
  }
}

/**
 * Valida y normaliza los parámetros usados para listar materias.
 * Recibe los parámetros de consulta de la URL y aplica valores por defecto para page y limit.
 * Devuelve un objeto con los filtros listos para usarse en el servicio.
 */
export function validateMateriaListQuery(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  // La página debe comenzar desde 1.
  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'page' debe ser un entero mayor o igual a 1.");
  }

  // Se limita la cantidad máxima de materias por página para evitar consultas demasiado grandes.
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(422, "VALIDATION_ERROR", "El parámetro 'limit' debe ser un entero entre 1 y 100.");
  }

  return {
    activa: parseBoolean(query.activa),
    search: typeof query.search === "string" ? query.search.trim() : "",
    sort: query.sort,
    order: query.order,
    page,
    limit
  };
}

/**
 * Valida el identificador de una materia recibido desde la URL.
 * Recibe el valor del parámetro id y comprueba que sea un entero válido mayor o igual a 1.
 * Devuelve el ID convertido a número.
 */
export function validateMateriaId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId < 1) {
    throw new HttpError(400, "INVALID_ID", "El identificador de materia no es válido.");
  }

  return parsedId;
}

/**
 * Valida los datos necesarios para crear o reemplazar una materia.
 * Recibe el cuerpo de la solicitud y comprueba los campos obligatorios y sus formatos.
 * Devuelve un objeto limpio y normalizado listo para enviar al servicio.
 */
export function validateCreateMateria(body) {
  const nombre = normalizeString(body.nombre, "nombre");
  const codigo = normalizeString(body.codigo, "codigo");
  const color = normalizeString(body.color, "color");
  const creditos = parsePositiveInteger(body.creditos, "creditos");
  const activa = body.activa === undefined ? true : parseBoolean(body.activa);

  validateColor(color);

  return {
    nombre,
    codigo,
    color,
    creditos,
    activa
  };
}

/**
 * Valida los datos enviados para actualizar parcialmente una materia.
 * Recibe el cuerpo de la solicitud y solo valida los campos que fueron enviados.
 * Devuelve un objeto con los cambios válidos o lanza un error si no se envió ningún campo.
 */
export function validatePatchMateria(body) {
  const payload = {};

  // Solo valida y agrega el nombre si viene incluido en la solicitud.
  if (body.nombre !== undefined) {
    payload.nombre = normalizeString(body.nombre, "nombre");
  }

  // Solo valida y agrega el código si viene incluido en la solicitud.
  if (body.codigo !== undefined) {
    payload.codigo = normalizeString(body.codigo, "codigo");
  }

  // El color se valida tanto como texto válido como por su formato hexadecimal.
  if (body.color !== undefined) {
    payload.color = normalizeString(body.color, "color");
    validateColor(payload.color);
  }

  // Los créditos deben ser un número entero mayor o igual a cero.
  if (body.creditos !== undefined) {
    payload.creditos = parsePositiveInteger(body.creditos, "creditos");
  }

  // Convierte el estado de la materia a un booleano válido.
  if (body.activa !== undefined) {
    payload.activa = parseBoolean(body.activa);
  }

  // No tiene sentido procesar una actualización si no se envió ningún campo.
  if (Object.keys(payload).length === 0) {
    throw new HttpError(422, "VALIDATION_ERROR", "No se enviaron campos válidos para actualizar.");
  }

  return payload;
}