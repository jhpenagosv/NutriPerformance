/**
 * @typedef {Object} Materia
 * @property {number|string}
 * @property {string}
 * @property {string=}
 * @property {number=}
 */

export function normalizeMateria(raw = {}) {
    return {
        id: raw.id ?? raw.materia_id ?? String(Math.random()),
        nombre: raw.nombre ?? raw.materia ?? "—",
        clasificacion: raw.clasificacion ?? raw.categoria ?? null,
        costo: typeof raw.costo === "number" ? raw.costo
            : (raw.precio_unitario ?? raw.costo_unitario ?? null),
    };
}

export function normalizeMaterias(arr = []) {
    return Array.isArray(arr) ? arr.map(normalizeMateria) : [];
}