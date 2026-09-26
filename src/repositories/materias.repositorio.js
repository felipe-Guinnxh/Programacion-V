import { pool } from "../config/database.js";

// Campos permitidos para ordenar la lista de materias.
// Se relacionan con las columnas reales de la tabla para evitar ordenar por valores no válidos.
const sortableFields = {
    id: "m.id_materia",
    nombre: "m.nombre",
    codigo: "m.codigo",
    creditos: "m.creditos",
    color: "m.color",
    activa: "m.activa",
    createdAt: "m.created_at",
    updatedAt: "m.updated_at"
}

// Normaliza los parámetros de ordenamiento y devuelve la columna y dirección que se usarán en SQL.
function normalizeSort(sort, order) {
    const column = sortableFields[sort] || "m.id_materia";
    const direction = String(order).toLocaleLowerCase() === "desc" ? "DESC" : "ASC";

    return `${column} ${direction}`;
}

// Convierte una fila de la base de datos al formato de materia que usamos en la API.
function mapMateria(row) {
    return {
        id: row.id_materia,
        nombre: row.nombre,
        codigo: row.codigo,
        creditos: row.creditos,
        color: row.color,
        activa: row.activa,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }
}

/**
 * Busca las materias de un usuario aplicando filtros, búsqueda, orden y paginación.
 * Recibe el ID del usuario y los filtros opcionales enviados desde la solicitud.
 * Devuelve las materias encontradas junto con el total de registros que cumplen los filtros.
 */
export async function findAllByUserId(userId, filters = {}) {
  const conditions = ["m.id_usuario = ?"];
  const params = [userId];

  // Filtra por el estado de la materia cuando se recibe activa como booleano.
  if (typeof filters.activa === "boolean") {
    conditions.push("m.activa = ?");
    params.push(filters.activa ? 1 : 0);
  }

  // Permite buscar una materia por coincidencias en el nombre o en el código.
  if (filters.search) {
    conditions.push("(m.nombre LIKE ? OR m.codigo LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  // Primero obtenemos el total para poder informar cuántos registros existen en la paginación.
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM materia m
     WHERE ${conditions.join(" AND ")}`,
    params
  );

  const orderBy = normalizeSort(filters.sort, filters.order);
  const limit = filters.limit;
  const offset = (filters.page - 1) * limit;

  const [rows] = await pool.execute(
    `SELECT
       m.id_materia,
       m.id_usuario,
       m.nombre,
       m.codigo,
       m.color,
       m.creditos,
       m.activa,
       m.created_at,
       m.updated_at
     FROM materia m
     WHERE ${conditions.join(" AND ")}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    materias: rows.map(mapMateria),
    total: countRows[0].total
  };
}

/**
 * Busca una materia específica perteneciente a un usuario.
 * Recibe el ID de la materia y el ID del usuario.
 * Devuelve la materia encontrada o null si no existe o no pertenece al usuario.
 */
export async function findByIddAndUseriId(id, userId) {
  const [rows] = await pool.execute(
    `SELECT
       m.id_materia,
       m.id_usuario,
       m.nombre,
       m.codigo,
       m.color,
       m.creditos,
       m.activa,
       m.created_at,
       m.updated_at
     FROM materia m
     WHERE m.id_materia = ? AND m.id_usuario = ?`,
    [id, userId]
  );

  return rows[0] ? mapMateria(rows[0]) : null;
}

/**
 * Comprueba si ya existe una materia con el mismo nombre o código para un usuario.
 * Recibe el usuario, los datos a comparar y opcionalmente el ID de una materia que se debe excluir.
 * Devuelve true si encuentra una coincidencia y false si no existe.
 */
export async function existsByCodigoOrNombre(userId, { nombre, codigo }, excludeId = null) {
  const conditions = ["m.id_usuario = ?", "(m.nombre = ? OR m.codigo = ?)"];
  const params = [userId, nombre, codigo];

  // Cuando se está actualizando una materia, se excluye su propio ID para que no genere conflicto consigo misma.
  if (excludeId) {
    conditions.push("m.id_materia <> ?");
    params.push(excludeId);
  }

  const [rows] = await pool.execute(
    `SELECT m.id_materia AS id
     FROM materia m
     WHERE ${conditions.join(" AND ")}
     LIMIT 1`,
    params
  );

  return Boolean(rows[0]);
}

/**
 * Crea una nueva materia asociada a un usuario.
 * Recibe el ID del usuario y los datos de la materia.
 * Devuelve la materia recién creada con el mismo formato que usa la API.
 */
export async function insert(userId, data) {
  const [result] = await pool.execute(
    `INSERT INTO materia (id_usuario, nombre, codigo, color, creditos, activa)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, data.nombre, data.codigo, data.color, data.creditos, data.activa ? 1 : 0]
  );

  return findByIddAndUseriId(result.insertId, userId);
}

/**
 * Actualiza los campos enviados de una materia perteneciente al usuario.
 * Recibe el ID de la materia, el ID del usuario y los datos que se quieren modificar.
 * Devuelve la materia actualizada o la versión actual si no hay campos para cambiar.
 */
export async function update(id, userId, data) {
  const columns = ["nombre", "codigo", "color", "creditos", "activa"];
  const fields = [];
  const params = [];

  // Solo agrega a la consulta los campos que realmente fueron enviados.
  for (const column of columns) {
    if (data[column] !== undefined) {
      fields.push(`${column} = ?`);
      params.push(column === "activa" ? (data[column] ? 1 : 0) : data[column]);
    }
  }

  // Si no hay nada que actualizar, devolvemos la materia tal como está.
  if (fields.length === 0) {
    return findByIddAndUseriId(id, userId);
  }

  params.push(id, userId);

  await pool.execute(
    `UPDATE materia
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id_materia = ? AND id_usuario = ?`,
    params
  );

  return findByIddAndUseriId(id, userId);
}

/**
 * Elimina una materia verificando que pertenezca al usuario indicado.
 * Recibe el ID de la materia y el ID del usuario.
 * Devuelve true si la eliminación se realizó y false si no se encontró la materia.
 */
export async function remove(id, userId) {
  const [result] = await pool.execute(
    `DELETE FROM materia WHERE id_materia = ? AND id_usuario = ?`,
    [id, userId]
  );

  return result.affectedRows > 0;
}