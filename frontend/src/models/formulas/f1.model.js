export function calcularFormulas(ctx) {
  const { P3, Q3, T3, V3, W3 } = ctx;
  if ([P3, Q3, T3, V3, W3].some(v => v === undefined || Number.isNaN(v))) {
    throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
  }

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
  const R33 = 47.4;
  const T8 = ctx.T8 ?? 517;
  const U3 = (T3 * T3);
  const R3 = (P3 + Q3) / 2;
  const S3 = Math.pow(R3, 0.75);
  const P16 = 0.963 * Math.pow(T3, 1.0151);
  const R8 = 0.963 * Math.pow(T3, 1.0151);
  const P8 = 0.8915 * Math.pow(R3, 1.0151);
  const Q8 = 0.8507 * Math.pow(P8, 1.0002);
  const P14 = 0.8915 * Math.pow(R3, 1.0151);
  const R14 = 0.9247 * Math.pow(R3, 1.0085);
  const L79 = (13.5 * R3) / 1000;
  const L100 = (3.72 * R3) / 1000;
  const L44 = (5.9 * R3) / 1000;
  const L36 = (13.5 * R3) / 1000;
  const L29 = (11.7 * R3) / 1000;
  const L72 = (95.6 * R3) / 1000;
  const L65 = (10.4 * R3) / 1000;
  const L51 = (6.3 * R3) / 1000;
  const L93 = (184.9 * R3) / 1000;
  const L86 = (2942 * R3) / 1000;
  const L107 = (334.4 * R3) / 1000;
  const H6 = (-2.8836 + (0.08435 * S3) + (4.5145 * T3) - (0.9631 * U3));
  const L6 = (-2.1948 + (0.08388 * S3) + (3.9328 * T3) - (0.903 * U3));
  const L45 = R8 * (0.3466 * Math.pow(Q8, 0.0113));
  const L46 = L44 + L45;
  const L47 = L44 / (R45 / 100);
  const L48 = L45 / (R45 / 100);
  const L49 = L47 + L48;
  const L16 = 3.9 * Math.pow(P8, 0.75);
  const Y14 = 0.611 * Math.pow(P14, 1.0667);
  const U14 = 0.7248 * Math.pow(R14, 1.0314);
  const H16 = 3.6 * Math.pow(R14, 0.75);
  const L32 = L29 / (P45 / 100);
  const L30 = R8 * (147 * Math.pow(Q8, -0.5));
  const L33 = L30 / (P45 / 100);
  const L34 = L32 + L33;
  const L39 = L36 / (Q45 / 100);
  const L37 = R8 * (38.6 * Math.pow(Q8, -0.36));
  const L40 = L37 / (Q45 / 100);
  const L41 = L39 + L40;
  const L42 = L34 / L41;
  const L68 = L65 / (U45 / 100);
  const L66 = R8 * (0.03 * Math.pow(Q8, 0.89));
  const L69 = L66 / (U45 / 100);
  const L70 = L68 + L69;
  const L75 = L72 / (V45 / 100);
  const L73 = R8 * (1.25 * Math.pow(Q8, 0.33));
  const L76 = L73 / (V45 / 100);
  const L77 = L75 + L76;
  const L82 = L79 / (W45 / 100);
  const L80 = R8 * (0.045 * Math.pow(Q8, -0.023));
  const L83 = L80 / (W45 / 100);
  const L84 = L82 + L83;
  const L89 = L86 / (X45 / 100);
  const L87 = R8 * (10.4 * Math.pow(Q8, 0.24));
  const L90 = L87 / (X45 / 100);
  const L91 = L89 + L90;
  const L96 = L93 / (Y45 / 100);
  const L94 = R8 * (0.07 * Math.pow(Q8, 0.8));
  const L97 = L94 / (Y45 / 100);
  const L98 = L96 + L97;
  const L103 = L100 / (Z45 / 100);
  const L101 = R8 * (1.07 * Math.pow(Q8, -0.07));
  const L104 = L101 / (Z45 / 100);
  const L105 = L103 + L104;
  const L110 = L107 / (AA45 / 100);
  const L108 = R8 * (1.16 * Math.pow(Q8, 0.86));
  const L111 = L108 / (AA45 / 100);
  const L112 = L110 + L111;
  const L52 = R8 * (5.594 * Math.pow(Q8, -0.2998));
  const L54 = L51 / (S45 / 100);
  const L55 = L52 / (S45 / 100);
  const L53 = L51 + L52;
  const L56 = L54 + L55;
  const L7 = 0.075 * Math.pow(Q8, 0.75);
  const S8 = Q8;
  const L8 = 0.052 * Math.pow(S8, 0.75) * Math.pow(R8, 1.062);
  const U8 = 1.14 * Math.pow((L8 / R8), -1.137);
  const V8 = 0.327 / (0.539 + U8);
  const W8 = (0.513 + (0.173 * V8) + (0.1 * R8)) * 0.92;
  const L10 = L7 / W8;
  const L11 = L8 / V8;
  const L12 = L10 + L11;
  const H7 = 0.075 * Math.pow(U14, 0.75);
  const U18 = (U14 / T8) * T8;
  const Y18 = (Y14 / T8) * T8;
  const H8 = 0.061 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035);
  const D8 = 0.061 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035);
  const U22 = 1.14 * Math.pow((D8 / P16), -1.137);
  const U26 = 0.327 / (0.539 + U22);
  const R19 = (0.513 + (0.173 * U22) + (0.01 * P16)) * 1;
  const H10 = H7 / R19;
  const H11 = H8 / U26;
  const H12 = H10 + H11;
  const H13 = (((H12 / H6) + 0.3032) / 0.9455) * H6;
  const H14 = H13 / 4.4;
  const H17 = (176.01 * P16) - (0.381 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035));
  const H19 = H17 / (Y40 / 100);
  const H21 = H16 + H19;
  const L17 = (176.01 * R8) - (0.381 * Math.pow(S8, 0.75) * Math.pow(R8, 1.035));
  const P33 = 84.665 - (0.1179 * S8);
  const L18 = L17 / (P33 / 100);
  const L19 = L17 / (R33 / 100);
  const L20 = L16 + L18;
  const L21 = L16 + L19;
  const L13 = (((L12 / L6) + 0.3032) / 0.9455) * L6;
  const L14 = L13 / 4.4;
  let AB = ((120 * H14) + (H21 - (120 * H14) * 0.64) / 0.8) / 1000;
  for (let i = 51; i <= 150; i++) {
    AB = (AB + (H21 - (AB * 0.64)) / 0.8) / 1000;
  }

  const AC150 = (-53.07 + (304.9 * AB) + (90.8 * H14) - (3.13 * Math.pow(H14, 2)));
  const H23 = AC150;
  const H25 = (H21 - (H23 * 0.64)) / 0.8;
  const H27 = H23 + H25;
  let AI_L20 = ((120 * L14) + (L20 - (120 * L14) * 0.64) / 0.8) / 1000;
  for (let i = 156; i <= 255; i++) {
    AI_L20 = (AI_L20 + (L20 - (AI_L20 * 0.64)) / 0.8) / 1000;
  }

  const AJ255 = (-53.07 + (304.9 * AI_L20) + (90.8 * L14) - (3.13 * Math.pow(L14, 2)));
  let AI_L21 = ((120 * L14) + (L21 - (120 * L14) * 0.64) / 0.8) / 1000;
  for (let i = 51; i <= 150; i++) {
    AI_L21 = (AI_L21 + (L21 - (AI_L21 * 0.64)) / 0.8) / 1000;
  }

  const AJ150 = (-53.07 + (304.9 * AI_L21) + (90.8 * L14) - (3.13 * Math.pow(L14, 2)));
  const L22 = AJ255;
  const L23 = AJ150;
  const L24 = (L20 - (L23 * 0.64)) / 0.8;
  const L25 = (L21 - (L23 * 0.64)) / 0.8;
  const L26 = L22 + L24;
  const L27 = L23 + L25;
  const L58 = (23.5 * R3) / 1000;
  const L61 = L58 / (T45 / 100);
  const L59 = R8 * (0.9463 * Math.pow(Q8, 0.1216));
  const L62 = L59 / (T45 / 100);
  const L63 = L61 + L62;
  const L114 = 0.5 * L6;
  const L116 = L6 * (25 / 100);
  const L118 = L6 * (5 / 100);
  const L120 = (L6 * (90 / 100)) - ((H27 / 1000) + L116 + L118);
  const L122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * L6);

  return {
    L6, L12, L10, L11, L14,
    L26, L16, L18, L19, L20, L21, L22, L23, L24, L25, L27,
    L34, L32, L33, L41, L39, L40, L42,
    L49, L47, L48,
    L56, L54, L55,
    L63, L61, L62,
    L70, L68, L69,
    L77, L75, L76,
    L84, L82, L83,
    L91, L89, L90,
    L98, L96, L97,
    L105, L103, L104,
    L112, L110, L111,
    L114, L116, L118, L120, L122
  };
}