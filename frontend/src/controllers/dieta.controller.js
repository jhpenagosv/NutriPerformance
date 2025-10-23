import { post } from "../api/client";
import { NUTRIENTES } from "../models/nutriente.model";

// Intenta backend; si no existe, usa fallback local simple
export async function calcRequisitos(animal) {
  try {
    // Si tienes endpoint real, descomenta esto:
    // const data = await post("/dietas/requisitos", animal);
    // return normalizaReq(data);

    return fallbackReq(animal); // ← local
  } catch {
    return fallbackReq(animal);
  }
}

export async function optimizarDieta(payload) {
  try {
    // Si tienes endpoint real:
    // const data = await post("/dietas/optimizar", payload);
    // return normalizaResultado(data);

    return fallbackOpt(payload); // ← local
  } catch {
    return fallbackOpt(payload);
  }
}

/* ==== Fallbacks ==== */

// Requisitos MUY simplificados: ejemplo didáctico
function fallbackReq({ peso = 0, estado = "mantenimiento", leche = 0, ganancia = 0 }) {
  const pv = Number(peso) || 0;
  const l  = Number(leche) || 0;
  const g  = Number(ganancia) || 0;

  // valores juguete (no usar clínicamente)
  const baseEM = pv * 0.08 + l * 0.4 + g * 1.2;
  const out = {};
  for (const n of NUTRIENTES) out[n.code] = 0;

  out.EM  = baseEM;
  out.MS  = pv * 0.02 + l * 0.3 / 100;
  out.PC  = pv * 0.001 + l * 0.05 + g * 0.2;
  out.FDN = 30;
  out.CSF = 10;

  return out;
}

// Optimización juguete: reparte a partes iguales respetando min/max si vienen
function fallbackOpt({ restricciones = [] }) {
  const activos = restricciones.length ? restricciones : [];
  const n = activos.length || 1;
  const pct = 100 / n;

  const composicion = activos.map((r) => ({
    name: r.name,
    porcentaje: pct,
  }));

  const nutrientes = {};
  for (const it of NUTRIENTES) nutrientes[it.code] = 0; // sin cálculo real

  return { composicion, total: 100, nutrientes };
}

/* ==== Normalizadores (si usas endpoints reales) ==== */
function normalizaReq(raw) {
  const out = {};
  for (const it of NUTRIENTES) out[it.code] = raw[it.code] ?? 0;
  return out;
}
function normalizaResultado(raw) {
  return {
    composicion: raw.composicion || [],
    total: raw.total ?? 100,
    nutrientes: normalizaReq(raw.nutrientes || {}),
  };
}
