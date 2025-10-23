import { pool } from "../config/db.js";

/* ============================================================
   📦 MODELO: Materia Prima
   Funciones principales:
   - searchMateriasModel() → lista y filtra materias primas
   - detalleMateriaModel() → devuelve el promedio bromatológico (4 decimales)
   ============================================================ */

/**
 * 🔍 Buscar materias primas por nombre y/o clasificación
 * @param {string} query texto de búsqueda opcional
 * @param {number|null} clasificacion_id id de la clasificación (opcional)
 * @returns {Promise<Array>} lista [{id, nombre, clasificacion}]
 */
export async function searchMateriasModel(query, clasificacion_id) {
    const q = (query ?? "").trim();
    const c = Number(clasificacion_id) || null;

    // SQL base
    let sql = `
    SELECT 
      m.id,
      m.nombre,
      c.nombre AS clasificacion
    FROM materia_prima m
    JOIN clasificacion c ON c.id = m.clasificacion_id
    WHERE 1=1
  `;

    const params = [];

    // Filtro por texto
    if (q !== "") {
        sql += ` AND m.nombre LIKE ? `;
        params.push(`%${q}%`);
    }

    // Filtro por clasificación
    if (c) {
        sql += ` AND c.id = ? `;
        params.push(c);
    }

    // Orden y límite
    sql += ` ORDER BY m.nombre ASC LIMIT 200;`;

    const [rows] = await pool.query(sql, params);
    return rows; // [{ id, nombre, clasificacion }, ...]
}

/**
 * 📊 Obtener detalle bromatológico promedio (4 decimales)
 * @param {number} id ID de la materia prima
 * @returns {Promise<Object>} { materia, composicion }
 */
export async function detalleMateriaModel(id) {
    // 1️⃣ Datos generales de la materia prima
    const [matRows] = await pool.query(
        `
    SELECT 
      m.id, 
      m.nombre, 
      c.nombre AS clasificacion
    FROM materia_prima m
    JOIN clasificacion c ON c.id = m.clasificacion_id
    WHERE m.id = ?;
    `,
        [id]
    );

    const materia = matRows[0] || null;

    // 2️⃣ Promedio de composición (4 decimales)
    const [avgRows] = await pool.query(
        `
    SELECT
      ROUND(AVG(MS),4)  AS MS,
      ROUND(AVG(PB),4)  AS PB,
      ROUND(AVG(EE),4)  AS EE,
      ROUND(AVG(FDN),4) AS FDN,
      ROUND(AVG(CNF),4) AS CNF,
      ROUND(AVG(EM),4)  AS EM,
      ROUND(AVG(Ca),4)  AS Ca,
      ROUND(AVG(P),4)   AS P,
      ROUND(AVG(Mg),4)  AS Mg,
      ROUND(AVG(Na),4)  AS Na,
      ROUND(AVG(K),4)   AS K,
      ROUND(AVG(S),4)   AS S,
      ROUND(AVG(Co),4)  AS Co,
      ROUND(AVG(Cu),4)  AS Cu,
      ROUND(AVG(I),4)   AS I,
      ROUND(AVG(Fe),4)  AS Fe,
      ROUND(AVG(Mn),4)  AS Mn,
      ROUND(AVG(Se),4)  AS Se,
      ROUND(AVG(Zn),4)  AS Zn,
      ROUND(AVG(NDT),4) AS NDT
    FROM composicion
    WHERE materia_prima_id = ?;
    `,
        [id]
    );

    const composicion = avgRows[0] || null;

    // 3️⃣ Resultado final
    return { materia, composicion };
}
