// ESM
import pool from "../config/db.js";

/**
 * Columnas numéricas a promediar.
 * Si quieres cambiar los decimales del redondeo, ajusta DECIMALS.
 */
const DECIMALS = 2;
const NUM_COLS = [
  "MS","EE","EM","CSF","FDN","NDT","EN","PDR","PND","PC","PM",
  "Ca","P","Mg","K","Na","S","Co","Cu","I","Mn","Se","Zn"
];

// SELECT de promedios: ROUND(AVG(`col`), DECIMALS) AS `col`
const AVG_SELECT = NUM_COLS
  .map(c => `ROUND(AVG(\`${c}\`), ${DECIMALS}) AS \`${c}\``)
  .join(", ");

const MateriasModel = {
  /**
   * Devuelve una fila por materia_prima,
   * con el PROMEDIO de las columnas numéricas.
   */
  async findAll() {
    const [rows] = await pool.query(
      `SELECT \`materia_prima\`, ${AVG_SELECT}
         FROM \`materias_primas\`
        GROUP BY \`materia_prima\`
        ORDER BY \`materia_prima\` ASC`
    );
    return rows; // [{ materia_prima, MS(avg), EE(avg), ... }, ...]
  },

  // (Opcional) si alguna vez quieres las filas "sin agrupar":
  async findRaw() {
    const COLS = ["materia_prima", ...NUM_COLS].map(c => `\`${c}\``).join(", ");
    const [rows] = await pool.query(
      `SELECT ${COLS} FROM \`materias_primas\` ORDER BY \`materia_prima\` ASC`
    );
    return rows;
  }
};

export default MateriasModel;
