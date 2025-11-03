
// f3.compat.model.js — FIX: define C42 and map C32: C32v in return
export function calcularFormulas(ctx) {
    const byPercent = (x, p) => Number(x) * (Number(p) / 100);
    const divideByPercent = (x, p) => Number(x) / (Number(p) / 100);
    const num = (v) => (typeof v === "string" ? Number(v.replace(",", ".")) : Number(v));

    // Entradas base obligatorias
    const { P3, Q3, T3, V3, W3 } = ctx || {};
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(num(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // Porcentajes / constantes (defaults; puedes override en ctx)
    const Y40 = ctx.Y40 !== undefined ? num(ctx.Y40) : 47.4;
    const P45 = ctx.P45 !== undefined ? num(ctx.P45) : 56.8;

    const Q45 = ctx.Q45 !== undefined ? num(ctx.Q45) : 67.8;
    const R45 = ctx.R45 !== undefined ? num(ctx.R45) : 35.5;
    const S45 = ctx.S45 !== undefined ? num(ctx.S45) : 37.1;
    const T45 = ctx.T45 !== undefined ? num(ctx.T45) : 48.4;
    const U45 = ctx.U45 !== undefined ? num(ctx.U45) : 77.3;
    const V45 = ctx.V45 !== undefined ? num(ctx.V45) : 73.5;
    const W45 = ctx.W45 !== undefined ? num(ctx.W45) : 86.8;
    const X45 = ctx.X45 !== undefined ? num(ctx.X45) : 73.4;
    const Y45 = ctx.Y45 !== undefined ? num(ctx.Y45) : 43.9;
    const Z45 = ctx.Z45 !== undefined ? num(ctx.Z45) : 48.7;
    const AA45 = ctx.AA45 !== undefined ? num(ctx.AA45) : 66.8;

    const T8 = ctx.T8 !== undefined ? num(ctx.T8) : 517;

    // === Derivadas base ===
    const P3n = num(P3), Q3n = num(Q3), T3n = num(T3), V3n = num(V3), W3n = num(W3);

    const R3 = (P3n + Q3n) / 2;         // AVERAGE(P3:Q3)
    const U3 = T3n * T3n;               // T3*T3
    const S3 = Math.pow(R3, 0.75);      // R3^0,75

    const P16 = 0.963 * Math.pow(T3n, 1.0151);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);
    const Q14 = 0.8915 * Math.pow(R3, 1.0151);
    const B16 = 3.6 * Math.pow(P14, 0.75);
    const C16 = 3.6 * Math.pow(P14, 0.75);

    const S14 = 0.8126 * Math.pow(P14, 1.0134);
    const S18 = (S14 / T8) * T8;        // (S14/517)*517

    // Derivados V14/T14 y sus "snap"
    const V14 = 0.6241 * Math.pow(P14, 1.0608);
    const T14 = 0.7248 * Math.pow(Q14, 1.0314);
    const V18 = (V14 / T8) * T8;
    const T18 = (T14 / T8) * T8;

    const P40 = 84.665 - (0.1179 * S18);
    const S40 = 84.665 - (0.1179 * V18);

    // Lineales por R3 (B*)
    const B58 = (23.5 * R3) / 1000;
    const B29 = (11.7 * R3) / 1000;
    const B44 = (5.9 * R3) / 1000;
    const B65 = (10.4 * R3) / 1000;
    const B72 = (95.6 * R3) / 1000;
    const B79 = (13.5 * R3) / 1000;
    const B100 = (3.72 * R3) / 1000;
    const B93 = (184.9 * R3) / 1000;
    const B86 = (2942 * R3) / 1000;
    const B107 = (334.4 * R3) / 1000;
    const B51 = (6.3 * R3) / 1000;
    const B36 = (13.5 * R3) / 1000;

    // B32 etc
    const B32 = divideByPercent(B29, P45);

    const B6 = -2.1948 + (0.08388 * S3) + (3.9328 * T3n) - (0.903 * U3);

    const B122 = 9.445 + (0.19 * S3) + (0.271 * V3n) - (0.259 * W3n) + (0.489 * B6);
    const B114 = 0.5 * B6;
    const B118 = byPercent(B6, 5);
    const B116 = byPercent(B6, 25);

    // Potencias con S14/P16 (B*)
    const B7 = 0.075 * Math.pow(S14, 0.75);
    const B59 = P16 * (0.9463 * Math.pow(S14, 0.1216));
    const B37 = P16 * (38.6 * Math.pow(S14, -0.36));
    const B30 = P16 * (147 * Math.pow(S14, -0.5));
    const B52 = P16 * (5.594 * Math.pow(S14, -0.2998));
    const B101 = P16 * (1.07 * Math.pow(S14, -0.07));
    const B45 = P16 * (0.3466 * Math.pow(S14, 0.0113));
    const B108 = P16 * (1.16 * Math.pow(S14, 0.86));
    const B66 = P16 * (0.03 * Math.pow(S14, 0.89));
    const B94 = P16 * (0.07 * Math.pow(S14, 0.8));
    const B80 = P16 * (0.045 * Math.pow(S14, -0.023));
    const B87 = P16 * (10.4 * Math.pow(S14, 0.24));
    const B73 = P16 * (1.25 * Math.pow(S14, 0.33));

    // Relaciones por porcentaje (B*)
    const B103 = divideByPercent(B100, Z45);
    const B61 = divideByPercent(B58, T45);
    const B68 = divideByPercent(B65, U45);
    const B89 = divideByPercent(B86, X45);
    const B54 = divideByPercent(B51, S45);

    const B47 = divideByPercent(B44, R45);
    const B96 = divideByPercent(B93, Y45);
    const B82 = divideByPercent(B79, W45);
    const B110 = divideByPercent(B107, AA45);
    const B75 = divideByPercent(B72, V45);
    const B39 = divideByPercent(B36, Q45);

    // Sumas B*
    const B88 = B86 + B87;
    const B90 = divideByPercent(B87, X45);
    const B74 = B72 + B73;
    const B76 = divideByPercent(B73, V45);
    const B62 = divideByPercent(B59, T45);
    const B60 = B58 + B59;
    const B38 = B36 + B37;
    const B40 = divideByPercent(B37, Q45);
    const B33 = divideByPercent(B30, P45);
    const B31 = B29 + B30;

    // B* dinámicos con S18
    const B8 = 0.061 * Math.pow(S18, 0.75) * Math.pow(P16, 1.035);
    const B17 = (176.01 * P16) - (0.381 * Math.pow(S18, 0.75) * Math.pow(P16, 1.035));

    // Más B*
    const B53 = B51 + B52;
    const B55 = divideByPercent(B52, S45);
    const B104 = divideByPercent(B101, Z45);
    const B102 = B100 + B101;
    const B48 = divideByPercent(B45, R45);
    const B46 = B44 + B45;
    const B109 = B107 + B108;
    const B111 = divideByPercent(B108, AA45);
    const B69 = divideByPercent(B66, U45);
    const B67 = B65 + B66;
    const B97 = divideByPercent(B94, Y45);
    const B95 = B93 + B94;
    const B81 = B79 + B80;
    const B83 = divideByPercent(B80, W45);

    const B91 = B89 + B90;
    const B77 = B75 + B76;
    const B63 = B61 + B62;
    const B41 = B39 + B40;
    const B34 = B32 + B33;

    const B19 = divideByPercent(B17, Y40);
    const B18 = divideByPercent(B17, P40);

    const S22 = 1.14 * Math.pow((B8 / P16), -1.137);
    const B9 = B7 + B8;
    const B56 = B54 + B55;
    const B105 = B103 + B104;
    const B49 = B47 + B48;
    const B112 = B110 + B111;
    const B70 = B68 + B69;
    const B98 = B96 + B97;
    const B84 = B82 + B83;

    const B42 = B34 / B41;
    const B21 = B16 + B19;
    const B20 = B16 + B18;

    const S26 = 0.327 / (0.539 + S22);
    const P19v = (0.513 + (0.173 * S22) + (0.1 * P16)) * 1;

    const B11 = B8 / S26;
    const B10x = B7 / P19v;
    const B12 = B10x + B11;
    const B13 = ((B12 / B6) + (0.3032 / 0.9455)) * B6;
    const B14 = B13 / 4.4;

    // === C* formulas ===

    // C divisiones por porcentaje
    const C103 = divideByPercent(B100, Z45);
    const C89 = divideByPercent(B86, X45);
    const C96 = divideByPercent(B93, Y45);
    const C54 = divideByPercent(B51, S45);
    const C39 = divideByPercent(B36, Q45);
    const C75 = divideByPercent(B72, V45);
    const C61 = divideByPercent(B58, T45);
    const C82 = divideByPercent(B79, W45);
    const C47 = divideByPercent(B44, R45);
    const C110 = divideByPercent(B107, AA45);
    const C68 = divideByPercent(B65, U45);

    // C dinámicos con V14 (y P16)
    const C87 = P16 * (10.4 * Math.pow(V14, 0.24));
    const C52 = P16 * (5.594 * Math.pow(V14, -0.2998));
    const C45 = P16 * (0.3466 * Math.pow(V14, 0.0113));
    const C73 = P16 * (1.25 * Math.pow(V14, 0.33));
    const C101 = P16 * (1.07 * Math.pow(V14, -0.07));
    const C7 = 0.075 * Math.pow(V14, 0.75);
    const C66 = P16 * (0.03 * Math.pow(V14, 0.89));
    const C108 = P16 * (1.16 * Math.pow(V14, 0.86));
    const C94 = P16 * (0.07 * Math.pow(V14, 0.8));
    const C30 = P16 * (147 * Math.pow(V14, -0.5));
    const C80 = P16 * (0.045 * Math.pow(V14, -0.023));
    const C37 = P16 * (38.6 * Math.pow(V14, -0.36));
    const C59 = P16 * (0.9463 * Math.pow(V14, 0.1216));

    // C dinamicos con V18/T18
    const C8 = 0.061 * Math.pow(V18, 0.75) * Math.pow(P16, 1.035);
    const E8 = 0.061 * Math.pow(T18, 0.75) * Math.pow(P16, 1.035);
    const C17 = (176.01 * P16) - (0.381 * Math.pow(V18, 0.75) * Math.pow(P16, 1.035));

    // C sumas y divisiones
    const C90 = divideByPercent(C87, X45);
    const C88 = B86 + C87;
    const C53 = B51 + C52;
    const C55 = divideByPercent(C52, S45);
    const C46 = B44 + C45;
    const C48 = divideByPercent(C45, R45);
    const C76 = divideByPercent(C73, V45);
    const C74 = B72 + C73;
    const C104 = divideByPercent(C101, Z45);
    const C102 = B100 + C101;
    const C69 = divideByPercent(C66, U45);
    const C67 = B65 + C66;
    const C111 = divideByPercent(C108, AA45);
    const C109 = B107 + C108;
    const C97 = divideByPercent(C94, Y45);
    const C95 = B93 + C94;
    const C31 = B29 + C30;
    const C33 = divideByPercent(C30, P45);
    const C83 = divideByPercent(C80, W45);
    const C81 = B79 + C80;
    const C40 = divideByPercent(C37, Q45);
    const C38 = B36 + C37;
    const C60 = B58 + C59;
    const C62 = divideByPercent(C59, T45);

    // Sumas de bloque C
    const C91 = C89 + C90;
    const C56 = C54 + C55;
    const C49 = C47 + C48;
    const C9 = C7 + C8;
    const C19 = divideByPercent(C17, Y40);
    const C18 = divideByPercent(C17, S40);
    const C77 = C75 + C76;
    const C105 = C103 + C104;
    const C70 = C68 + C69;
    const C112 = C110 + C111;
    const C98 = C96 + C97;
    const C32v = divideByPercent(B29, P45); // C32 = (B29/P45%)
    const C34 = C32v + C33;
    const C84 = C82 + C83;
    const C41 = C39 + C40;
    const C63 = C61 + C62;
    const C42 = C34 / C41;

    // S22/V22, P19, S26/V26
    const V22 = 1.14 * Math.pow((E8 / P16), -1.137);
    const P19v2 = (0.513 + (0.173 * S22) + (0.1 * P16)) * 1;
    const V26 = 0.327 / (0.539 + V22);

    // B/C 10..14 y 12 sumas
    const C10 = C7 / P19v2;
    const C11 = C8 / V26;
    const C12 = C10 + C11;
    const C13 = ((C12 / B6) + (0.3032 / 0.9455)) * B6;
    const C14 = C13 / 4.4;

    // ==== Cadenas iterativas ====
    const nextP = (prev, total) => (prev + ((total - (prev * 0.64)) / 0.8)) / 1000;

    // P50..P150 con B21
    const seq = {};
    seq.P50 = ((120 * B14) + ((B21 - (120 * B14) * 0.64) / 0.8)) / 1000;
    for (let i = 51; i <= 150; i++) {
        seq[`P${i}`] = nextP(seq[`P${i - 1}`], B21);
    }
    const P150 = seq.P150;
    const Q150 = -53.07 + (304.9 * P150) + (90.8 * B14) - (3.13 * Math.pow(B14, 2));

    // R50..R150 con C21
    const C21 = C16 + C19;
    seq.R50 = ((120 * C14) + ((C21 - (120 * C14) * 0.64) / 0.8)) / 1000;
    for (let i = 51; i <= 150; i++) {
        const prevKey = i === 51 ? 'R50' : `R${i - 1}`;
        const denomPrev = i === 51 ? seq.P50 : seq[`P${i - 1}`]; // literal a tus fórmulas
        seq[`R${i}`] = (seq[prevKey] + ((C21 - (denomPrev * 0.64)) / 0.8)) / 1000;
    }
    const R150 = seq.R150;
    const S150 = -53.07 + (304.9 * R150) + (90.8 * C14) - (3.13 * Math.pow(C14, 2));

    // R155..R255 con C20
    const C20 = C16 + C18;
    seq.R155 = ((120 * C14) + ((C20 - (120 * C14) * 0.64) / 0.8)) / 1000;
    for (let i = 156; i <= 255; i++) {
        const prevKey = i === 156 ? 'R155' : `R${i - 1}`;
        seq[`R${i}`] = (seq[prevKey] + ((C20 - (seq[prevKey] * 0.64)) / 0.8)) / 1000;
    }
    const R255 = seq.R255;
    const S255 = -53.07 + (304.9 * R255) + (90.8 * C14) - (3.13 * Math.pow(C14, 2));

    // B* dependientes de Q150 y demás
    const B23 = Q150;
    const C22 = S255;
    const C23 = S150;
    const B25 = (B21 - (B23 * 0.64)) / 0.8;
    const C24 = (C20 - (C23 * 0.64)) / 0.8;
    const C25 = (C21 - (C23 * 0.64)) / 0.8;
    const B27 = B23 + B25;
    const C26 = C22 + C24;
    const C27 = C23 + C25;

    const B120 = (byPercent(B6, 90)) - ((B27 / 1000) + B116 + B118);

    // === Salida (solo lo solicitado) ===
    return {
        B6,
        C12, C10, C11, C14, C26, C16, C18, C19, C20, C21, C22, C23, C24, C25, C27,
        C34, C32: C32v, C33, C41, C39, C40, C42, C49, C47, C48, C56, C54, C55,
        C63, C61, C62, C70, C68, C69, C77, C75, C76, C84, C82, C83, C91, C89, C90,
        C98, C96, C97, C105, C103, C104, C112, C110, C111,
        B114, B116, B118, B120, B122
    };
}

const _default = { calcularFormulas };
export default _default;
if (typeof module !== "undefined" && module.exports) {
    module.exports = _default;
}