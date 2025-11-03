// src/models/dietaBalanceada.model.js

// ===== Helpers comunes =====
const toNumber = (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
};
const avg = (a, b) =>
    a !== undefined && b !== undefined ? (a + b) / 2 : undefined;
const round = (v, d = 1) =>
    typeof v === "number" ? Number(v.toFixed(d)) : v;
const round2 = (v, d = 2) =>
    typeof v === "number" ? Number(v.toFixed(d)) : v;

// ===== Sesión 1: Información General =====
/**
 * Recibe un objeto "raw" que puede venir como:
 *  - { form: {...}, pesoMedio? }
 *  - o directamente el "form"
 */
export function buildInfoGeneral(raw) {
    const f = raw?.form ? raw.form : (raw || {});

    const raza = f.raza || "";
    const sistema = f.sistema || "";
    const sexo = f.sexo || "";

    const pesoInicial = toNumber(f.pesoInicial);
    const pesoFinal = toNumber(f.pesoFinal);
    const pesoMedioIn = toNumber(raw?.pesoMedio);
    const pesoMedio = pesoMedioIn ?? avg(pesoInicial, pesoFinal);

    const pesoDiario = toNumber(f.pesoDiario); // kg/d
    const tempMax = toNumber(f.tempMax);    // °C
    const humedad = toNumber(f.humedad);    // %

    return {
        raza,
        sistema,
        sexo,
        pesoInicial: round(pesoInicial),
        pesoFinal: round(pesoFinal),
        pesoMedio: round(pesoMedio),
        pesoDiario: round(pesoDiario),
        tempMax: round(tempMax),
        humedad: round(humedad),
    };
}

// ===== Sesión 2A: Listado simple de materias seleccionadas =====
export function buildMateriasSeleccionadas(seleccionadas, restricciones) {
    const list = Array.isArray(seleccionadas) ? seleccionadas : [];
    const restr = restricciones && typeof restricciones === "object" ? restricciones : {};

    return list.map((m) => {
        const r = restr[m.id] || {};
        const costo = toNumber(r.costo);
        const min = toNumber(r.min);
        const max = toNumber(r.max);

        return {
            id: m.id,
            nombre: m.nombre || "",
            temporal: !!(m.temporal || m.isTemporal || m.esTemporal),
            costo: costo !== undefined ? round2(costo) : null,
            min: min !== undefined ? round2(min) : null,
            max: max !== undefined ? round2(max) : null,
        };
    });
}

// ===== Sesión 2B: Detalles bromatológicos =====
export const DETALLE_KEYS = [
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
    "CNF"
];

/** Fila de detalle para una materia */
export function buildDetalleBromatologicoRow(materia, detalle, keys = DETALLE_KEYS) {
    const valores = {};
    for (const k of keys) {
        const raw = detalle?.[k];
        const num = toNumber(raw);
        valores[k] = num !== undefined ? round2(num, 2) : null;
    }
    return {
        id: materia.id,
        nombre: materia.nombre || "",
        temporal: !!(materia.temporal || materia.isTemporal || materia.esTemporal),
        valores
    };
}

/** Convierte {id -> detalle} a lista de filas */
export function buildDetallesBromatologicos(materias, detallesById, keys = DETALLE_KEYS) {
    const list = Array.isArray(materias) ? materias : [];
    return list.map((m) => buildDetalleBromatologicoRow(m, detallesById?.[m.id], keys));
}
