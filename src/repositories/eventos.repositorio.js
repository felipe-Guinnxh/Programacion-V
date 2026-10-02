import { pool } from "../config/database.js";

/**
 * Busca todos los eventos asociados a una materia que pertenece al usuario.
 * Recibe el ID de la materia y el ID del usuario, y los relaciona con la tabla materia para validar el propietario.
 * Devuelve una lista de eventos ordenados por fecha y hora de inicio.
 */
export async function findEventosByMateriaAndUserId(id, userId) {
    const [rows] = await pool.execute(
        `SELECT
       e.id_evento AS id,
       e.id_materia AS materiaId,
       e.titulo,
       e.descripcion,
       e.fecha,
       e.hora_inicio AS horaInicio,
       e.hora_fin AS horaFin,
       e.tipo,
       e.created_at AS createdAt,
       e.updated_at AS updatedAt
     FROM evento e
     INNER JOIN materia m ON m.id_materia = e.id_materia
     WHERE m.id_materia = ? AND m.id_usuario = ?
     ORDER BY e.fecha ASC, e.hora_inicio ASC`,
        [id, userId]
    );

    return rows;
}