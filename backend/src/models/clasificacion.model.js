// src/models/clasificacion.model.js
import { pool } from '../config/db.js';

// 1) cantidad de clasificación
export async function getCountClasificacion() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total
    FROM clasificacion;
  `);
  return rows[0]?.total ?? 0;
}

// Alias por si importas con otro nombre en algún archivo
export const getClasificacionCount = getCountClasificacion;

// 2) cantidad de materia_prima por clasificación
export async function getCountMateriaGroupByClasificacion() {
  const [rows] = await pool.query(`
    SELECT
      c.id         AS clasificacion_id,
      c.nombre     AS clasificacion,
      COUNT(mp.id) AS cantidad_materia_prima
    FROM clasificacion c
    LEFT JOIN materia_prima mp
      ON mp.clasificacion_id = c.id
    GROUP BY c.id, c.nombre
    ORDER BY c.id;
  `);
  return rows;
}

// 3) lista de clasificaciones (para el filtro del frontend)
export async function listClasificaciones() {
  const [rows] = await pool.query(`
    SELECT id, nombre
    FROM clasificacion
    ORDER BY id;
  `);
  return rows;
}
