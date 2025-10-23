// src/models/materiasPrimas.model.js
import db from "../config/db.js";

// ⬇️ ANTES: const DECIMALS = 2;
const DECIMALS = 4;

const COLS = [
  "MS","EE","EM","CSF","FDN","NDT","EN","PDR","PND","PC","PM",
  "Ca","P","Mg","K","Na","S","Co","Cu","I","Mn","Se","Zn",
];

// AVG(...) redondeado a DECIMALS
const AVG_SELECT = COLS
  .map((c) => `ROUND(AVG(${c}), ${DECIMALS}) AS ${c}`)
  .join(", ");

export async function findAll() {
  // Promedios por materia_prima (lo que usas en /api/materias-primas)
  const [rows] = await db.query(
    `
    SELECT materia_prima, ${AVG_SELECT}
    FROM materias_primas
    GROUP BY materia_prima
    ORDER BY materia_prima ASC
    `
  );
  return rows;
}

// (Opcional) Devolver filas crudas SIN promediar ni redondear
export async function findRaw() {
  const [rows] = await db.query(
    `
    SELECT id, materia_prima, ${COLS.join(", ")}
    FROM materias_primas
    ORDER BY id ASC
    `
  );
  return rows;
}
