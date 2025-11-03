// src/models/formulas/index.js

// === Orden por defecto (fallback) en la vista si una variante no define el suyo ===
const DEFAULT_OUTPUT_KEYS = [
    "L6", "L12", "L10", "L11", "L14", "L26", "L16", "L18", "L19", "L20", "L21", "L22",
    "L23", "L24", "L25", "L27", "L34", "L32", "L33", "L41", "L39", "L40", "L42", "L49",
    "L47", "L48", "L56", "L54", "L55", "L63", "L61", "L62", "L70", "L68", "L69", "L77",
    "L75", "L76", "L84", "L82", "L83", "L91", "L89", "L90", "L98", "L96", "L97", "L105",
    "L103", "L104", "L112", "L110", "L111", "L114", "L116", "L118", "L120", "L122"
];

// === Helpers: construir clave de selección
function buildKey({ raza, sistema, sexo }) {
    const r = String(raza || "").trim().toLowerCase();
    const s = String(sistema || "").trim().toLowerCase();
    const x = String(sexo || "").trim().toLowerCase();
    return `${r}|${s}|${x}`;
}

// === Normalizador universal: convierte cualquier prefijo a Lnn (L tiene prioridad)
const PREFIX_PRIORITY = ["L", "M", "N", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
function normalizeRawToL(raw) {
    const out = {};
    for (let n = 6; n <= 122; n++) {
        let val;
        for (const pre of PREFIX_PRIORITY) {
            const k = `${pre}${n}`;
            if (raw[k] !== undefined) { val = raw[k]; break; }
        }
        if (typeof val === "string" && val.trim() !== "" && !Number.isNaN(+val)) val = +val;
        out[`L${n}`] = val;
    }
    return out;
}

// === Helpers para variables de control (P8 / P14 / Q14 / R14)
function computeR3(ctx) { const { P3, Q3 } = ctx; return (Number(P3) + Number(Q3)) / 2; }
function computeP8(ctx) { const R3 = computeR3(ctx); return 0.8915 * Math.pow(R3, 1.0151); }
function computeP14(ctx) { const R3 = computeR3(ctx); return 0.8915 * Math.pow(R3, 1.0151); }
function computeQ14(ctx) { const R3 = computeR3(ctx); return 0.8915 * Math.pow(R3, 1.0151); }
function computeR14(ctx) { const R3 = computeR3(ctx); return 0.9247 * Math.pow(R3, 1.0085); }

// === Mapa de fórmulas por selección
const FORMULA_MAP = {
    // f1 — Cebú / Pastoreo
    "cebu|pastoreo|macho_entero": { loader: () => import("./f1.model.js"), variant: "f1" },
    "cebu|pastoreo|macho_castrado": { loader: () => import("./f1.model.js"), variant: "f1" },
    "cebu|pastoreo|hembra": { loader: () => import("./f1.model.js"), variant: "f1" },

    // f2 — Cruzado Carne / Pastoreo
    "cruzadocarne|pastoreo|macho_entero": { loader: () => import("./f2.model.js"), variant: "f2" },
    "cruzadocarne|pastoreo|macho_castrado": { loader: () => import("./f2.model.js"), variant: "f2" },
    "cruzadocarne|pastoreo|hembra": { loader: () => import("./f2.model.js"), variant: "f2" },

    // f3 — Cruzado Leche / Pastoreo
    "cruzadoleche|pastoreo|macho_entero": { loader: () => import("./f3.model.js"), variant: "f3" },
    "cruzadoleche|pastoreo|macho_castrado": { loader: () => import("./f3.model.js"), variant: "f3" },
    "cruzadoleche|pastoreo|hembra": { loader: () => import("./f3.model.js"), variant: "f3" },

    // f4 — Cebú / Estabulación
    "cebu|estabulacion|macho_entero": { loader: () => import("./f4.model.js"), variant: "f4" },
    // f5 — Cebú / Estabulación
    "cebu|estabulacion|macho_castrado": { loader: () => import("./f5.model.js"), variant: "f5" },
    // f6 — Cebú / Estabulación  ← NUEVO
    "cebu|estabulacion|hembra": { loader: () => import("./f6.model.js"), variant: "f6" },

    // f7–f9 — Cruzado Carne / Estabulación  ← NUEVOS
    "cruzadocarne|estabulacion|macho_entero": { loader: () => import("./f7.model.js"), variant: "f7" },
    "cruzadocarne|estabulacion|macho_castrado": { loader: () => import("./f8.model.js"), variant: "f8" },
    "cruzadocarne|estabulacion|hembra": { loader: () => import("./f9.model.js"), variant: "f9" },

    // f10–f12 — Cruzado Leche / Estabulación  ← NUEVOS
    "cruzadoleche|estabulacion|macho_entero": { loader: () => import("./f10.model.js"), variant: "f10" },
    "cruzadoleche|estabulacion|macho_castrado": { loader: () => import("./f11.model.js"), variant: "f11" },
    "cruzadoleche|estabulacion|hembra": { loader: () => import("./f12.model.js"), variant: "f12" },
};

// === Orden por variante ===
// f1 ya definido con L*; f4 definido con tu lista B* (convertida a L*). Añade f5…f12 cuando tengas sus órdenes.
const ORDER_BY_VARIANT_RAW = {
    f1: [
        "L6", "L12", "L10", "L11", "L14", "L26",
        "L16", "L18", "L19", "L20", "L21", "L22",
        "L23", "L24", "L25", "L27", "L34", "L32",
        "L33", "L41", "L39", "L40", "L42", "L49",
        "L47", "L48", "L56", "L54", "L55", "L63",
        "L61", "L62", "L70", "L68", "L69", "L77",
        "L75", "L76", "L84", "L82", "L83", "L91",
        "L89", "L90", "L98", "L96", "L97", "L105",
        "L103", "L104", "L112", "L110", "L111",
        "L114", "L116", "L118", "L120", "L122"
    ],
    f2: ["M6", "L12", "L10", "L11", "M14", "M26",
        "M16", "L18", "L19", "M20", "M21", "M22",
        "M23", "M24", "M25", "M27", "M34", "M32",
        "M33", "M41", "M39", "M40", "M42", "M49",
        "M47", "M48", "M56", "M54", "M55", "M63",
        "M61", "M62", "L70", "L68", "L69", "L77",
        "L75", "L76", "L84", "L82", "L83", "L91",
        "L89", "L90", "L98", "L96", "L97", "L105",
        "L103", "L104", "L112", "L110", "L111",
        "M114", "M116", "M118", "M120", "M122"],
    f3: ["N6", "L12", "L10", "L11", "M14", "N26", "N16", "L18", "L19",
        "N20", "N21", "N22", "N23", "N24", "N25", "N27",
        "M34", "M32", "M33", "M41", "M39", "M40", "M42",
        "M49", "M47", "M48", "M56", "M54", "M55", "M63",
        "M61", "M62", "L70", "L68", "L69", "L77", "L75",
        "L76", "L84", "L82", "L83", "L91", "L89", "L90",
        "L98", "L96", "L97", "L105", "L103", "L104", "L112",
        "L110", "L111", "N114", "N116", "N118", "N120", "N122"],
    f4: [
        "B6", "B12", "B10", "B101", "B14", "B26",
        "B16", "B18", "B19", "B20", "B21", "B22",
        "B23", "B24", "B25", "B27", "B34", "B32",
        "B33", "B41", "B39", "B40", "B42", "B49",
        "B47", "B48", "B56", "B54", "B55", "B63",
        "B61", "B62", "B70", "B68", "B69", "B77",
        "B75", "B76", "B84", "B82", "B83", "B91",
        "B89", "B90", "B98", "B96", "B97", "B105",
        "B103", "B104", "B112", "B110", "B111",
        "B114", "B116", "B118", "B120", "B122"
    ],
    f5: ["B6", "C12", "C10", "C11", "C14", "C26", "C16", "C18", "C19", "C20",
        "C21", "C22", "C23", "C24", "C25", "C27", "C34", "C32", "C33", "C41",
        "C39", "C40", "C42", "C49", "C47", "C48", "C56", "C54", "C55", "C63",
        "C61", "C62", "C70", "C68", "C69", "C77", "C75", "C76", "C84", "C82",
        "C83", "C91", "C89", "C90", "C98", "C96", "C97", "C105", "C103", "C104",
        "C112", "C110", "C111", "B114", "B116", "B118", "B120", "B122"],
    f6: ["B6", "D12", "D10", "D11", "D14", "D26", "D16", "D18", "D19", "D20",
        "D21", "D22", "D23", "D24", "D25", "D27", "D34", "D32", "D33", "D41",
        "D39", "D40", "D42", "D49", "D47", "D48", "D56", "D54", "D55", "D63",
        "D61", "D62", "D70", "D68", "D69", "D77", "D75", "D76", "D84", "D82",
        "D83", "D91", "D89", "D90", "D98", "D96", "D97", "D105", "D103", "D104",
        "D112", "D110", "D111", "B114", "B116", "B118", "B120", "B122"],
    f7: ["E6",
        "E12", "E10", "E11", "E14", "E26",
        "E16", "E18", "E19", "E20", "E21",
        "E22", "E23", "E24", "E25", "E27",
        "E34", "E32", "E33", "E41", "E39", "E40", "E42",
        "E49", "E47", "E48", "E56", "E54", "E55", "E63", "E61", "E62",
        "E70", "E68", "E69", "E77", "E75", "E76", "E84", "E82", "E83",
        "E91", "E89", "E90", "E98", "E96", "E97", "E105", "E103", "E104",
        "E112", "E110", "E111",
        "E114", "E116", "E118", "E120", "E122"],
    f8: ["E6",
        "F12", "F10", "F11", "F14", "F26",
        "F16", "F18", "F19", "F20", "F21",
        "F22", "F23", "F24", "F25", "F27",
        "F34", "F32", "F33", "F41", "F39", "F40", "F42",
        "F49", "F47", "F48", "F56", "F54", "F55", "F63", "F61", "F62",
        "F70", "F68", "F69", "F77", "F75", "F76", "F84", "F82", "F83",
        "F91", "F89", "F90", "F98", "F96", "F97", "F105", "F103", "F104",
        "F112", "F110", "F111",
        "E114", "E116", "E118", "E120", "E122"],
    f9: ["E6",
        "G12", "G10", "G11", "G14", "G26",
        "G16", "G18", "G19", "G20", "G21",
        "G22", "G23", "G24", "G25", "G27",
        "G34", "G32", "G33", "G41", "G39", "G40", "G42",
        "G49", "G47", "G48", "G56", "G54", "G55", "G63", "G61", "G62",
        "G70", "G68", "G69", "G77", "G75", "G76", "G84", "G82", "G83",
        "G91", "G89", "G90", "G98", "G96", "G97", "G105", "G103", "G104",
        "G112", "G110", "G111",
        "E114", "E116", "E118", "E120", "E122"],
    f10: ["H6",
        "H12", "H10", "H11", "H14", "H26",
        "H16", "H18", "H19", "H20", "H21",
        "H22", "H23", "H24", "H25", "H27",
        "H34", "H32", "H33", "H41", "H39", "H40", "H42",
        "H49", "H47", "H48", "H56", "H54", "H55", "H63", "H61", "H62",
        "H70", "H68", "H69", "H77", "H75", "H76", "H84", "H82", "H83",
        "H91", "H89", "H90", "H98", "H96", "H97", "H105", "H103", "H104",
        "H112", "H110", "H111",
        "H114", "H116", "H118", "H120", "H122"],
    f11: ["H6",
        "I12", "I10", "I11", "I14", "I26",
        "I16", "I18", "I19", "I20", "I21",
        "I22", "I23", "I24", "I25", "I27",
        "I34", "I32", "I33", "I41", "I39", "I40", "I42",
        "I49", "I47", "I48", "I56", "I54", "I55", "I63", "I61", "I62",
        "I70", "I68", "I69", "I77", "I75", "I76", "I84", "I82", "I83",
        "I91", "I89", "I90", "I98", "I96", "I97", "I105", "I103", "I104",
        "I112", "I110", "I111",
        "H114", "H116", "H118", "H120", "H122"],
    f12: ["H6",
        "J12", "J10", "J11", "J14", "J26",
        "J16", "J18", "J19", "J20", "J21",
        "J22", "J23", "J24", "J25", "J27",
        "J34", "J32", "J33", "J41", "J39", "J40", "J42",
        "J49", "J47", "J48", "J56", "J54", "J55", "J63", "J61", "J62",
        "J70", "J68", "J69", "J77", "J75", "J76", "J84", "J82", "J83",
        "J91", "J89", "J90", "J98", "J96", "J97", "J105", "J103", "J104",
        "J112", "J110", "J111",
        "H114", "H116", "H118", "H120", "H122"],
};

function toLOrder(arr) {
    if (!Array.isArray(arr)) return undefined;
    return arr.map(k => `L${String(k).replace(/^[A-Za-z]+/, "")}`);
}
const ORDER_BY_VARIANT = Object.fromEntries(
    Object.entries(ORDER_BY_VARIANT_RAW).map(([k, v]) => [k, toLOrder(v)])
);

// === Variable de control por variante ===
function pickControlForVariant(variant, ctx, raw) {
    const isFiniteNum = (v) => typeof v === "number" && Number.isFinite(v);
    switch (variant) {
        // Pastoreo → P8
        case "f1":
        case "f2":
        case "f3": {
            const val = isFiniteNum(raw?.P8) ? raw.P8 : computeP8(ctx);
            return { controlKey: "P8", controlValue: val };
        }
        // Estabulación Cebú → P14
        case "f4":
        case "f5":
        case "f6": {
            const val = isFiniteNum(raw?.P14) ? raw.P14 : computeP14(ctx);
            return { controlKey: "P14", controlValue: val };
        }
        // Estabulación Cruzado Carne → Q14
        case "f7":
        case "f8":
        case "f9": {
            const val = isFiniteNum(raw?.Q14) ? raw.Q14 : computeQ14(ctx);
            return { controlKey: "Q14", controlValue: val };
        }
        // Estabulación Cruzado Leche → R14
        case "f10":
        case "f11":
        case "f12": {
            const val = isFiniteNum(raw?.R14) ? raw.R14 : computeR14(ctx);
            return { controlKey: "R14", controlValue: val };
        }
        default:
            return { controlKey: undefined, controlValue: undefined };
    }
}

// === Función principal (router) ===
export async function computeFormulasBySelection(selection, ctx) {
    const key = buildKey(selection);
    const entry = FORMULA_MAP[key] || FORMULA_MAP["cebu|pastoreo|macho_entero"];
    const mod = await entry.loader();

    const calcFn = mod.calcularFormulas || mod.default;
    if (typeof calcFn !== "function") {
        throw new Error("El módulo de fórmulas no expone una función válida.");
    }

    // 1) Ejecuta la fórmula (puede devolver L*/M*/N*/B*…)
    const raw = calcFn(ctx);

    // 2) Normaliza SIEMPRE a L6..L122
    const resultados = normalizeRawToL(raw);
    if (!resultados || typeof resultados !== "object" || !("L6" in resultados) || !("L122" in resultados)) {
        throw new Error("La fórmula no retornó las claves normalizadas esperadas (L6…L122).");
    }

    // 3) Variable de control (para visibilidad de filas 4/5 en la vista)
    const { controlKey, controlValue } = pickControlForVariant(entry.variant, ctx, raw);

    // 4) Orden por variante (si no hay, la vista usará DEFAULT_OUTPUT_KEYS)
    const order =
        Array.isArray(ORDER_BY_VARIANT[entry.variant]) && ORDER_BY_VARIANT[entry.variant].length
            ? ORDER_BY_VARIANT[entry.variant]
            : undefined;

    return { resultados, controlKey, controlValue, order, variant: entry.variant };
}