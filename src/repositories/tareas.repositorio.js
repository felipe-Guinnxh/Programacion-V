import { pool } from "../config/database.js";

// Convierte una fila de la base de datos al formato de tarea que utiliza la API.
function mapTarea(row) {
    return {
        id: row.id_tarea,
        materiaId: row.id_materia,
        titulo: row.titulo,
        descripcion: row.descripcion,
        fechaEntrega: row.fecha_entrega,
        horaEntrega: row.hora_entrega,
        prioridad: row.prioridad,
        estado: row.estado,
        cargaEstimadaMinutos: row.carga_estimada_minutos,
        porcentajeAvance: row.porcentaje_avance,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

/**
 * Busca todas las tareas asociadas a una materia.
 * Recibe el ID de la materia y consulta las tareas relacionadas en la base de datos.
 * Devuelve una lista de tareas ordenadas por fecha y hora de entrega.
 */
export async function findAllByMateriaId(materiaId) {
    const [rows] = await pool.execute(
        `SELECT
       t.id_tarea,
       t.id_materia,
       t.titulo,
       t.descripcion,
       t.fecha_entrega,
       t.hora_entrega,
       t.prioridad,
       t.estado,
       t.carga_estimada_minutos,
       t.porcentaje_avance,
       t.created_at,
       t.updated_at
     FROM tarea t
     WHERE t.id_materia = ?
     ORDER BY t.fecha_entrega ASC, t.hora_entrega ASC`,
        [materiaId]
    );

    // Convierte cada fila obtenida de la base de datos al formato usado por la API.
    return rows.map(mapTarea);
}