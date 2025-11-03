// src/models/fF.model.js
export function calcularFormulas(ctx) {
    // Utilidades
    const porc = (x) => x / 100;
    const divPorPorc = (valor, base) => valor / (base / 100);

    // Entradas base
    const { P3, Q3, T3, V3, W3 } = ctx;
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // Constantes (overrides opcionales)
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

    // Bases comunes
    const R3 = (P3 + Q3) / 2; // AVERAGE(P3:Q3)
    const S3 = Math.pow(R3, 0.75);
    const U3 = T3 * T3;

    // Derivados base
    const P16 = 0.963 * Math.pow(T3, 1.0151);
    const Q14 = 0.8915 * Math.pow(R3, 1.0151);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);

    // ----- Rama F (W14/W18) -----
    const W14 = 0.6586 * Math.pow(Q14, 1.0499);
    const W18 = (W14 / T8) * T8;

    // Para T22 (vía C8) pide V14/V18
    const V14d = 0.6241 * Math.pow(P14, 1.0608);
    const V18 = (V14d / T8) * T8;

    // E6 (se usa dentro de F13/F14 y en el bloque E final)
    const E6 = (-0.6273 + (0.06453 * S3) + (3.871 * T3) - (0.614 * U3));

    // F7..F12
    const F7 = 0.075 * Math.pow(W14, 0.75);
    const F8 = 0.061 * Math.pow(W18, 0.75) * Math.pow(P16, 1.035);
    const F9 = F7 + F8;

    const C8 = 0.061 * Math.pow(V18, 0.75) * Math.pow(P16, 1.035);
    const T22 = 1.14 * Math.pow(C8 / P16, -1.137);
    const Q19 = (0.513 + (0.173 * T22) + (0.073 * P16)) * 1;

    const F10 = F7 / Q19;

    const W22 = 1.14 * Math.pow(F8 / P16, -1.137);
    const W26 = 0.327 / (0.539 + W22);
    const F11 = F8 / W26;

    const F12 = F10 + F11;

    // F13/F14 (misma interpretación que validaste en E)
    const F13 = ((F12 / E6) + (0.3032 / 0.9455)) * E6;
    const F14 = F13 / 4.4;

    // F16..F21
    const F16 = 3.6 * Math.pow(Q14, 0.75);
    const F17 = (176.01 * P16) - (0.381 * Math.pow(W18, 0.75) * Math.pow(P16, 1.035));
    const T40 = 84.665 - (0.1179 * W18);
    const F18 = divPorPorc(F17, T40);
    const F19 = divPorPorc(F17, Y40);
    const F20 = F16 + F18;
    const F21 = F16 + F19;

    // Series X155..X255 (corriente = F20) -> F22
    const X155 = ((120 * F14) + (F20 - (120 * F14) * 0.64) / 0.8) / 1000;
    function serieRec(desde, hasta, seed, corriente) {
        const out = {}; out[desde] = seed;
        for (let i = desde + 1; i <= hasta; i++) {
            const prev = out[i - 1];
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
        }
        return out;
    }
    const X_hi = serieRec(155, 255, X155, F20);
    const Y255 = (-53.07 + (304.9 * X_hi[255]) + (90.8 * F14) - (3.13 * Math.pow(F14, 2)));
    const F22 = Y255;

    // Series X50..X150 (corriente = F21) -> F23
    const X50 = ((120 * F14) + (F21 - (120 * F14) * 0.64) / 0.8) / 1000;
    const X_lo = serieRec(50, 150, X50, F21);
    const Y150 = (-53.07 + (304.9 * X_lo[150]) + (90.8 * F14) - (3.13 * Math.pow(F14, 2)));
    const F23 = Y150;

    // F24..F27
    const F24 = (F20 - (F23 * 0.64)) / 0.8;
    const F25 = (F21 - (F23 * 0.64)) / 0.8;
    const F26 = F22 + F24;
    const F27 = F23 + F25;

    // ----- Bloque “minerales” versión F -----
    const B29 = (11.7 * R3) / 1000;
    const F30 = P16 * (66 * Math.pow(W14, -0.32));
    const F31 = B29 + F30;
    const F32 = divPorPorc(B29, P45);
    const F33 = divPorPorc(F30, P45);
    const F34 = F32 + F33;

    const B36 = (13.5 * R3) / 1000;
    const F37 = P16 * (25.4 * Math.pow(W14, -0.25));
    const F38 = B36 + F37;
    const F39 = divPorPorc(B36, Q45);
    const F40 = divPorPorc(F37, Q45);
    const F41 = F39 + F40;

    const F42 = F34 / F41;

    const B44 = (5.9 * R3) / 1000;
    const F45 = P16 * (1.0597 * Math.pow(W14, -0.2386));
    const F46 = B44 + F45;
    const F47 = divPorPorc(B44, R45);
    const F48 = divPorPorc(F45, R45);
    const F49 = F47 + F48;

    const B51 = (6.3 * R3) / 1000;
    const F52 = P16 * (1.977 * Math.pow(W14, -0.058));
    const F53 = B51 + F52;
    const F54 = divPorPorc(B51, S45);
    const F55 = divPorPorc(F52, S45);
    const F56 = F54 + F55;

    const B58 = (23.5 * R3) / 1000;
    const F59 = P16 * (0.3418 * Math.pow(W14, 0.32));
    const F60 = B58 + F59;
    const F61 = divPorPorc(B58, T45);
    const F62 = divPorPorc(F59, T45);
    const F63 = F61 + F62;

    const B65 = (10.4 * R3) / 1000;
    const F66 = P16 * (0.03 * Math.pow(W14, 0.89));
    const F67 = B65 + F66;
    const F68 = divPorPorc(B65, U45);
    const F69 = divPorPorc(F66, U45);
    const F70 = F68 + F69;

    const B72 = (95.6 * R3) / 1000;
    const F73 = P16 * (1.25 * Math.pow(W14, 0.33));
    const F74 = B72 + F73;
    const F75 = divPorPorc(B72, V45);
    const F76 = divPorPorc(F73, V45);
    const F77 = F75 + F76;

    const B79 = (13.5 * R3) / 1000;
    const F80 = P16 * (0.045 * Math.pow(W14, -0.023));
    const F81 = B79 + F80;
    const F82 = divPorPorc(B79, W45);
    const F83 = divPorPorc(F80, W45);
    const F84 = F82 + F83;

    const B86 = (2942 * R3) / 1000;
    const F87 = P16 * (10.4 * Math.pow(W14, 0.24));
    const F88 = B86 + F87;
    const F89 = divPorPorc(B86, X45);
    const F90 = divPorPorc(F87, X45);
    const F91 = F89 + F90;

    const B93 = (184.9 * R3) / 1000;
    const F94 = P16 * (0.07 * Math.pow(W14, 0.8));
    const F95 = B93 + F94;
    const F96 = divPorPorc(B93, Y45);
    const F97 = divPorPorc(F94, Y45);
    const F98 = F96 + F97;

    const B100 = (3.72 * R3) / 1000;
    const F101 = P16 * (1.07 * Math.pow(W14, -0.07));
    const F102 = B100 + F101;
    const F103 = divPorPorc(B100, Z45);
    const F104 = divPorPorc(F101, Z45);
    const F105 = F103 + F104;

    const B107 = (334.4 * R3) / 1000;
    const F108 = P16 * (1.16 * Math.pow(W14, 0.86));
    const F109 = B107 + F108;
    const F110 = B107 / (AA45 / 100);
    const F111 = F108 / (AA45 / 100);
    const F112 = F110 + F111;

    // ====== Bloque E mínimo para E114/E116/E118/E120/E122 ======
    // (recalculamos E-series necesarias para E27)
    const T14e = 0.7248 * Math.pow(Q14, 1.0314);
    const T18e = (T14e / T8) * T8;

    const E7 = 0.075 * Math.pow(T14e, 0.75);
    const E8 = 0.061 * Math.pow(T18e, 0.75) * Math.pow(P16, 1.035);
    const E10 = E7 / Q19; // Q19 ya calculado
    const T26e = 0.327 / (0.539 + T22); // T22 ya calculado
    const E11 = E8 / T26e;
    const E12 = E10 + E11;
    const E13 = ((E12 / E6) + (0.3032 / 0.9455)) * E6;
    const E14 = E13 / 4.4;
    const E16 = 3.6 * Math.pow(Q14, 0.75);
    const E17 = (176.01 * P16) - (0.381 * Math.pow(T18e, 0.75) * Math.pow(P16, 1.035));
    const E19 = divPorPorc(E17, Y40);
    const E21 = E16 + E19;

    // Serie V50..V150 (corriente = E21) -> E23
    const V50 = ((120 * E14) + (E21 - (120 * E14) * 0.64) / 0.8) / 1000;
    const V_lo = serieRec(50, 150, V50, E21);
    const W150 = (-53.07 + (304.9 * V_lo[150]) + (90.8 * E14) - (3.13 * Math.pow(E14, 2)));
    const E23 = W150;

    const E25 = (E21 - (E23 * 0.64)) / 0.8;
    const E27 = E23 + E25;

    const E114 = 0.5 * E6;
    const E116 = E6 * porc(25);
    const E118 = E6 * porc(5);
    const E120 = (E6 * porc(90)) - ((E27 / 1000) + E116 + E118);
    const E122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * E6);

    // === SOLO ESTAS CLAVES, EN ESTE ORDEN ===
    return {
        E6,
        F12, F10, F11, F14, F26,
        F16, F18, F19, F20, F21,
        F22, F23, F24, F25, F27,
        F34, F32, F33, F41, F39, F40, F42,
        F49, F47, F48, F56, F54, F55, F63, F61, F62,
        F70, F68, F69, F77, F75, F76, F84, F82, F83,
        F91, F89, F90, F98, F96, F97, F105, F103, F104,
        F112, F110, F111,
        E114, E116, E118, E120, E122
    };
}
