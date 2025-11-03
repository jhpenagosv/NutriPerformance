// src/models/fG.model.js
export function calcularFormulas(ctx) {
    // Utilidades
    const porc = (x) => x / 100;
    const divPorPorc = (valor, base) => valor / (base / 100);

    // Entradas base
    const { P3, Q3, T3, V3, W3 } = ctx;
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // Constantes (overrides opcionales desde ctx)
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

    // ----- Rama G (Z14/Z18; más rama para Z22 usando I8/X18/X14/R14) -----
    const Z14 = 0.6314 * Math.pow(Q14, 1.0602);
    const Z18 = (Z14 / T8) * T8;

    // Para T22 (vía C8) requiere V14/V18
    const V14d = 0.6241 * Math.pow(P14, 1.0608);
    const V18 = (V14d / T8) * T8;
    const C8 = 0.061 * Math.pow(V18, 0.75) * Math.pow(P16, 1.035);
    const T22 = 1.14 * Math.pow(C8 / P16, -1.137);
    const Q19 = (0.513 + (0.173 * T22) + (0.073 * P16)) * 1;

    // Cadena para Z22 = 1.14*(I8/P16)^-1.137 con I8 basado en X18 -> X14 -> R14
    const R14 = 0.9247 * Math.pow(R3, 1.0085);
    const X14 = 0.6586 * Math.pow(R14, 1.0499);
    const X18 = (X14 / T8) * T8;
    const I8 = 0.061 * Math.pow(X18, 0.75) * Math.pow(P16, 1.035);
    const Z22 = 1.14 * Math.pow(I8 / P16, -1.137);
    const Z26 = 0.327 / (0.539 + Z22);

    // E6 (insumo para G13/G14 y bloque E final)
    const E6 = (-0.6273 + (0.06453 * S3) + (3.871 * T3) - (0.614 * U3));

    // G7..G12
    const G7 = 0.075 * Math.pow(Z14, 0.75);
    const G8 = 0.061 * Math.pow(Z18, 0.75) * Math.pow(P16, 1.035);
    const G9 = G7 + G8;
    const G10 = G7 / Q19;
    const G11 = G8 / Z26;
    const G12 = G10 + G11;

    // G13/G14 (misma interpretación validada en E/F)
    const G13 = ((G12 / E6) + (0.3032 / 0.9455)) * E6;
    const G14 = G13 / 4.4;

    // G16..G21
    const G16 = 3.6 * Math.pow(Q14, 0.75);
    const G17 = (176.01 * P16) - (0.381 * Math.pow(Z18, 0.75) * Math.pow(P16, 1.035));
    const W40 = 84.665 - (0.1179 * Z18);
    const G18 = divPorPorc(G17, W40);
    const G19 = divPorPorc(G17, Y40);
    const G20 = G16 + G18;
    const G21 = G16 + G19;

    // ===== Series Z155..Z255 (corriente = G20) -> AA255 => G22
    const Z155 = ((120 * G14) + (G20 - (120 * G14) * 0.64) / 0.8) / 1000;
    function serieRec(desde, hasta, seed, corriente) {
        const out = {}; out[desde] = seed;
        for (let i = desde + 1; i <= hasta; i++) {
            const prev = out[i - 1];
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
        }
        return out;
    }
    const Z_hi = serieRec(155, 255, Z155, G20);
    const AA255 = (-53.07 + (304.9 * Z_hi[255]) + (90.8 * G14) - (3.13 * Math.pow(G14, 2)));
    const G22 = AA255;

    // ===== Series Z50..Z150 (corriente = G21) -> AA150 => G23
    const Z50 = ((120 * G14) + (G21 - (120 * G14) * 0.64) / 0.8) / 1000;
    const Z_lo = serieRec(50, 150, Z50, G21);
    const AA150 = (-53.07 + (304.9 * Z_lo[150]) + (90.8 * G14) - (3.13 * Math.pow(G14, 2)));
    const G23 = AA150;

    // G24..G27
    const G24 = (G20 - (G23 * 0.64)) / 0.8;
    const G25 = (G21 - (G23 * 0.64)) / 0.8;
    const G26 = G22 + G24;
    const G27 = G23 + G25;

    // ----- Bloque minerales versión G -----
    const B29 = (11.7 * R3) / 1000;
    const G30 = P16 * (66 * Math.pow(Z14, -0.32));
    const G31 = B29 + G30;
    const G32 = divPorPorc(B29, P45);
    const G33 = divPorPorc(G30, P45);
    const G34 = G32 + G33;

    const B36 = (13.5 * R3) / 1000;
    const G37 = P16 * (25.4 * Math.pow(Z14, -0.25));
    const G38 = B36 + G37;
    const G39 = divPorPorc(B36, Q45);
    const G40 = divPorPorc(G37, Q45);
    const G41 = G39 + G40;

    const G42 = G34 / G41;

    const B44 = (5.9 * R3) / 1000;
    const G45 = P16 * (1.0597 * Math.pow(Z14, -0.2386));
    const G46 = B44 + G45;
    const G47 = divPorPorc(B44, R45);
    const G48 = divPorPorc(G45, R45);
    const G49 = G47 + G48;

    const B51 = (6.3 * R3) / 1000;
    const G52 = P16 * (1.977 * Math.pow(Z14, -0.058));
    const G53 = B51 + G52;
    const G54 = divPorPorc(B51, S45);
    const G55 = divPorPorc(G52, S45);
    const G56 = G54 + G55;

    const B58 = (23.5 * R3) / 1000;
    const G59 = P16 * (0.3418 * Math.pow(Z14, 0.32));
    const G60 = B58 + G59;
    const G61 = divPorPorc(B58, T45);
    const G62 = divPorPorc(G59, T45);
    const G63 = G61 + G62;

    const B65 = (10.4 * R3) / 1000;
    const G66 = P16 * (0.03 * Math.pow(Z14, 0.89));
    const G67 = B65 + G66;
    const G68 = divPorPorc(B65, U45);
    const G69 = divPorPorc(G66, U45);
    const G70 = G68 + G69;

    const B72 = (95.6 * R3) / 1000;
    const G73 = P16 * (1.25 * Math.pow(Z14, 0.33));
    const G74 = B72 + G73;
    const G75 = divPorPorc(B72, V45);
    const G76 = divPorPorc(G73, V45);
    const G77 = G75 + G76;

    const B79 = (13.5 * R3) / 1000;
    const G80 = P16 * (0.045 * Math.pow(Z14, -0.023));
    const G81 = B79 + G80;
    const G82 = divPorPorc(B79, W45);
    const G83 = divPorPorc(G80, W45);
    const G84 = G82 + G83;

    const B86 = (2942 * R3) / 1000;
    const G87 = P16 * (10.4 * Math.pow(Z14, 0.24));
    const G88 = B86 + G87;
    const G89 = divPorPorc(B86, X45);
    const G90 = divPorPorc(G87, X45);
    const G91 = G89 + G90;

    const B93 = (184.9 * R3) / 1000;
    const G94 = P16 * (0.07 * Math.pow(Z14, 0.8));
    const G95 = B93 + G94;
    const G96 = divPorPorc(B93, Y45);
    const G97 = divPorPorc(G94, Y45);
    const G98 = G96 + G97;

    const B100 = (3.72 * R3) / 1000;
    const G101 = P16 * (1.07 * Math.pow(Z14, -0.07));
    const G102 = B100 + G101;
    const G103 = divPorPorc(B100, Z45);
    const G104 = divPorPorc(G101, Z45);
    const G105 = G103 + G104;

    const B107 = (334.4 * R3) / 1000;
    const G108 = P16 * (1.16 * Math.pow(Z14, 0.86));
    const G109 = B107 + G108;
    const G110 = B107 / (AA45 / 100);
    const G111 = G108 / (AA45 / 100);
    const G112 = G110 + G111;

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

    // === Retorno SOLO estas claves, en orden análogo al de E/F ===
    return {
        E6,
        G12, G10, G11, G14, G26,
        G16, G18, G19, G20, G21,
        G22, G23, G24, G25, G27,
        G34, G32, G33, G41, G39, G40, G42,
        G49, G47, G48, G56, G54, G55, G63, G61, G62,
        G70, G68, G69, G77, G75, G76, G84, G82, G83,
        G91, G89, G90, G98, G96, G97, G105, G103, G104,
        G112, G110, G111,
        E114, E116, E118, E120, E122
    };
}
