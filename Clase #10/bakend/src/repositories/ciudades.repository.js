import { pool } from '../config/database.js';

const sortableColumns = Object.freeze({
  id: 'c.id',
  ciudad: 'c.ciudad',
  pais: 'c.pais',
});

function mapCity(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    ciudad: row.ciudad,
    pais: row.pais,
  };
}

function normalizeSort(sort, order) {
  const column = sortableColumns[sort] || sortableColumns.ciudad;
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `${column} ${direction}`;
}

export async function findAll(filters) {
  const conditions = [];
  const parameters = [];

  if (filters.search) {
    conditions.push('(c.ciudad LIKE ? OR c.pais LIKE ?)');
    parameters.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.country) {
    conditions.push('c.pais = ?');
    parameters.push(filters.country);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM ciudades AS c ${whereClause}`,
    parameters,
  );
  const offset = (filters.page - 1) * filters.limit;
  const orderBy = normalizeSort(filters.sort, filters.order);
  const [rows] = await pool.execute(
    `SELECT c.id, c.ciudad, c.pais
     FROM ciudades AS c
     ${whereClause}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...parameters, filters.limit, offset],
  );

  return {
    cities: rows.map(mapCity),
    total: countRows[0].total,
  };
}

export async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, ciudad, pais
     FROM ciudades
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return mapCity(rows[0]);
}

export async function create({ city, country }) {
  const [result] = await pool.execute(
    'INSERT INTO ciudades (ciudad, pais) VALUES (?, ?)',
    [city, country],
  );

  return findById(result.insertId);
}

export async function replace(id, { city, country }) {
  await pool.execute(
    'UPDATE ciudades SET ciudad = ?, pais = ? WHERE id = ?',
    [city, country, id],
  );

  return findById(id);
}

export async function patch(id, changes) {
  const fields = [];
  const parameters = [];

  if (changes.city !== undefined) {
    fields.push('ciudad = ?');
    parameters.push(changes.city);
  }

  if (changes.country !== undefined) {
    fields.push('pais = ?');
    parameters.push(changes.country);
  }

  parameters.push(id);
  await pool.execute(
    `UPDATE ciudades SET ${fields.join(', ')} WHERE id = ?`,
    parameters,
  );

  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.execute('DELETE FROM ciudades WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
