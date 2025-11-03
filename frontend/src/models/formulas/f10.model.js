// src/models/fH.model.js
export function calcularFormulas(ctx) {
    // ==== Utilidades ====
    const porc = (x) => x / 100;
    const divPorPorc = (valor, base) => valor / (base / 100);

    // ==== Entradas base ====
    const { P3, Q3, T3, V3, W3 } = ctx;
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // ==== Constantes (overrides opcionales via ctx) ====
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

    // ==== Bases comunes ====
    const R3 = (P3 + Q3) / 2;     // AVERAGE(P3:Q3)
    const S3 = Math.pow(R3, 0.75); // (R3^0.75)
    const U3 = T3 * T3;            // (T3*T3)

    // Derivados base
    const P16 = 0.963 * Math.pow(T3, 1.0151);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);

    // ==== Rama H (U14/U18; R14) ====
    const R14 = 0.9247 * Math.pow(R3, 1.0085);
    const U14 = 0.7248 * Math.pow(R14, 1.0314);
    const U18 = (U14 / T8) * T8;

    // Para U22 (vía D8) requiere Y14/Y18 basados en P14
    const Y14 = 0.611 * Math.pow(P14, 1.0667);
    const Y18 = (Y14 / T8) * T8;
    const D8 = 0.061 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035);
    const U22 = 1.14 * Math.pow(D8 / P16, -1.137);
    const U26 = 0.327 / (0.539 + U22);

    // Para R19 también requiere U22 y P16 (nota: 0.01*P16)
    const R19 = (0.513 + (0.173 * U22) + (0.01 * P16)) * 1;

    // H6 (Ecuación base)
    const H6 = (-2.8836 + (0.08435 * S3) + (4.5145 * T3) - (0.9631 * U3));

    // H7..H12
    const H7 = 0.075 * Math.pow(U14, 0.75);
    const H8 = 0.061 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035);
    const H9 = H7 + H8;
    const H10 = H7 / R19;
    const H11 = H8 / U26;
    const H12 = H10 + H11;

    // H13/H14 (mismo patrón que E/F/G)
    const H13 = ((H12 / H6) + (0.3032 / 0.9455)) * H6;
    const H14 = H13 / 4.4;

    // H16..H21   (ojo: H16 usa R14^0.75)
    const H16 = 3.6 * Math.pow(R14, 0.75);
    const H17 = (176.01 * P16) - (0.381 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035));
    const R40 = 84.665 - (0.1179 * U18);
    const H18 = divPorPorc(H17, R40);
    const H19 = divPorPorc(H17, Y40);
    const H20 = H16 + H18;
    const H21 = H16 + H19;

    // ==== Series para AC255 (corriente = H20) -> H22 ====
    const H155 = ((120 * H14) + (H20 - (120 * H14) * 0.64) / 0.8) / 1000;
    function serieRec(desde, hasta, seed, corriente) {
        const out = {}; out[desde] = seed;
        for (let i = desde + 1; i <= hasta; i++) {
            const prev = out[i - 1];
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
        }
        return out;
    }
    const H_hi = serieRec(155, 255, H155, H20);
    const AC255 = (-53.07 + (304.9 * H_hi[255]) + (90.8 * H14) - (3.13 * Math.pow(H14, 2)));
    const H22 = AC255;

    // ==== Series para AC150 (corriente = H21) -> H23 ====
    const H50 = ((120 * H14) + (H21 - (120 * H14) * 0.64) / 0.8) / 1000;
    const H_lo = serieRec(50, 150, H50, H21);
    const AC150 = (-53.07 + (304.9 * H_lo[150]) + (90.8 * H14) - (3.13 * Math.pow(H14, 2)));
    const H23 = AC150;

    // H24..H27
    const H24 = (H20 - (H23 * 0.64)) / 0.8;
    const H25 = (H21 - (H23 * 0.64)) / 0.8;
    const H26 = H22 + H24;
    const H27 = H23 + H25;

    // ===== Bloque "minerales" versión H =====
    const B29 = (11.7 * R3) / 1000;
    const H30 = P16 * (66 * Math.pow(U14, -0.32));
    const H31 = B29 + H30;
    const H32 = divPorPorc(B29, P45);
    const H33 = divPorPorc(H30, P45);
    const H34 = H32 + H33;

    const B36 = (13.5 * R3) / 1000;
    const H37 = P16 * (25.4 * Math.pow(U14, -0.25));
    const H38 = B36 + H37;
    const H39 = divPorPorc(B36, Q45);
    const H40 = divPorPorc(H37, Q45);
    const H41 = H39 + H40;

    const H42 = H34 / H41;

    const B44 = (5.9 * R3) / 1000;
    const H45 = P16 * (1.0597 * Math.pow(U14, -0.2386));
    const H46 = B44 + H45;
    const H47 = divPorPorc(B44, R45);
    const H48 = divPorPorc(H45, R45);
    const H49 = H47 + H48;

    const B51 = (6.3 * R3) / 1000;
    const H52 = P16 * (1.977 * Math.pow(U14, -0.058));
    const H53 = B51 + H52;
    const H54 = divPorPorc(B51, S45);
    const H55 = divPorPorc(H52, S45);
    const H56 = H54 + H55;

    const B58 = (23.5 * R3) / 1000;
    const H59 = P16 * (0.3418 * Math.pow(U14, 0.32));
    const H60 = B58 + H59;
    const H61 = divPorPorc(B58, T45);
    const H62 = divPorPorc(H59, T45);
    const H63 = H61 + H62;

    const B65 = (10.4 * R3) / 1000;
    const H66 = P16 * (0.03 * Math.pow(U14, 0.89));
    const H67 = B65 + H66;
    const H68 = divPorPorc(B65, U45);
    const H69 = divPorPorc(H66, U45);
    const H70 = H68 + H69;

    const B72 = (95.6 * R3) / 1000;
    const H73 = P16 * (1.25 * Math.pow(U14, 0.33));
    const H74 = B72 + H73;
    const H75 = divPorPorc(B72, V45);
    const H76 = divPorPorc(H73, V45);
    const H77 = H75 + H76;

    const B79 = (13.5 * R3) / 1000;
    const H80 = P16 * (0.045 * Math.pow(U14, -0.023));
    const H81 = B79 + H80;
    const H82 = divPorPorc(B79, W45);
    const H83 = divPorPorc(H80, W45);
    const H84 = H82 + H83;

    const B86 = (2942 * R3) / 1000;
    const H87 = P16 * (10.4 * Math.pow(U14, 0.24));
    const H88 = B86 + H87;
    const H89 = divPorPorc(B86, X45);
    const H90 = divPorPorc(H87, X45);
    const H91 = H89 + H90;

    const B93 = (184.9 * R3) / 1000;
    const H94 = P16 * (0.07 * Math.pow(U14, 0.8));
    const H95 = B93 + H94;
    const H96 = divPorPorc(B93, Y45);
    const H97 = divPorPorc(H94, Y45);
    const H98 = H96 + H97;

    const B100 = (3.72 * R3) / 1000;
    const H101 = P16 * (1.07 * Math.pow(U14, -0.07));
    const H102 = B100 + H101;
    const H103 = divPorPorc(B100, Z45);
    const H104 = divPorPorc(H101, Z45);
    const H105 = H103 + H104;

    const B107 = (334.4 * R3) / 1000;
    const H108 = P16 * (1.16 * Math.pow(U14, 0.86));
    const H109 = B107 + H108;
    const H110 = B107 / (AA45 / 100);
    const H111 = H108 / (AA45 / 100);
    const H112 = H110 + H111;

    // ==== Bloque final H114..H122 ====
    const H114 = 0.5 * H6;
    const H116 = H6 * porc(25);
    const H118 = H6 * porc(5);
    const H120 = (H6 * porc(90)) - ((H27 / 1000) + H116 + H118);
    const H122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * H6);

    // ==== Retorno SOLO estas claves (mismo orden patrón) ====
    return {
        H6,
        H12, H10, H11, H14, H26,
        H16, H18, H19, H20, H21,
        H22, H23, H24, H25, H27,
        H34, H32, H33, H41, H39, H40, H42,
        H49, H47, H48, H56, H54, H55, H63, H61, H62,
        H70, H68, H69, H77, H75, H76, H84, H82, H83,
        H91, H89, H90, H98, H96, H97, H105, H103, H104,
        H112, H110, H111,
        H114, H116, H118, H120, H122
    };
}
