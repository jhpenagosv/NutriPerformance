export function calcularFormulas(ctx) {
  const pow = (x, y) => Math.pow(Number(x), Number(y));
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
  const S3 = pow(R3, 0.75);           // R3^0,75

  const P16 = 0.963 * pow(T3n, 1.0151);
  const P14 = 0.8915 * pow(R3, 1.0151);
  const B16 = 3.6 * pow(P14, 0.75);
  const S14 = 0.8126 * pow(P14, 1.0134);
  const S18 = (S14 / T8) * T8;        // (S14/517)*517
  const P40 = 84.665 - (0.1179 * S18);

  // Lineales por R3
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

  const B32 = divideByPercent(B29, P45);

  const B6 = -2.1948 + (0.08388 * S3) + (3.9328 * T3n) - (0.903 * U3);

  const B122 = 9.445 + (0.19 * S3) + (0.271 * V3n) - (0.259 * W3n) + (0.489 * B6);
  const B114 = 0.5 * B6;
  const B118 = byPercent(B6, 5);
  const B116 = byPercent(B6, 25);

  // Potencias con S14 y P16
  const B87 = P16 * (10.4 * pow(S14, 0.24));
  const B73 = P16 * (1.25 * pow(S14, 0.33));
  const B7 = 0.075 * pow(S14, 0.75);
  const B59 = P16 * (0.9463 * pow(S14, 0.1216));
  const B37 = P16 * (38.6 * pow(S14, -0.36));
  const B30 = P16 * (147 * pow(S14, -0.5));
  const B52 = P16 * (5.594 * pow(S14, -0.2998));
  const B101 = P16 * (1.07 * pow(S14, -0.07));
  const B45 = P16 * (0.3466 * pow(S14, 0.0113));
  const B108 = P16 * (1.16 * pow(S14, 0.86));
  const B66 = P16 * (0.03 * pow(S14, 0.89));
  const B94 = P16 * (0.07 * pow(S14, 0.8));
  const B80 = P16 * (0.045 * pow(S14, -0.023));

  // Relaciones por porcentaje
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

  const B17 = (176.01 * P16) - (0.381 * pow(S18, 0.75) * pow(P16, 1.035));
  const B8 = 0.061 * pow(S18, 0.75) * pow(P16, 1.035);

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

  const B91 = B89 + B90;     // SUM(B89:B90)
  const B77 = B75 + B76;     // SUM(B75:B76)
  const B63 = B61 + B62;     // SUM(B61:B62)
  const B41 = B39 + B40;     // SUM(B39:B40)
  const B34 = B32 + B33;     // SUM(B32:B33)

  const B19 = divideByPercent(B17, Y40);
  const B18 = divideByPercent(B17, P40);

  const S22 = 1.14 * pow((B8 / P16), -1.137);
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
  const P19 = (0.513 + (0.173 * S22) + (0.1 * P16)) * 1;

  const B11 = B8 / S26;
  const B10 = B7 / P19;
  const B12 = B10 + B11;
  // *** Corrección de B13 según tu fórmula exacta ***
  const B13 = ((B12 / B6) + (0.3032 / 0.9455)) * B6;
  const B14 = B13 / 4.4;

  // --- Cadenas iterativas (dos ramas) ---
  const nextP = (prev, total) => (prev + ((total - (prev * 0.64)) / 0.8)) / 1000;

  // Rama con B21: P50..P150 y Q150
  const out = {};
  out.P50 = ((120 * B14) + ((B21 - (120 * B14) * 0.64) / 0.8)) / 1000;
  for (let i = 51; i <= 150; i++) {
    out[`P${i}`] = nextP(out[`P${i - 1}`], B21);
  }
  out.Q150 = -53.07 + (304.9 * out.P150) + (90.8 * B14) - (3.13 * pow(B14, 2));

  // Rama con B20: P155..P255 y Q255
  out.P155 = ((120 * B14) + ((B20 - (120 * B14) * 0.64) / 0.8)) / 1000;
  for (let i = 156; i <= 255; i++) {
    out[`P${i}`] = nextP(out[`P${i - 1}`], B20);
  }
  out.Q255 = -53.07 + (304.9 * out.P255) + (90.8 * B14) - (3.13 * pow(B14, 2));

  const B23 = out.Q150;
  const B22 = out.Q255;
  const B25 = (B21 - (B23 * 0.64)) / 0.8;
  const B24 = (B20 - (B23 * 0.64)) / 0.8;
  const B27 = B23 + B25;
  const B26 = B22 + B24;

  const B120 = (byPercent(B6, 90)) - ((B27 / 1000) + B116 + B118);

  // === Salida: solo las variables pedidas ===
  return {
    B6, B12, B10, B101, B14, B26, B16, B18, B19, B20, B21, B22, B23, B24,
    B25, B27, B34, B32, B33, B41, B39, B40, B42, B49, B47, B48, B56, B54,
    B55, B63, B61, B62, B70, B68, B69, B77, B75, B76, B84, B82, B83, B91,
    B89, B90, B98, B96, B97, B105, B103, B104, B112, B110, B111, B114,
    B116, B118, B120, B122
  };
}

// Exportaciones compatibles
const _default = { calcularFormulas };
export default _default;
if (typeof module !== "undefined" && module.exports) {
  module.exports = _default;
}
