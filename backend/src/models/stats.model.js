import { pool } from "../config/db.js";

export async function countClasificacionModel() {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM clasificacion;");
    return rows[0]?.count ?? 0;
}

export async function materiasPorClasificacionModel() {
    const [rows] = await pool.query(`
    SELECT c.id, c.nombre, COUNT(mp.id) AS materias
    FROM clasificacion c
    LEFT JOIN materia_prima mp ON mp.clasificacion_id = c.id
    GROUP BY c.id, c.nombre
    ORDER BY c.nombre ASC;
  `);
    return rows; // [{id, nombre, materias}, ...]
}
