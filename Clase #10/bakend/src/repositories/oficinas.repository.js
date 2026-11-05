import { pool } from '../config/database.js';

function mapOffice(row) {
  return row ? { id: row.id, nombre: row.nombre } : null;
}

export async function findAll(filters) {
  const parameters = [];
  const where = filters.search ? 'WHERE nombre LIKE ?' : '';
  if (filters.search) parameters.push(`%${filters.search}%`);
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM oficinas ${where}`,
    parameters,
  );
  const sort = filters.sort === 'id' ? 'id' : 'nombre';
  const order = String(filters.order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const offset = (filters.page - 1) * filters.limit;
  const [rows] = await pool.execute(
    `SELECT id, nombre FROM oficinas ${where} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
    [...parameters, filters.limit, offset],
  );
  return { offices: rows.map(mapOffice), total: countRows[0].total };
}

export async function findById(id) {
  const [rows] = await pool.execute('SELECT id, nombre FROM oficinas WHERE id = ? LIMIT 1', [id]);
  return mapOffice(rows[0]);
}

export async function create({ name }) {
  const [result] = await pool.execute('INSERT INTO oficinas (nombre) VALUES (?)', [name]);
  return findById(result.insertId);
}

export async function replace(id, { name }) {
  await pool.execute('UPDATE oficinas SET nombre = ? WHERE id = ?', [name, id]);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.execute('DELETE FROM oficinas WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
