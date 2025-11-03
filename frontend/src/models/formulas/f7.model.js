// src/models/fE.model.js
export function calcularFormulas(ctx) {
    // Utilidades
    const porc = (x) => x / 100;
    const divPorPorc = (valor, base) => valor / (base / 100);

    // Entradas base
    const { P3, Q3, T3, V3, W3 } = ctx;
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // Constantes (permite overrides vía ctx)
    const T8 = ctx.T8 ?? 517;
    const P45 = ctx.P45 ?? 56.8;
    const Q45 = ctx.Q45 ?? 67.8;
    const R45 = ctx.R45 ?? 35.5;
    const S45 = ctx.S45 ?? 37.1;
    const T45 = ctx.T45 ?? 48.4;
    const U45 = ctx.U45 ?? 77.3;
    const V45 = ctx.V45 ?? 73.5;
    const W45 = ctx.W45 ?? 86.8;
    const X45 = ctx.X45 ?? 73.4;
    const Y45 = ctx.Y45 ?? 43.9;
    const Z45 = ctx.Z45 ?? 48.7;
    const AA45 = ctx.AA45 ?? 66.8;
    const Y40 = ctx.Y40 ?? 47.4;

    // Bases
    const R3 = (P3 + Q3) / 2;         // AVERAGE(P3:Q3)
    const S3 = Math.pow(R3, 0.75);
    const U3 = T3 * T3;

    // Derivados comunes
    const P16 = 0.963 * Math.pow(T3, 1.0151);
    const Q14 = 0.8915 * Math.pow(R3, 1.0151);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);

    const T14 = 0.7248 * Math.pow(Q14, 1.0314);
    const T18 = (T14 / T8) * T8;

    const V14 = 0.6241 * Math.pow(P14, 1.0608);
    const V18 = (V14 / T8) * T8;

    // E6..E14
    const E6 = (-0.6273 + (0.06453 * S3) + (3.871 * T3) - (0.614 * U3));
    const E7 = 0.075 * Math.pow(T14, 0.75);
    const E8 = 0.061 * Math.pow(T18, 0.75) * Math.pow(P16, 1.035);

    const C8 = 0.061 * Math.pow(V18, 0.75) * Math.pow(P16, 1.035);
    const T22 = 1.14 * Math.pow(C8 / P16, -1.137);

    const Q19 = (0.513 + (0.173 * T22) + (0.073 * P16)) * 1;
    const E10 = E7 / Q19;

    const T26 = 0.327 / (0.539 + T22);
    const E11 = E8 / T26;

    const E12 = E10 + E11;

    // Interpretación corregida que validaste:
    // E13 = ((E12/E6) + (0.3032/0.9455)) * E6
    const E13 = ((E12 / E6) + (0.3032 / 0.9455)) * E6;
    const E14 = E13 / 4.4;

    // E16..E21
    const E16 = 3.6 * Math.pow(Q14, 0.75);
    const E17 = (176.01 * P16) - (0.381 * Math.pow(T18, 0.75) * Math.pow(P16, 1.035));
    const Q40 = 84.665 - (0.1179 * T18);
    const E18 = divPorPorc(E17, Q40);
    const E19 = divPorPorc(E17, Y40);
    const E20 = E16 + E18;
    const E21 = E16 + E19;

    // Series para E22 (W255) y E23 (W150) — manteniendo /1000 en cada paso
    const V155 = ((120 * E14) + (E20 - (120 * E14) * 0.64) / 0.8) / 1000;
    function serieRec(desde, hasta, seed, corriente) {
        const out = {}; out[desde] = seed;
        for (let i = desde + 1; i <= hasta; i++) {
            const prev = out[i - 1];
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
        }
        return out;
    }
    const V_hi = serieRec(155, 255, V155, E20);
    const W255 = (-53.07 + (304.9 * V_hi[255]) + (90.8 * E14) - (3.13 * Math.pow(E14, 2)));
    const E22 = W255;

    const V50 = ((120 * E14) + (E21 - (120 * E14) * 0.64) / 0.8) / 1000;
    const V_lo = serieRec(50, 150, V50, E21);
    const W150 = (-53.07 + (304.9 * V_lo[150]) + (90.8 * E14) - (3.13 * Math.pow(E14, 2)));
    const E23 = W150;

    // E24..E27
    const E24 = (E20 - (E23 * 0.64)) / 0.8;
    const E25 = (E21 - (E23 * 0.64)) / 0.8;
    const E26 = E22 + E24;
    const E27 = E23 + E25;

    // Bloques minerales (E32..E42, E49..E112)
    const B29 = (11.7 * R3) / 1000;
    const E30 = P16 * (66 * Math.pow(T14, -0.32));
    const E31 = B29 + E30;
    const E32 = divPorPorc(B29, P45);
    const E33 = divPorPorc(E30, P45);
    const E34 = E32 + E33;

    const B36 = (13.5 * R3) / 1000;
    const E37 = P16 * (25.4 * Math.pow(T14, -0.25));
    const E38 = B36 + E37;
    const E39 = divPorPorc(B36, Q45);
    const E40 = divPorPorc(E37, Q45);
    const E41 = E39 + E40;

    const E42 = E34 / E41;

    const B44 = (5.9 * R3) / 1000;
    const E45 = P16 * (1.0597 * Math.pow(T14, -0.2386));
    const E46 = B44 + E45;
    const E47 = divPorPorc(B44, R45);
    const E48 = divPorPorc(E45, R45);
    const E49 = E47 + E48;

    const B51 = (6.3 * R3) / 1000;
    const E52 = P16 * (1.977 * Math.pow(T14, -0.058));
    const E53 = B51 + E52;
    const E54 = divPorPorc(B51, S45);
    const E55 = divPorPorc(E52, S45);
    const E56 = E54 + E55;

    const B58 = (23.5 * R3) / 1000;
    const E59 = P16 * (0.3418 * Math.pow(T14, 0.32));
    const E60 = B58 + E59;
    const E61 = divPorPorc(B58, T45);
    const E62 = divPorPorc(E59, T45);
    const E63 = E61 + E62;

    const B65 = (10.4 * R3) / 1000;
    const E66 = P16 * (0.03 * Math.pow(T14, 0.89));
    const E67 = B65 + E66;
    const E68 = divPorPorc(B65, U45);
    const E69 = divPorPorc(E66, U45);
    const E70 = E68 + E69;

    const B72 = (95.6 * R3) / 1000;
    const E73 = P16 * (1.25 * Math.pow(T14, 0.33));
    const E74 = B72 + E73;
    const E75 = divPorPorc(B72, V45);
    const E76 = divPorPorc(E73, V45);
    const E77 = E75 + E76;

    const B79 = (13.5 * R3) / 1000;
    const E80 = P16 * (0.045 * Math.pow(T14, -0.023));
    const E81 = B79 + E80;
    const E82 = divPorPorc(B79, W45);
    const E83 = divPorPorc(E80, W45);
    const E84 = E82 + E83;

    const B86 = (2942 * R3) / 1000;
    const E87 = P16 * (10.4 * Math.pow(T14, 0.24));
    const E88 = B86 + E87;
    const E89 = divPorPorc(B86, X45);
    const E90 = divPorPorc(E87, X45);
    const E91 = E89 + E90;

    const B93 = (184.9 * R3) / 1000;
    const E94 = P16 * (0.07 * Math.pow(T14, 0.8));
    const E95 = B93 + E94;
    const E96 = divPorPorc(B93, Y45);
    const E97 = divPorPorc(E94, Y45);
    const E98 = E96 + E97;

    const B100 = (3.72 * R3) / 1000;
    const E101 = P16 * (1.07 * Math.pow(T14, -0.07));
    const E102 = B100 + E101;
    const E103 = divPorPorc(B100, Z45);
    const E104 = divPorPorc(E101, Z45);
    const E105 = E103 + E104;

    const B107 = (334.4 * R3) / 1000;
    const E108 = P16 * (1.16 * Math.pow(T14, 0.86));
    const E109 = B107 + E108;
    const E110 = B107 / (AA45 / 100);
    const E111 = E108 / (AA45 / 100);
    const E112 = E110 + E111;

    // Finales
    const E114 = 0.5 * E6;
    const E116 = E6 * porc(25);
    const E118 = E6 * porc(5);

    // E120 corregida: incluye (E27 / 1000)
    const E120 = (E6 * porc(90)) - ((E27 / 1000) + E116 + E118);

    const E122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * E6);

    // === SOLO ESTAS CLAVES, EN ESTE ORDEN ===
    return {
        E6,
        E12, E10, E11, E14, E26,
        E16, E18, E19, E20, E21,
        E22, E23, E24, E25, E27,
        E34, E32, E33, E41, E39, E40, E42,
        E49, E47, E48, E56, E54, E55, E63, E61, E62,
        E70, E68, E69, E77, E75, E76, E84, E82, E83,
        E91, E89, E90, E98, E96, E97, E105, E103, E104,
        E112, E110, E111,
        E114, E116, E118, E120, E122
    };
}