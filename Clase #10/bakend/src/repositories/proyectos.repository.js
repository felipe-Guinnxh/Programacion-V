import { pool } from '../config/database.js';

const sortableColumns = Object.freeze({
  id: 'p.id',
  proyecto: 'p.Proyecto',
  fechaInicioProyecto: 'p.FechaInicioProyecto',
  fechaFinProyecto: 'p.FechaFinProyecto',
  costoProyecto: 'p.CostoProyecto',
});

function mapProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    clienteId: row.clienteId,
    oficinaId: row.oficinaId,
    proyecto: row.proyecto,
    fechaInicioProyecto: row.fechaInicioProyecto,
    fechaFinProyecto: row.fechaFinProyecto,
    costoProyecto: row.costoProyecto === null ? null : Number(row.costoProyecto),
    cliente: { id: row.clienteId, nombre: row.clienteNombre },
    oficina: { id: row.oficinaId, nombre: row.oficinaNombre },
  };
}

function baseSelect() {
  return `SELECT p.id,
                 p.cliente_id AS clienteId,
                 p.oficina_id AS oficinaId,
                 p.Proyecto AS proyecto,
                 p.FechaInicioProyecto AS fechaInicioProyecto,
                 p.FechaFinProyecto AS fechaFinProyecto,
                 p.CostoProyecto AS costoProyecto,
                 cl.nombre AS clienteNombre,
                 o.nombre AS oficinaNombre
          FROM proyectos AS p
          INNER JOIN clientes AS cl ON cl.id = p.cliente_id
          INNER JOIN oficinas AS o ON o.id = p.oficina_id`;
}

export async function findAll(filters) {
  const conditions = [];
  const parameters = [];
  if (filters.search) {
    conditions.push('(p.Proyecto LIKE ? OR cl.nombre LIKE ? OR o.nombre LIKE ?)');
    parameters.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters.clientId !== undefined) {
    conditions.push('p.cliente_id = ?');
    parameters.push(filters.clientId);
  }
  if (filters.officeId !== undefined) {
    conditions.push('p.oficina_id = ?');
    parameters.push(filters.officeId);
  }
  if (filters.startDate) {
    conditions.push('DATE(p.FechaInicioProyecto) >= ?');
    parameters.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push('DATE(p.FechaInicioProyecto) <= ?');
    parameters.push(filters.endDate);
  }
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const joins = `FROM proyectos AS p
                 INNER JOIN clientes AS cl ON cl.id = p.cliente_id
                 INNER JOIN oficinas AS o ON o.id = p.oficina_id`;
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total ${joins} ${whereClause}`,
    parameters,
  );
  const column = sortableColumns[filters.sort] || sortableColumns.proyecto;
  const order = String(filters.order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const offset = (filters.page - 1) * filters.limit;
  const [rows] = await pool.execute(
    `${baseSelect()} ${whereClause} ORDER BY ${column} ${order} LIMIT ? OFFSET ?`,
    [...parameters, filters.limit, offset],
  );
  return { projects: rows.map(mapProject), total: countRows[0].total };
}

export async function findById(id) {
  const [rows] = await pool.execute(`${baseSelect()} WHERE p.id = ? LIMIT 1`, [id]);
  return mapProject(rows[0]);
}

export async function create(project) {
  const [result] = await pool.execute(
    `INSERT INTO proyectos
       (cliente_id, oficina_id, Proyecto, FechaInicioProyecto, FechaFinProyecto, CostoProyecto)
     VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP), ?, ?)`,
    [project.clientId, project.officeId, project.project, project.startDate ?? null, project.endDate, project.cost],
  );
  return findById(result.insertId);
}

export async function replace(id, project) {
  await pool.execute(
    `UPDATE proyectos
     SET cliente_id = ?, oficina_id = ?, Proyecto = ?, FechaInicioProyecto = ?,
         FechaFinProyecto = ?, CostoProyecto = ?
     WHERE id = ?`,
    [project.clientId, project.officeId, project.project, project.startDate, project.endDate, project.cost, id],
  );
  return findById(id);
}

export async function patch(id, changes) {
  const fields = [];
  const parameters = [];
  const columnMap = {
    clientId: 'cliente_id',
    officeId: 'oficina_id',
    project: 'Proyecto',
    startDate: 'FechaInicioProyecto',
    endDate: 'FechaFinProyecto',
    cost: 'CostoProyecto',
  };
  for (const [key, column] of Object.entries(columnMap)) {
    if (changes[key] !== undefined) {
      fields.push(`${column} = ?`);
      parameters.push(changes[key]);
    }
  }
  parameters.push(id);
  await pool.execute(`UPDATE proyectos SET ${fields.join(', ')} WHERE id = ?`, parameters);
  return findById(id);
}

export async function remove(id) {
  const [result] = await pool.execute('DELETE FROM proyectos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
