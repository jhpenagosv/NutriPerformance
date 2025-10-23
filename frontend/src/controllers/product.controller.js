// src/controllers/product.controller.js
// Controlador de productos predeterminados y temporales (solo válidos)

import { API_BASE as API_BASE_ENV } from "../utils/env";

const API_BASE = API_BASE_ENV || "http://localhost:3009/api";

// ====================== Productos predeterminados ======================
/**
 * Devuelve la lista real de productos predeterminados desde el backend.
 * Si el backend falla, no devuelve ningún producto (sin lista de demo).
 */
export async function fetchPredeterminados() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort("timeout"), 8000);

  try {
    const res = await fetch(`${API_BASE}/materias-primas`, { signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) throw new Error(text || String(res.status));
    const data = JSON.parse(text || "[]");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // 🚫 Sin fallback: si falla, devolvemos arreglo vacío
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// ====================== Productos temporales ======================
/**
 * Solo lee desde localStorage, sin generar ni inyectar demos.
 * Filtra para incluir únicamente los creados por el modal (con __ts numérico).
 */
export async function fetchTemporales() {
  const KEY = "np_productos_temporales_v1";
  try {
    const raw = localStorage.getItem(KEY) || "[]";
    let arr = JSON.parse(raw);
    if (!Array.isArray(arr)) arr = [];

    const validos = arr.filter(
      (x) =>
        x &&
        typeof x.materia_prima === "string" &&
        typeof x.__ts === "number" &&
        Number.isFinite(x.__ts)
    );

    // Limpieza automática si hay restos viejos sin __ts
    if (validos.length !== arr.length) {
      localStorage.setItem(KEY, JSON.stringify(validos));
    }

    return validos;
  } catch {
    return [];
  }
}

// ====================== Filtros y utilidades ======================
/**
 * Filtra por texto y devuelve un máximo de 10 resultados.
 */
export function filtrarMax10(list, query) {
  const q = String(query || "").trim().toLowerCase();
  const src = Array.isArray(list) ? list : [];
  if (!q) return src.slice(0, 10);
  const out = [];
  for (let i = 0; i < src.length; i++) {
    const row = src[i];
    const name = (row?.materia_prima || "").toLowerCase();
    if (name.includes(q)) out.push(row);
    if (out.length >= 10) break;
  }
  return out;
}

// ====================== Health check (opcional) ======================
/**
 * Verifica conexión con el backend. No afecta la UI.
 */
export async function health() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort("timeout"), 4000);
  try {
    const res = await fetch(`${API_BASE}/dietas/ping`, { signal: ctrl.signal });
    const text = await res.text();
    const data = JSON.parse(text || "{}");
    return { ok: true, ...data };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
