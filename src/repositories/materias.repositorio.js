import { pool } from "../config/database.js";

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

function normalizeSort(sort, order) {
    const column = sortableFields[sort] || "m.id_materia";
    const direction = String(order).toLocaleLowerCase() === "desc" ? "DESC" : "ASC";

    return `${column} ${direction}`;
}

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

export async function findAllByUserId(userId, filters = {}) {
  const conditions = ["m.id_usuario = ?"];
  const params = [userId];

  if (typeof filters.activa === "boolean") {
    conditions.push("m.activa = ?");
    params.push(filters.activa ? 1 : 0);
  }

  if (filters.search) {
    conditions.push("(m.nombre LIKE ? OR m.codigo LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

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

export async function existsByCodigoOrNombre(userId, { nombre, codigo }, excludeId = null) {
  const conditions = ["m.id_usuario = ?", "(m.nombre = ? OR m.codigo = ?)"];
  const params = [userId, nombre, codigo];

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

export async function insert(userId, data) {
  const [result] = await pool.execute(
    `INSERT INTO materia (id_usuario, nombre, codigo, color, creditos, activa)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, data.nombre, data.codigo, data.color, data.creditos, data.activa ? 1 : 0]
  );

  return findByIddAndUseriId(result.insertId, userId);
}

export async function update(id, userId, data) {
  const columns = ["nombre", "codigo", "color", "creditos", "activa"];
  const fields = [];
  const params = [];

  for (const column of columns) {
    if (data[column] !== undefined) {
      fields.push(`${column} = ?`);
      params.push(column === "activa" ? (data[column] ? 1 : 0) : data[column]);
    }
  }

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

export async function remove(id, userId) {
  const [result] = await pool.execute(
    `DELETE FROM materia WHERE id_materia = ? AND id_usuario = ?`,
    [id, userId]
  );

  return result.affectedRows > 0;
}