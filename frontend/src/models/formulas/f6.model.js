// src/models/fD.model.js
// Modelo "columna D" con la misma estructura que f2.model.js (cálculo puro)

export function calcularFormulas(ctx) {
    // === Utilidades ===
    const porc = (x) => x / 100;
    const divPorPorc = (valor, base) => valor / (base / 100);

    // === Entradas base obligatorias ===
    const { P3, Q3, T3, V3, W3 } = ctx;
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // === Constantes con posibilidad de override (mismos defaults que f2) ===
    const Z45 = ctx.Z45 ?? 48.7;
    const T8 = ctx.T8 ?? 517;
    const P45 = ctx.P45 ?? 56.8;
    const Q45 = ctx.Q45 ?? 67.8;
    const R45 = ctx.R45 ?? 35.5;
    const S45 = ctx.S45 ?? 37.1;
    const U45 = ctx.U45 ?? 77.3;
    const V45 = ctx.V45 ?? 73.5;
    const T45 = ctx.T45 ?? 48.4;
    const Y45 = ctx.Y45 ?? 43.9;
    const AA45 = ctx.AA45 ?? 66.8;
    const W45 = ctx.W45 ?? 86.8;
    const X45 = ctx.X45 ?? 73.4;
    const R33 = ctx.R33 ?? 47.4;
    const Y40 = ctx.Y40 ?? 47.4;

    // === Bases ===
    const R3 = (P3 + Q3) / 2;
    const S3 = Math.pow(R3, 0.75);
    const U3 = T3 * T3;

    const P16 = 0.963 * Math.pow(T3, 1.0151);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);
    const R14 = 0.9247 * Math.pow(R3, 1.0085);

    // === Magnitudes "B*" lineales por R3 ===
    const B107 = (334.4 * R3) / 1000;
    const B65 = (10.4 * R3) / 1000;
    const B79 = (13.5 * R3) / 1000;
    const B86 = (2942 * R3) / 1000;
    const B51 = (6.3 * R3) / 1000;
    const B100 = (3.72 * R3) / 1000;
    const B58 = (23.5 * R3) / 1000;
    const B29 = (11.7 * R3) / 1000;
    const B44 = (5.9 * R3) / 1000;
    const B36 = (13.5 * R3) / 1000;
    const B72 = (95.6 * R3) / 1000;
    const B93 = (184.9 * R3) / 1000;

    // === Derivados (S14/U14/Y14) y escalas 517 ===
    const S14 = 0.8126 * Math.pow(P14, 1.0134);
    const U14 = 0.7248 * Math.pow(R14, 1.0314);
    const Y14 = 0.611 * Math.pow(P14, 1.0667);

    const S18 = (S14 / T8) * T8;
    const U18 = (U14 / T8) * T8;
    const Y18 = (Y14 / T8) * T8;

    // === Tasas respiratorias ===
    const B7 = 0.075 * Math.pow(S14, 0.75);
    const D7 = 0.075 * Math.pow(Y14, 0.75);
    const B8 = 0.061 * Math.pow(S18, 0.75) * Math.pow(P16, 1.035);
    const D8 = 0.061 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035);
    const H8 = 0.061 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035);

    // === Relacionadores (Y22/S22 → Y26/S26) y P19 ===
    const Y22 = 1.14 * Math.pow(H8 / P16, -1.137);
    const S22 = 1.14 * Math.pow(B8 / P16, -1.137);
    const Y26 = 0.327 / (0.539 + Y22);
    const S26 = 0.327 / (0.539 + S22);
    const P19 = (0.513 + 0.173 * S22 + 0.1 * P16) * 1;

    // === Bloque B6..B14 / D10..D14 (¡B6 primero!) ===
    const B10 = B7 / P19;
    const B11 = B8 / S26;
    const B12 = B10 + B11;

    const B6 = (-2.1948 + 0.08388 * S3 + 3.9328 * T3 - 0.903 * U3);

    // OJO: sólo 0.3032 se divide entre 0.9455
    const B13 = ((B12 / B6) + (0.3032 / 0.9455)) * B6;
    const B14 = B13 / 4.4;

    const D10 = D7 / P19;
    const D11 = D8 / Y26;
    const D12 = D10 + D11;
    // OJO: sólo 0.3032 se divide entre 0.9455
    const D13 = ((D12 / B6) + (0.3032 / 0.9455)) * B6;
    const D14 = D13 / 4.4;

    // === Mantenimiento / producción ===
    const V40 = 84.665 - (0.1179 * Y18);
    const B16 = 3.6 * Math.pow(P14, 0.75);
    const D16 = 3.6 * Math.pow(P14, 0.75);

    const B17 = (176.01 * P16) - (0.381 * Math.pow(S18, 0.75) * Math.pow(P16, 1.035));
    const B19 = divPorPorc(B17, Y40);   // B17 / (Y40%)
    const B21 = B16 + B19;

    const D17 = (176.01 * P16) - (0.381 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035));
    const D18 = divPorPorc(D17, V40);   // D17 / (V40%)
    const D19 = divPorPorc(D17, Y40);   // D17 / (Y40%)
    const D20 = D16 + D18;
    const D21 = D16 + D19;

    // === Bloque Dxx por porcentaje ===
    const D30 = P16 * (147 * Math.pow(Y14, -0.5));
    const D37 = P16 * (38.6 * Math.pow(Y14, -0.36));
    const D45 = P16 * (0.3466 * Math.pow(Y14, 0.0113));
    const D52 = P16 * (5.594 * Math.pow(Y14, -0.2998));
    const D59 = P16 * (0.9463 * Math.pow(Y14, 0.1216));
    const D66 = P16 * (0.03 * Math.pow(Y14, 0.89));
    const D73 = P16 * (1.25 * Math.pow(Y14, 0.33));
    const D80 = P16 * (0.045 * Math.pow(Y14, -0.023));
    const D87 = P16 * (10.4 * Math.pow(Y14, 0.24));
    const D94 = P16 * (0.07 * Math.pow(Y14, 0.8));
    const D101 = P16 * (1.07 * Math.pow(Y14, -0.07));
    const D108 = P16 * (1.16 * Math.pow(Y14, 0.86));

    const D32 = divPorPorc(B29, P45);
    const D33 = divPorPorc(D30, P45);
    const D39 = divPorPorc(B36, Q45);
    const D40 = divPorPorc(D37, Q45);
    const D47 = divPorPorc(B44, R45);
    const D48 = divPorPorc(D45, R45);
    const D54 = divPorPorc(B51, S45);
    const D55 = divPorPorc(D52, S45);
    const D61 = divPorPorc(B58, T45);
    const D62 = divPorPorc(D59, T45);
    const D68 = divPorPorc(B65, U45);
    const D69 = divPorPorc(D66, U45);
    const D75 = divPorPorc(B72, V45);
    const D76 = divPorPorc(D73, V45);
    const D82 = divPorPorc(B79, W45);
    const D83 = divPorPorc(D80, W45);
    const D89 = divPorPorc(B86, X45);
    const D90 = divPorPorc(D87, X45);
    const D96 = divPorPorc(B93, Y45);
    const D97 = divPorPorc(D94, Y45);
    const D103 = divPorPorc(B100, Z45);
    const D104 = divPorPorc(D101, Z45);
    const D110 = divPorPorc(B107, AA45);
    const D111 = divPorPorc(D108, AA45);

    // === Totales tipo SUM() + razón D42 ===
    const D34 = D32 + D33;
    const D41 = D39 + D40;
    const D49 = D47 + D48;
    const D56 = D54 + D55;
    const D63 = D61 + D62;
    const D70 = D68 + D69;
    const D77 = D75 + D76;
    const D84 = D82 + D83;
    const D91 = D89 + D90;
    const D98 = D96 + D97;
    const D105 = D103 + D104;
    const D112 = D110 + D111;

    const D42 = D34 / D41;

    // === SERIES (T y P) y polinomios ===
    function serieRec(desde, hasta, seed, corriente) {
        const out = {}; out[desde] = seed;
        for (let i = desde + 1; i <= hasta; i++) {
            const prev = out[i - 1];
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
        }
        return out;
    }

    // T (para D22/D23)
    const T50 = ((120 * D14) + (D21 - (120 * D14) * 0.64) / 0.8) / 1000;
    const T155 = ((120 * D14) + (D20 - (120 * D14) * 0.64) / 0.8) / 1000;
    const T_hi = serieRec(50, 150, T50, D21);
    const T_lo = serieRec(155, 255, T155, D20);

    const T150 = T_hi[150];
    const T255 = T_lo[255];

    const U150 = (-53.07 + (304.9 * T150) + (90.8 * D14) - (3.13 * Math.pow(D14, 2)));
    const U255 = (-53.07 + (304.9 * T255) + (90.8 * D14) - (3.13 * Math.pow(D14, 2)));

    const D23 = U150;
    const D22 = U255;

    const D25 = (D21 - (D23 * 0.64)) / 0.8;
    const D24 = (D20 - (D23 * 0.64)) / 0.8;
    const D27 = D23 + D25;
    const D26 = D22 + D24;

    // P (para B23/B27 → B120)
    const P50 = ((120 * B14) + (B21 - (120 * B14) * 0.64) / 0.8) / 1000;
    const P_hi = serieRec(50, 150, P50, B21);
    const P150 = P_hi[150];

    const Q150 = (-53.07 + (304.9 * P150) + (90.8 * B14) - (3.13 * Math.pow(B14, 2)));
    const B23 = Q150;
    const B25 = (B21 - (B23 * 0.64)) / 0.8;
    const B27 = B23 + B25;

    // === Paquete B* (114..122) ===
    const B114 = 0.5 * B6;
    const B116 = B6 * porc(25);
    const B118 = B6 * porc(5);
    const B120 = (B6 * porc(90)) - ((B27 / 1000) + B116 + B118);
    const B122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * B6);

    // === Salida EXACTA y en el ORDEN solicitado ===
    return {
        B6,
        D12, D10, D11, D14, D26, D16, D18, D19, D20, D21, D22, D23, D24, D25, D27,
        D34, D32, D33, D41, D39, D40, D42, D49, D47, D48, D56, D54, D55, D63, D61,
        D62, D70, D68, D69, D77, D75, D76, D84, D82, D83, D91, D89, D90, D98, D96,
        D97, D105, D103, D104, D112, D110, D111,
        B114, B116, B118, B120, B122
    };
}

const _default = { calcularFormulas };
export default _default;
if (typeof module !== "undefined" && module.exports) {
    module.exports = _default;
}
