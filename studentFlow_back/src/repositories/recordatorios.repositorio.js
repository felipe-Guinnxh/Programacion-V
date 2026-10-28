import { pool } from "../config/database.js";

// Campos permitidos para ordenar el listado. Evita interpolar texto del cliente en SQL.
const sortableFields = {
    id: "r.id_recordatorio",
    fechaHora: "r.fecha_hora",
    leido: "r.leido",
    createdAt: "r.created_at"
};

// Columnas que se pueden modificar. Solo cambian datos de la tabla recordatorio.
const editableColumns = {
    idTarea: "id_tarea",
    mensaje: "mensaje",
    fechaHora: "fecha_hora",
    canal: "canal",
    leido: "leido"
};

/*
 * Cadena de propiedad (según el DER):
 *   recordatorio.id_tarea -> tarea.id_materia -> materia.id_usuario
 * recordatorio no tiene id_usuario, así que el usuario se verifica con los JOIN.
 * Los JOIN con tarea y materia son solo de lectura: nunca se modifican esas tablas.
 */
const FROM_CON_PROPIETARIO = `
     FROM recordatorio r
     INNER JOIN tarea t ON t.id_tarea = r.id_tarea
     INNER JOIN materia m ON m.id_materia = t.id_materia`;

const CAMPOS_RECORDATORIO = `
       r.id_recordatorio,
       r.id_tarea,
       r.mensaje,
       r.fecha_hora,
       r.canal,
       r.leido,
       r.created_at,
       t.titulo AS tarea_titulo,
       m.id_materia,
       m.nombre AS materia_nombre`;

// Normaliza el orden y devuelve la columna y dirección para el SQL.
function normalizeSort(sort, order) {
    const column = sortableFields[sort] || "r.id_recordatorio";
    const direction = String(order).toLocaleLowerCase() === "desc" ? "DESC" : "ASC";
    return `${column} ${direction}`;
}

// Convierte una fila de la base de datos al formato de recordatorio de la API.
function mapRecordatorio(row) {
    return {
        id: row.id_recordatorio,
        tareaId: row.id_tarea,
        tareaTitulo: row.tarea_titulo,
        materiaId: row.id_materia,
        materiaNombre: row.materia_nombre,
        mensaje: row.mensaje,
        fechaHora: row.fecha_hora,
        canal: row.canal,
        leido: Boolean(row.leido),
        createdAt: row.created_at
    };
}

/**
 * Busca los recordatorios de un usuario con filtros, orden y paginación.
 * Devuelve los recordatorios y el total que cumple los filtros.
 */
export async function findAllByUserId(userId, filters = {}) {
    const conditions = ["m.id_usuario = ?"];
    const params = [userId];

    if (typeof filters.leido === "boolean") {
        conditions.push("r.leido = ?");
        params.push(filters.leido ? 1 : 0);
    }

    const where = conditions.join(" AND ");

    const [countRows] = await pool.execute(
        `SELECT COUNT(*) AS total
         ${FROM_CON_PROPIETARIO}
         WHERE ${where}`,
        params
    );

    const limit = filters.limit;
    const offset = (filters.page - 1) * limit;

    const [rows] = await pool.execute(
        `SELECT ${CAMPOS_RECORDATORIO}
         ${FROM_CON_PROPIETARIO}
         WHERE ${where}
         ORDER BY ${normalizeSort(filters.sort, filters.order)}
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    return {
        recordatorios: rows.map(mapRecordatorio),
        total: countRows[0].total
    };
}

/**
 * Busca un recordatorio que pertenezca al usuario.
 * Devuelve el recordatorio o null si no existe o es de otro usuario.
 */
export async function findByIdAndUserId(id, userId) {
    const [rows] = await pool.execute(
        `SELECT ${CAMPOS_RECORDATORIO}
         ${FROM_CON_PROPIETARIO}
         WHERE r.id_recordatorio = ? AND m.id_usuario = ?`,
        [id, userId]
    );

    return rows[0] ? mapRecordatorio(rows[0]) : null;
}

/**
 * Comprueba que una tarea exista y pertenezca al usuario (tarea -> materia -> usuario).
 * Solo lee las tablas tarea y materia.
 */
export async function tareaPerteneceAUsuario(idTarea, userId) {
    const [rows] = await pool.execute(
        `SELECT t.id_tarea
         FROM tarea t
         INNER JOIN materia m ON m.id_materia = t.id_materia
         WHERE t.id_tarea = ? AND m.id_usuario = ?
         LIMIT 1`,
        [idTarea, userId]
    );

    return Boolean(rows[0]);
}

/**
 * Inserta un recordatorio y devuelve el recordatorio creado.
 * Solo escribe en la tabla recordatorio. created_at lo llena la base de datos.
 */
export async function insert(userId, data) {
    const [result] = await pool.execute(
        `INSERT INTO recordatorio (id_tarea, mensaje, fecha_hora, canal, leido)
         VALUES (?, ?, ?, ?, ?)`,
        [data.idTarea, data.mensaje, data.fechaHora, data.canal, data.leido ? 1 : 0]
    );

    return findByIdAndUserId(result.insertId, userId);
}

/**
 * Actualiza los campos enviados de un recordatorio del usuario.
 * El UPDATE usa JOIN para verificar el dueño, pero solo modifica la tabla recordatorio (alias r).
 * Si no hay campos que cambiar, devuelve el recordatorio tal como está.
 */
export async function update(id, userId, data) {
    const fields = [];
    const params = [];

    for (const [campo, columna] of Object.entries(editableColumns)) {
        if (data[campo] !== undefined) {
            fields.push(`r.${columna} = ?`);
            params.push(campo === "leido" ? (data[campo] ? 1 : 0) : data[campo]);
        }
    }

    if (fields.length === 0) {
        return findByIdAndUserId(id, userId);
    }

    params.push(id, userId);

    await pool.execute(
        `UPDATE recordatorio r
         INNER JOIN tarea t ON t.id_tarea = r.id_tarea
         INNER JOIN materia m ON m.id_materia = t.id_materia
         SET ${fields.join(", ")}
         WHERE r.id_recordatorio = ? AND m.id_usuario = ?`,
        params
    );

    return findByIdAndUserId(id, userId);
}

/**
 * Elimina un recordatorio del usuario.
 * El DELETE usa alias r, así que solo borra filas de recordatorio.
 * Devuelve true si se eliminó y false si no se encontró.
 */
export async function remove(id, userId) {
    const [result] = await pool.execute(
        `DELETE r
         ${FROM_CON_PROPIETARIO}
         WHERE r.id_recordatorio = ? AND m.id_usuario = ?`,
        [id, userId]
    );

    return result.affectedRows > 0;
}
