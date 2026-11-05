import { pool } from '../config/database.js';

const sortableColumns = Object.freeze({
  id: 'cl.id',
  nombre: 'cl.nombre',
  segmento: 'cl.segmento',
  ciudad: 'ci.ciudad',
});

function mapClient(row) {
  if (!row) return null;

  return {
    id: row.id,
    ciudadId: row.ciudadId,
    nombre: row.nombre,
    telefono: row.telefono,
    segmento: row.segmento,
    ciudad: {
      id: row.ciudadId,
      ciudad: row.ciudad,
      pais: row.pais,
    },
  };
}

function normalizeSort(sort, order) {
  const column = sortableColumns[sort] || sortableColumns.nombre;
  const direction = String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return `${column} ${direction}`;
}

export async function findAll(filters) {
  const conditions = [];
  const parameters = [];

  if (filters.search) {
    conditions.push('(cl.nombre LIKE ? OR cl.telefono LIKE ?)');
    parameters.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.cityId !== undefined) {
    conditions.push('cl.ciudad_id = ?');
    parameters.push(filters.cityId);
  }
  if (filters.segment !== undefined) {
    conditions.push('cl.segmento = ?');
    parameters.push(filters.segment);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM clientes AS cl ${whereClause}`,
    parameters,
  );
  const offset = (filters.page - 1) * filters.limit;
  const [rows] = await pool.execute(
    `SELECT cl.id,
            cl.ciudad_id AS ciudadId,
            cl.nombre,
            cl.telefono,
            cl.segmento,
            ci.ciudad,
            ci.pais
     FROM clientes AS cl
     INNER JOIN ciudades AS ci ON ci.id = cl.ciudad_id
     ${whereClause}
     ORDER BY ${normalizeSort(filters.sort, filters.order)}
     LIMIT ? OFFSET ?`,
    [...parameters, filters.limit, offset],
  );

  return { clients: rows.map(mapClient), total: countRows[0].total };
}

export async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT cl.id,
            cl.ciudad_id AS ciudadId,
            cl.nombre,
            cl.telefono,
            cl.segmento,
            ci.ciudad,
            ci.pais
     FROM clientes AS cl
     INNER JOIN ciudades AS ci ON ci.id = cl.ciudad_id
     WHERE cl.id = ?
     LIMIT 1`,
    [id],
  );
  return mapClient(rows[0]);
}

export async function create({ cityId, name, phone, segment }) {
  const [result] = await pool.execute(
    'INSERT INTO clientes (ciudad_id, nombre, telefono, segmento) VALUES (?, ?, ?, ?)',
    [cityId, name, phone, segment],
  );
  return findById(result.insertId);
}

export async function replace(id, { cityId, name, phone, segment }) {
  await pool.execute(
    'UPDATE clientes SET ciudad_id = ?, nombre = ?, telefono = ?, segmento = ? WHERE id = ?',
    [cityId, name, phone, segment, id],
  );
  return findById(id);
}

export async function patch(id, changes) {
  const fields = [];
  const parameters = [];
  const columnMap = {
    cityId: 'ciudad_id',
    name: 'nombre',
    phone: 'telefono',
    segment: 'segmento',
  };

  for (const [key, column] of Object.entries(columnMap)) {
    if (changes[key] !== undefined) {
      fields.push(`${column} = ?`);
      parameters.push(changes[key]);
    }
  }

  parameters.push(id);
  await pool.execute(`UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`, parameters);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
