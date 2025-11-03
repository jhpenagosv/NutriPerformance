// formulas_extra.only_returns.js
// Devuelve ÚNICAMENTE las variables solicitadas, en el orden indicado por el usuario.
// Mantiene fórmulas explícitas (sin helpers) y valores por defecto parametrizables vía ctx.

export function calcularFormulas(ctx = {}) {
  // Entradas base con defaults (constantes)
  const P3 = (ctx.P3 !== undefined) ? ctx.P3 : 510;
  const Q3 = (ctx.Q3 !== undefined) ? ctx.Q3 : 530;
  const T3 = (ctx.T3 !== undefined) ? ctx.T3 : 1.5;
  const V3 = (ctx.V3 !== undefined) ? ctx.V3 : 35;
  const W3 = (ctx.W3 !== undefined) ? ctx.W3 : 80;
  const T8 = (ctx.T8 !== undefined) ? ctx.T8 : 517;

  // Porcentajes y otros parámetros de la fila 45/40/33 (con override opcional)
  const P45 = (ctx.P45 !== undefined) ? ctx.P45 : 56.8;
  const Q45 = (ctx.Q45 !== undefined) ? ctx.Q45 : 67.8;
  const R45 = (ctx.R45 !== undefined) ? ctx.R45 : 35.5;
  const S45 = (ctx.S45 !== undefined) ? ctx.S45 : 37.1;
  const T45 = (ctx.T45 !== undefined) ? ctx.T45 : 48.4;
  const U45 = (ctx.U45 !== undefined) ? ctx.U45 : 77.3;
  const V45 = (ctx.V45 !== undefined) ? ctx.V45 : 73.5;
  const W45 = (ctx.W45 !== undefined) ? ctx.W45 : 86.8;
  const X45 = (ctx.X45 !== undefined) ? ctx.X45 : 73.4;
  const Y45 = (ctx.Y45 !== undefined) ? ctx.Y45 : 43.9;
  const Z45 = (ctx.Z45 !== undefined) ? ctx.Z45 : 48.7;
  const AA45 = (ctx.AA45 !== undefined) ? ctx.AA45 : 66.8;
  const Y40 = (ctx.Y40 !== undefined) ? ctx.Y40 : 47.4;
  const R33 = (ctx.R33 !== undefined) ? ctx.R33 : 47.4;

  // Derivadas base
  const U3 = (T3 * T3);
  const R3 = (P3 + Q3) / 2;               // AVERAGE(P3:Q3)
  const S3 = Math.pow(R3, 0.75);

  const P16 = 0.963 * Math.pow(T3, 1.0151);
  const R8 = 0.963 * Math.pow(T3, 1.0151);
  const P8 = 0.8915 * Math.pow(R3, 1.0151);
  const Q8 = 0.8507 * Math.pow(P8, 1.0002);
  const P14 = 0.8915 * Math.pow(R3, 1.0151);
  const R14 = 0.9247 * Math.pow(R3, 1.0085);

  // Bloque Lxx derivados de R3
  const L93 = (184.9 * R3) / 1000;
  const L65 = (10.4 * R3) / 1000;
  const L36 = (13.5 * R3) / 1000;
  const L79 = (13.5 * R3) / 1000;
  const L107 = (334.4 * R3) / 1000;
  const L58 = (23.5 * R3) / 1000;
  const L51 = (6.3 * R3) / 1000;
  const L44 = (5.9 * R3) / 1000;
  const L86 = (2942 * R3) / 1000;
  const L72 = (95.6 * R3) / 1000;
  const L100 = (3.72 * R3) / 1000;
  const L29 = (11.7 * R3) / 1000;

  // Cadenas N/J (energía/proteína)
  const N16 = 3.9 * Math.pow(P8, 0.75);
  const N6 = (-2.8836 + (0.08435 * S3) + (4.5145 * T3) - (0.9631 * U3));
  const H6 = (-2.8836 + (0.08435 * S3) + (4.5145 * T3) - (0.9631 * U3));

  const L82 = L79 / (W45 / 100);
  const L110 = L107 / (AA45 / 100);
  const J16 = 3.6 * Math.pow(R14, 0.75);
  const AA14 = 0.6314 * Math.pow(R14, 1.0602);
  const L89 = L86 / (X45 / 100);
  const Y14 = 0.611 * Math.pow(P14, 1.0667);
  const L103 = L100 / (Z45 / 100);

  // Términos con R8 (no simplificar)
  const L80 = (R8 * (0.045 * Math.pow(Q8, -0.023)));
  const L73 = (R8 * (1.25 * Math.pow(Q8, 0.33)));
  const M45 = (R8 * (1.0597 * Math.pow(Q8, -0.2386)));
  const M37 = (R8 * (25.4 * Math.pow(Q8, -0.25)));
  const L7 = (0.075 * Math.pow(Q8, 0.75));
  const L94 = (R8 * (0.07 * Math.pow(Q8, 0.8)));
  const L87 = (R8 * (10.4 * Math.pow(Q8, 0.24)));
  const M30 = (R8 * (66 * Math.pow(Q8, -0.32)));
  const S8 = (Q8 / T8) * T8; // no simplificar la identidad
  const M59 = (R8 * (0.3418 * Math.pow(Q8, 0.32)));
  const L101 = (R8 * (1.07 * Math.pow(Q8, -0.07)));
  const L108 = (R8 * (1.16 * Math.pow(Q8, 0.86)));
  const M52 = (R8 * (1.977 * Math.pow(Q8, -0.058)));
  const L66 = (R8 * (0.03 * Math.pow(Q8, 0.89)));

  // Bloques Mxx/Lxx por porcentajes
  const M33 = (M30) / (P45 / 100);
  const M39 = (L36) / (Q45 / 100);
  const M47 = (L44) / (R45 / 100);
  const M61 = (L58) / (T45 / 100);
  const M32 = (L29) / (P45 / 100);
  const M54 = (L51) / (S45 / 100);
  const L75 = (L72) / (V45 / 100);

  const L83 = L80 / (W45 / 100);
  const L81 = L79 + L80;
  const L76 = L73 / (V45 / 100);
  const L74 = (L72) + L73;
  const M46 = (L44) + M45;
  const M48 = M45 / (R45 / 100);
  const M40 = M37 / (Q45 / 100);
  const M38 = (L36) + M37;

  // L9 = SUM(L7:N8) -> expandida con celdas ausentes en 0 (M7, N7, M8, N8 no definidos)
  const L9 = (L7) + (0) + (0) + (0.052 * Math.pow(S8, 0.75) * Math.pow(R8, 1.062)) + (0) + (0);
  const L8 = (0.052 * Math.pow(S8, 0.75) * Math.pow(R8, 1.062));

  const L96 = L93 / (Y45 / 100);
  const L95 = L93 + L94;
  const L97 = L94 / (Y45 / 100);
  const L88 = L86 + L87;
  const L90 = L87 / (X45 / 100);
  const M31 = L29 + M30;

  const L17 = ((176.01 * R8) - (0.381 * Math.pow(S8, 0.75) * Math.pow(R8, 1.035)));
  const P33 = (84.665 - (0.1179 * S8));
  const M60 = (L58) + M59;
  const M62 = M59 / (T45 / 100);
  const L104 = L101 / (Z45 / 100);
  const L102 = L100 + L101;
  const L109 = L107 + L108;
  const L111 = L108 / (AA45 / 100);
  const M53 = (L51) + M52;
  const M55 = M52 / (S45 / 100);
  const L67 = (L65) + L66;
  const L69 = L66 / (U45 / 100);

  // J y AA cadenas
  const J8 = (0.061 * Math.pow((AA14 / 517) * 517, 0.75)) * Math.pow(P16, 1.035);
  const J17 = ((176.01 * P16) - (0.381 * Math.pow(((AA14 / 517) * 517), 0.75) * Math.pow(P16, 1.035)));
  const D8 = (0.061 * Math.pow((Y14 / 517) * 517, 0.75)) * Math.pow(P16, 1.035);

  const L84 = L82 + L83;
  const L77 = L75 + L76;
  const M49 = M47 + M48;
  const M41 = M39 + M40;
  const L98 = L96 + L97;
  const L91 = L89 + L90;

  const L19 = L17 / (R33 / 100);
  const L18 = L17 / (P33 / 100);
  const U8 = 1.14 * Math.pow((L8 / R8), -1.137);
  const M63 = M61 + M62;
  const L105 = L103 + L104;
  const L112 = L110 + L111;
  const M56 = M54 + M55;
  const L68 = L65 / (U45 / 100);
  const L70 = L68 + L69;
  const AA22 = 1.14 * Math.pow((J8 / P16), -1.137);
  const J19 = J17 / (Y40 / 100);
  const U22 = 1.14 * Math.pow((D8 / P16), -1.137);
  const M42 = (M32 + M33) / M41;
  const N21 = N16 + L19;
  const N20 = N16 + L18;
  const V8 = 0.327 / (0.539 + U8);
  const AA26 = 0.327 / (0.539 + AA22);
  const J21 = J16 + J19;
  const R19 = (0.513 + (0.173 * U22) + (0.01 * P16)) * 1;
  const L11 = L8 / V8;
  const W8 = ((0.513 + (0.173 * V8) + (0.1 * R8)) * 0.92);
  const J11 = J8 / AA26;
  const J10 = (0.075 * Math.pow(AA14, 0.75)) / R19;
  const L10 = L7 / W8;
  const J12 = J10 + J11;
  const L12 = (L10) + (0) + (0) + (L11) + (0) + (0);

  const J13 = (((J12 / H6) + (0.3032)) / 0.9455) * H6;
  const N13 = ((((L12 / N6) + 0.3032) / 0.9455) * N6);
  const J14 = J13 / 4.4;
  const M14 = N13 / 4.4;

  // Iteraciones AF (J)
  let AF = ((120 * J14) + (J21 - (120 * J14) * 0.64) / 0.8) / 1000; // AF50
  for (let i = 51; i <= 150; i++) {
    AF = (AF + (J21 - (AF * 0.64)) / 0.8) / 1000;
  }
  const AG150 = (-53.07 + (304.9 * AF) + (90.8 * J14) - (3.13 * Math.pow(J14, 2)));

  // Iteraciones AM (N): dos ramas
  let AM_a = ((120 * M14) + (N20 - (120 * M14) * 0.64) / 0.8) / 1000; // AM155
  for (let i = 156; i <= 255; i++) {
    AM_a = (AM_a + (N20 - (AM_a * 0.64)) / 0.8) / 1000;
  }
  let AM_b = ((120 * M14) + (N21 - (120 * M14) * 0.64) / 0.8) / 1000; // AM50
  for (let i = 51; i <= 150; i++) {
    AM_b = (AM_b + (N21 - (AM_b * 0.64)) / 0.8) / 1000;
  }
  const AN255 = (-53.07 + (304.9 * AM_a) + (90.8 * M14) - (3.13 * Math.pow(M14, 2)));
  const AN150 = (-53.07 + (304.9 * AM_b) + (90.8 * M14) - (3.13 * Math.pow(M14, 2)));

  const J23 = AG150;
  const N22 = AN255;
  const N23 = AN150;
  const J25 = (J21 - (J23 * 0.64)) / 0.8;
  const N25 = (N21 - (N23 * 0.64)) / 0.8;
  const N24 = (N20 - (N23 * 0.64)) / 0.8;
  const J27 = J23 + J25;
  const N27 = N23 + N25;
  const N26 = N22 + N24;

  const N116 = N6 * (25 / 100);
  const N118 = N6 * (5 / 100);
  const N114 = 0.5 * N6;
  const N122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * N6);
  const N120 = (N6 * (90 / 100)) - ((J27 / 1000) + N116 + N118);

  // === RETORNO ÚNICAMENTE DE LAS VARIABLES SOLICITADAS, EN ESTE ORDEN ===
  return {
    N6,
    L12,
    L10,
    L11,
    M14,
    N26,
    N16,
    L18,
    L19,
    N20,
    N21,
    N22,
    N23,
    N24,
    N25,
    N27,
    M34: (M32 + M33),
    M32,
    M33,
    M41,
    M39,
    M40,
    M42,
    M49,
    M47,
    M48,
    M56,
    M54,
    M55,
    M63,
    M61,
    M62,
    L70,
    L68,
    L69,
    L77,
    L75,
    L76,
    L84,
    L82,
    L83,
    L91,
    L89,
    L90,
    L98,
    L96,
    L97,
    L105,
    L103,
    L104,
    L112,
    L110,
    L111,
    N114,
    N116,
    N118,
    N120,
    N122
  };
}
