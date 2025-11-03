import { pool } from '../config/db.js';

/**
 * Lista de materias con filtros opcionales
 * { q, clasificacionId }
 */
export async function getMaterias({ q, clasificacionId }) {
  const filters = [];
  const params = [];

  if (q) { filters.push('mp.nombre LIKE ?'); params.push(`%${q}%`); }
  if (clasificacionId) { filters.push('mp.clasificacion_id = ?'); params.push(Number(clasificacionId)); }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `
    SELECT mp.id, mp.nombre, mp.clasificacion_id, c.nombre AS clasificacion
    FROM materia_prima mp
    INNER JOIN clasificacion c ON c.id = mp.clasificacion_id
    ${where}
    ORDER BY mp.nombre ASC;
    `,
    params
  );
  return rows;
}

/**
 * Promedio (10,4) para UNA materia por id
 */
export async function getPromedioComposicionByMateriaId(materiaId) {
  const [rows] = await pool.query(
    `
    SELECT
      mp.id AS materia_prima_id,
      mp.nombre AS materia_prima,
      cl.id AS clasificacion_id,
      cl.nombre AS clasificacion,
      ROUND(AVG(c.MS), 4)  AS MS,
      ROUND(AVG(c.PB), 4)  AS PB,
      ROUND(AVG(c.EE), 4)  AS EE,
      ROUND(AVG(c.FDN), 4) AS FDN,
      ROUND(AVG(c.CNF), 4) AS CNF,
      ROUND(AVG(c.EM), 4)  AS EM,
      ROUND(AVG(c.Ca), 4)  AS Ca,
      ROUND(AVG(c.P), 4)   AS P,
      ROUND(AVG(c.Mg), 4)  AS Mg,
      ROUND(AVG(c.Na), 4)  AS Na,
      ROUND(AVG(c.K), 4)   AS K,
      ROUND(AVG(c.S), 4)   AS S,
      ROUND(AVG(c.Co), 4)  AS Co,
      ROUND(AVG(c.Cu), 4)  AS Cu,
      ROUND(AVG(c.I), 4)   AS I,
      ROUND(AVG(c.Fe), 4)  AS Fe,
      ROUND(AVG(c.Mn), 4)  AS Mn,
      ROUND(AVG(c.Se), 4)  AS Se,
      ROUND(AVG(c.Zn), 4)  AS Zn,
      ROUND(AVG(c.NDT), 4) AS NDT,
      COUNT(c.id)          AS composiciones_contadas
    FROM materia_prima mp
    INNER JOIN clasificacion cl ON cl.id = mp.clasificacion_id
    LEFT JOIN composicion c     ON c.materia_prima_id = mp.id
    WHERE mp.id = ?
    GROUP BY mp.id, mp.nombre, cl.id, cl.nombre;
    `,
    [Number(materiaId)]
  );
  return rows[0] || null;
}

/**
 * Promedios (10,4) para muchas materias (filtros opcionales)
 * { materiaId, clasificacionId }
 */
export async function getPromediosComposicion({ materiaId, clasificacionId }) {
  const filters = [];
  const params = [];

  if (clasificacionId) { filters.push('mp.clasificacion_id = ?'); params.push(Number(clasificacionId)); }
  if (materiaId) { filters.push('mp.id = ?'); params.push(Number(materiaId)); }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `
    SELECT
      mp.id AS materia_prima_id,
      mp.nombre AS materia_prima,
      cl.id AS clasificacion_id,
      cl.nombre AS clasificacion,
      ROUND(AVG(c.MS), 4)  AS MS,
      ROUND(AVG(c.PB), 4)  AS PB,
      ROUND(AVG(c.EE), 4)  AS EE,
      ROUND(AVG(c.FDN), 4) AS FDN,
      ROUND(AVG(c.CNF), 4) AS CNF,
      ROUND(AVG(c.EM), 4)  AS EM,
      ROUND(AVG(c.Ca), 4)  AS Ca,
      ROUND(AVG(c.P), 4)   AS P,
      ROUND(AVG(c.Mg), 4)  AS Mg,
      ROUND(AVG(c.Na), 4)  AS Na,
      ROUND(AVG(c.K), 4)   AS K,
      ROUND(AVG(c.S), 4)   AS S,
      ROUND(AVG(c.Co), 4)  AS Co,
      ROUND(AVG(c.Cu), 4)  AS Cu,
      ROUND(AVG(c.I), 4)   AS I,
      ROUND(AVG(c.Fe), 4)  AS Fe,
      ROUND(AVG(c.Mn), 4)  AS Mn,
      ROUND(AVG(c.Se), 4)  AS Se,
      ROUND(AVG(c.Zn), 4)  AS Zn,
      ROUND(AVG(c.NDT), 4) AS NDT,
      COUNT(c.id)          AS composiciones_contadas
    FROM materia_prima mp
    INNER JOIN clasificacion cl ON cl.id = mp.clasificacion_id
    LEFT JOIN composicion c     ON c.materia_prima_id = mp.id
    ${where}
    GROUP BY mp.id, mp.nombre, cl.id, cl.nombre
    ORDER BY cl.id, mp.id;
    `,
    params
  );

  return rows;
}
