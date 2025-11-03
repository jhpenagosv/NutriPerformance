// src/models/fI.model.js
export function calcularFormulas(ctx) {
    // ==== Utils ====
    const porc = (x) => x / 100;
    const divPorPorc = (valor, basePct) => valor / (basePct / 100);

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
    const S3 = Math.pow(R3, 0.75);
    const U3 = T3 * T3;
    const P16 = 0.963 * Math.pow(T3, 1.0151);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);
    const Q14 = 0.8915 * Math.pow(R3, 1.0151); // usado por Z14 (rama I)

    // ==== Rama I (X14/X18; R14) ====
    const R14 = 0.9247 * Math.pow(R3, 1.0085);
    const X14 = 0.6586 * Math.pow(R14, 1.0499);
    const X18 = (X14 / T8) * T8;

    // Para U22 (vía D8) requiere Y14/Y18 basados en P14
    const Y14 = 0.611 * Math.pow(P14, 1.0667);
    const Y18 = (Y14 / T8) * T8;
    const D8 = 0.061 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035);
    const U22 = 1.14 * Math.pow(D8 / P16, -1.137);

    // Para X22 (vía G8) requiere Z14/Z18 basados en Q14
    const Z14 = 0.6314 * Math.pow(Q14, 1.0602);
    const Z18 = (Z14 / T8) * T8;
    const G8 = 0.061 * Math.pow(Z18, 0.75) * Math.pow(P16, 1.035);
    const X22 = 1.14 * Math.pow(G8 / P16, -1.137);

    const X26 = 0.327 / (0.539 + X22);
    const R19 = (0.513 + (0.173 * U22) + (0.01 * P16)) * 1;

    // H6 (usado en normalización de I13 y bloque H final)
    const H6 = (-2.8836 + (0.08435 * S3) + (4.5145 * T3) - (0.9631 * U3));

    // ==== I7..I14 ====
    const I7 = 0.075 * Math.pow(X14, 0.75);
    const I8 = 0.061 * Math.pow(X18, 0.75) * Math.pow(P16, 1.035);
    const I9 = I7 + I8;
    const I10 = I7 / R19;
    const I11 = I8 / X26;
    const I12 = I10 + I11;

    const I13 = ((I12 / H6) + (0.3032 / 0.9455)) * H6;
    const I14 = I13 / 4.4;

    // ==== I16..I21 ====
    const I16 = 3.6 * Math.pow(R14, 0.75);
    const I17 = (176.01 * P16) - (0.381 * Math.pow(X18, 0.75) * Math.pow(P16, 1.035));
    const U40 = 84.665 - (0.1179 * X18);
    const I18 = divPorPorc(I17, U40);
    const I19 = divPorPorc(I17, Y40);
    const I20 = I16 + I18;
    const I21 = I16 + I19;

    // ==== Series AE255 / AE150 (como en E/F/G/H) ====
    const I155 = ((120 * I14) + (I20 - (120 * I14) * 0.64) / 0.8) / 1000;
    const I50 = ((120 * I14) + (I21 - (120 * I14) * 0.64) / 0.8) / 1000;

    function serieRec(seedIndex, endIndex, seedValue, corriente) {
        const out = {}; out[seedIndex] = seedValue;
        for (let i = seedIndex + 1; i <= endIndex; i++) {
            const prev = out[i - 1];
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
        }
        return out[endIndex];
    }

    const X255_val = serieRec(155, 255, I155, I20);
    const AE255 = -53.07 + (304.9 * X255_val) + (90.8 * I14) - (3.13 * Math.pow(I14, 2));
    const I22 = AE255;

    const X150_val = serieRec(50, 150, I50, I21);
    const AE150 = -53.07 + (304.9 * X150_val) + (90.8 * I14) - (3.13 * Math.pow(I14, 2));
    const I23 = AE150;

    const I24 = (I20 - (I23 * 0.64)) / 0.8;
    const I25 = (I21 - (I23 * 0.64)) / 0.8;
    const I26 = I22 + I24;
    const I27 = I23 + I25;

    // ===== Bloque "minerales" versión I =====
    const B29 = (11.7 * R3) / 1000;
    const I30 = P16 * (66 * Math.pow(X14, -0.32));
    const I31 = B29 + I30;
    const I32 = divPorPorc(B29, P45);
    const I33 = divPorPorc(I30, P45);
    const I34 = I32 + I33;

    const B36 = (13.5 * R3) / 1000;
    const I37 = P16 * (25.4 * Math.pow(X14, -0.25));
    const I38 = B36 + I37;
    const I39 = divPorPorc(B36, Q45);
    const I40 = divPorPorc(I37, Q45);
    const I41 = I39 + I40;

    const I42 = I34 / I41;

    const B44 = (5.9 * R3) / 1000;
    const I45 = P16 * (1.0597 * Math.pow(X14, -0.2386));
    const I46 = B44 + I45;
    const I47 = divPorPorc(B44, R45);
    const I48 = divPorPorc(I45, R45);
    const I49 = I47 + I48;

    const B51 = (6.3 * R3) / 1000;
    const I52 = P16 * (1.977 * Math.pow(X14, -0.058));
    const I53 = B51 + I52;
    const I54 = divPorPorc(B51, S45);
    const I55 = divPorPorc(I52, S45);
    const I56 = I54 + I55;

    const B58 = (23.5 * R3) / 1000;
    const I59 = P16 * (0.3418 * Math.pow(X14, 0.32));
    const I60 = B58 + I59;
    const I61 = divPorPorc(B58, T45);
    const I62 = divPorPorc(I59, T45);
    const I63 = I61 + I62;

    const B65 = (10.4 * R3) / 1000;
    const I66 = P16 * (0.03 * Math.pow(X14, 0.89));
    const I67 = B65 + I66;
    const I68 = divPorPorc(B65, U45);
    const I69 = divPorPorc(I66, U45);
    const I70 = I68 + I69;

    const B72 = (95.6 * R3) / 1000;
    const I73 = P16 * (1.25 * Math.pow(X14, 0.33));
    const I74 = B72 + I73;
    const I75 = divPorPorc(B72, V45);
    const I76 = divPorPorc(I73, V45);
    const I77 = I75 + I76;

    const B79 = (13.5 * R3) / 1000;
    const I80 = P16 * (0.045 * Math.pow(X14, -0.023));
    const I81 = B79 + I80;
    const I82 = divPorPorc(B79, W45);
    const I83 = divPorPorc(I80, W45);
    const I84 = I82 + I83;

    const B86 = (2942 * R3) / 1000;
    const I87 = P16 * (10.4 * Math.pow(X14, 0.24));
    const I88 = B86 + I87;
    const I89 = divPorPorc(B86, X45);
    const I90 = divPorPorc(I87, X45);
    const I91 = I89 + I90;

    const B93 = (184.9 * R3) / 1000;
    const I94 = P16 * (0.07 * Math.pow(X14, 0.8));
    const I95 = B93 + I94;
    const I96 = divPorPorc(B93, Y45);
    const I97 = divPorPorc(I94, Y45);
    const I98 = I96 + I97;

    const B100 = (3.72 * R3) / 1000;
    const I101 = P16 * (1.07 * Math.pow(X14, -0.07));
    const I102 = B100 + I101;
    const I103 = divPorPorc(B100, Z45);
    const I104 = divPorPorc(I101, Z45);
    const I105 = I103 + I104;

    const B107 = (334.4 * R3) / 1000;
    const I108 = P16 * (1.16 * Math.pow(X14, 0.86));
    const I109 = B107 + I108;
    const I110 = B107 / (AA45 / 100);
    const I111 = I108 / (AA45 / 100);
    const I112 = I110 + I111;

    // ==== Bloque H final (solicitado en tu fórmula) ====
    // Para H14 necesitamos H12 (via H7/H8), reutilizando U14/U18 (de R14) y R19/U22 (ya calculados).
    const U14 = 0.7248 * Math.pow(R14, 1.0314);
    const U18 = (U14 / T8) * T8;

    const H7 = 0.075 * Math.pow(U14, 0.75);
    const H8 = 0.061 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035);
    const H10 = H7 / R19;
    const U26 = 0.327 / (0.539 + U22);
    const H11 = H8 / U26;
    const H12 = H10 + H11;
    const H13 = ((H12 / H6) + (0.3032 / 0.9455)) * H6;
    const H14 = H13 / 4.4;

    const H16 = 3.6 * Math.pow(R14, 0.75);
    const H17 = (176.01 * P16) - (0.381 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035));
    const H19 = divPorPorc(H17, Y40);
    const H21 = H16 + H19;

    // AC150 (serie con corriente = H21)
    const H50 = ((120 * H14) + (H21 - (120 * H14) * 0.64) / 0.8) / 1000;
    const H150_val = serieRec(50, 150, H50, H21);
    const AC150 = -53.07 + (304.9 * H150_val) + (90.8 * H14) - (3.13 * Math.pow(H14, 2));
    const H23 = AC150;
    const H25 = (H21 - (H23 * 0.64)) / 0.8;
    const H27 = H23 + H25;

    const H114 = 0.5 * H6;
    const H116 = H6 * porc(25);
    const H118 = H6 * porc(5);
    const H120 = (H6 * porc(90)) - ((H27 / 1000) + H116 + H118);
    const H122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * H6);

    // ==== Retorno (patrón de siempre + bloque H final) ====
    return {
        H6,
        I12, I10, I11, I14, I26,
        I16, I18, I19, I20, I21,
        I22, I23, I24, I25, I27,
        I34, I32, I33, I41, I39, I40, I42,
        I49, I47, I48, I56, I54, I55, I63, I61, I62,
        I70, I68, I69, I77, I75, I76, I84, I82, I83,
        I91, I89, I90, I98, I96, I97, I105, I103, I104,
        I112, I110, I111,
        H114, H116, H118, H120, H122
    };
}