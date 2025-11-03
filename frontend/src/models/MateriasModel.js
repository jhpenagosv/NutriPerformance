// src/models/MateriasModel.js

// === ORDEN DE NUTRIENTES (tu orden exacto) ===
export const DETAIL_KEYS = [
    "MS",
    "EM",
    "NDT",
    "PB",
    "Ca",
    "P",
    "Mg",
    "Na",
    "K",
    "S",
    "Cu",
    "Co",
    "Fe",
    "Mn",
    "Se",
    "Zn",
    "I",
    "FDN",
    "EE",
    "CNF",
];

export const pickDetalleKeys = (d) => {
    if (!d) return null;
    const out = {};
    DETAIL_KEYS.forEach((k) => {
        out[k] = d[k] ?? null;
    });
    return out;
};

/**
 * (Opcional) Si prefieres iterar en la vista sin depender del orden
 * de propiedades, usa este helper para obtener un array ya ordenado.
 */
export const toDetalleArray = (d) => {
    if (!d) return [];
    return DETAIL_KEYS.map((key) => ({ key, value: d[key] ?? null }));
};

export const ORDER = {
    clasificacion: ["Forraje", "Concentrado", "Mineral", "Suplemento", "Subproducto", "Aditivo", "Temporal"],
    nombre: [],
};

function getPriority(value, list) {
    const idx = list.findIndex((x) => String(x).toLowerCase() === String(value ?? "").toLowerCase());
    return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
}

export function makeMateriaComparator(order = ORDER) {
    const cList = order?.clasificacion ?? [];
    const nList = order?.nombre ?? [];
    return (a, b) => {
        const ca = (a.clasificacion ?? "").trim();
        const cb = (b.clasificacion ?? "").trim();
        const pcA = getPriority(ca, cList);
        const pcB = getPriority(cb, cList);
        if (pcA !== pcB) return pcA - pcB;
        const byClas = ca.localeCompare(cb, undefined, { sensitivity: "base" });
        if (byClas !== 0) return byClas;
        const na = (a.nombre ?? "").trim();
        const nb = (b.nombre ?? "").trim();
        const pnA = getPriority(na, nList);
        const pnB = getPriority(nb, nList);
        if (pnA !== pnB) return pnA - pnB;
        return na.localeCompare(nb, undefined, { sensitivity: "base" });
    };
}
