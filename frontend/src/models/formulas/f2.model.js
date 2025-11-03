// src/models/f2.model.js
// Conversión de f2.js al formato "modelo" (sin UI, solo cálculo puro)

export function calcularFormulas(ctx) {
  // Utilidades
  const porc = (x) => x / 100;
  const divPorPorc = (valor, base) => valor / (base / 100);

  // Entradas base obligatorias
  const { P3, Q3, T3, V3, W3 } = ctx;
  if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
    throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
  }

  // Constantes con posibilidad de override desde ctx
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

  // Bases
  const R3 = (P3 + Q3) / 2;
  const S3 = Math.pow(R3, 0.75);
  const U3 = T3 * T3;

  const P16 = 0.963 * Math.pow(T3, 1.0151);
  const R8 = 0.963 * Math.pow(T3, 1.0151);
  const P8 = 0.8915 * Math.pow(R3, 1.0151);
  const Q8 = 0.8507 * Math.pow(P8, 1.0002);
  const R14 = 0.9247 * Math.pow(R3, 1.0085);
  const P14 = 0.8915 * Math.pow(R3, 1.0151);

  // Magnitudes lineales por R3
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
  const L58 = (23.5 * R3) / 1000;
  const L107 = (334.4 * R3) / 1000;

  // H6 / N6 / M6
  const H6 = (-2.8836 + 0.08435 * S3 + 4.5145 * T3 - 0.9631 * U3);
  const N6 = (-2.8836 + 0.08435 * S3 + 4.5145 * T3 - 0.9631 * U3);
  const M6 = (-0.6273 + 0.06453 * S3 + 3.871 * T3 - 0.614 * U3);

  // Auxiliares
  const Q14 = 0.8915 * Math.pow(R3, 1.0151);
  const Z14 = 0.6314 * Math.pow(Q14, 1.0602);
  const X14 = 0.6586 * Math.pow(R14, 1.0499);
  const Y14 = 0.611 * Math.pow(P14, 1.0667);
  const Z18 = (Z14 / T8) * T8;
  const X18 = (X14 / T8) * T8;
  const Y18 = (Y14 / T8) * T8;

  const M30 = R8 * (66 * Math.pow(Q8, -0.32));
  const L73 = R8 * (1.25 * Math.pow(Q8, 0.33));
  const L108 = R8 * (1.16 * Math.pow(Q8, 0.86));
  const L7 = 0.075 * Math.pow(Q8, 0.75);
  const L80 = R8 * (0.045 * Math.pow(Q8, -0.023));
  const L94 = R8 * (0.07 * Math.pow(Q8, 0.8));
  const M37 = R8 * (25.4 * Math.pow(Q8, -0.25));
  const L101 = R8 * (1.07 * Math.pow(Q8, -0.07));
  const M45 = R8 * (1.0597 * Math.pow(Q8, -0.2386));
  const L87 = R8 * (10.4 * Math.pow(Q8, 0.24));
  const M52 = R8 * (1.977 * Math.pow(Q8, -0.058));
  const M59 = R8 * (0.3418 * Math.pow(Q8, 0.32));
  const L66 = R8 * (0.03 * Math.pow(Q8, 0.89));
  const S8 = (Q8 / T8) * T8;
  const L8 = 0.052 * Math.pow(S8, 0.75) * Math.pow(R8, 1.062);
  const G8 = 0.061 * Math.pow(Z18, 0.75) * Math.pow(P16, 1.035);
  const I8 = 0.061 * Math.pow(X18, 0.75) * Math.pow(P16, 1.035);
  const D8 = 0.061 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035);
  const X22 = 1.14 * Math.pow(G8 / P16, -1.137);
  const U8 = 1.14 * Math.pow(L8 / R8, -1.137);
  const U22 = 1.14 * Math.pow(D8 / P16, -1.137);

  // Divisiones por porcentaje
  const M61 = divPorPorc(L58, T45);
  const L75 = divPorPorc(L72, V45);
  const M39 = divPorPorc(L36, Q45);
  const M32 = divPorPorc(L29, P45);
  const M33 = divPorPorc(M30, P45);
  const L68 = divPorPorc(L65, U45);
  const M47 = divPorPorc(L44, R45);
  const M54 = divPorPorc(L51, S45);

  const L82 = divPorPorc(L79, W45);
  const L103 = divPorPorc(L100, Z45);
  const L96 = divPorPorc(L93, Y45);
  const L89 = divPorPorc(L86, X45);
  const L110 = divPorPorc(L107, AA45);

  const L76 = divPorPorc(L73, V45);
  const L111 = divPorPorc(L108, AA45);
  const L83 = divPorPorc(L80, W45);
  const L97 = divPorPorc(L94, Y45);
  const M40 = divPorPorc(M37, Q45);
  const L104 = divPorPorc(L101, Z45);
  const M48 = divPorPorc(M45, R45);
  const L90 = divPorPorc(L87, X45);
  const M55 = divPorPorc(M52, S45);
  const M62 = divPorPorc(M59, T45);
  const L69 = divPorPorc(L66, U45);
  const L70 = L68 + L69;

  // Sumas / combinaciones
  const M31 = L29 + M30;
  const L74 = L72 + L73;
  const L109 = L107 + L108;
  const L81 = L79 + L80;
  const L95 = L93 + L94;
  const M38 = L36 + M37;
  const L102 = L100 + L101;
  const M46 = L44 + M45;
  const L88 = L86 + L87;
  const M53 = L51 + M52;
  const M60 = L58 + M59;
  const L67 = L65 + L66;

  const L77 = L75 + L76;
  const L112 = L110 + L111;
  const L84 = L82 + L83;
  const L98 = L96 + L97;
  const M41 = M39 + M40;
  const L105 = L103 + L104;
  const M49 = M47 + M48;
  const L91 = L89 + L90;
  const M56 = M54 + M55;

  const P33 = 84.665 - (0.1179 * S8);
  const L17 = (176.01 * R8) - (0.381 * Math.pow(S8, 0.75) * Math.pow(R8, 1.035));
  const I17 = (176.01 * P16) - (0.381 * Math.pow(X18, 0.75) * Math.pow(P16, 1.035));
  const L18 = divPorPorc(L17, P33);
  const L19 = divPorPorc(L17, R33);

  const X26 = 0.327 / (0.539 + X22);
  const V8v = 0.327 / (0.539 + U8);

  const I11 = I8 / X26;
  const L11 = L8 / V8v;

  const R19 = (0.513 + (0.173 * U22) + (0.01 * P16)) * 1;
  const I7 = 0.075 * Math.pow(X14, 0.75);
  const W8 = (0.513 + 0.173 * V8v + 0.1 * R8) * 0.92;
  const I10 = I7 / R19;
  const L10 = L7 / W8;

  const I12 = I10 + I11;
  const L12 = L10 + L11;

  const I13 = (((I12 / H6) + 0.3032) / 0.9455) * H6;
  const N13 = (((L12 / N6) + 0.3032) / 0.9455) * N6;
  const I14 = I13 / 4.4;
  const M14 = N13 / 4.4;

  const M34 = M32 + M33;
  const M42 = M34 / M41;

  const L16 = 3.9 * Math.pow(P8, 0.75);
  const M16 = L16; // En f2.js se devolvía M16 sin definirse; se alinea con L16.

  const M20 = L16 + L18;
  const M21 = L16 + L19;

  // Serie I (AD) para I21
  const I19 = divPorPorc(I17, Y40);
  const I16 = 3.6 * Math.pow(R14, 0.75);
  const I21 = I16 + I19;

  // Series recursivas y cierres
  const AD50 = ((120 * I14) + (I21 - (120 * I14) * 0.64) / 0.8) / 1000;
  const AK155 = ((120 * M14) + (M20 - (120 * M14) * 0.64) / 0.8) / 1000;
  const AK50 = ((120 * M14) + (M21 - (120 * M14) * 0.64) / 0.8) / 1000;

  function serieRec(desde, hasta, seed, corriente) {
    const out = {}; out[desde] = seed;
    for (let i = desde + 1; i <= hasta; i++) {
      const prev = out[i - 1];
      out[i] = (prev + (corriente - (prev * 0.64)) / 0.8) / 1000;
    }
    return out;
  }

  const AD = serieRec(50, 150, AD50, I21);
  const AK_hi = serieRec(50, 150, AK50, M21);
  const AK_lo = serieRec(155, 255, AK155, M20);

  const AE150 = (-53.07 + (304.9 * AD[150]) + (90.8 * I14) - (3.13 * Math.pow(I14, 2)));
  const AL255 = (-53.07 + (304.9 * AK_lo[255]) + (90.8 * M14) - (3.13 * Math.pow(M14, 2)));
  const AL150 = (-53.07 + (304.9 * AK_hi[150]) + (90.8 * M14) - (3.13 * Math.pow(M14, 2)));

  const I23 = AE150;
  const M22 = AL255;
  const M23 = AL150;

  const I25 = (I21 - (I23 * 0.64)) / 0.8;
  const M25 = (M21 - (M23 * 0.64)) / 0.8;
  const M24 = (M20 - (M23 * 0.64)) / 0.8;

  const I27 = I23 + I25;
  const M27 = M23 + M25;
  const M26 = M22 + M24;

  // Paquetes M6
  const M114 = 0.5 * M6;
  const M116 = M6 * porc(25);
  const M118 = M6 * porc(5);
  const M120 = (M6 * porc(90)) - ((I27 / 1000) + M116 + M118);
  const M122 = 9.445 + (0.19 * S3) + (0.271 * V3) - (0.259 * W3) + (0.489 * M6);

  // Asegurar M63 explícito
  const M63 = M61 + M62;

  // Salida (mismo orden lógico que el original de f2.js)
  return {
    M6, L12, L10, L11, M14, M26,
    M16, L18, L19, M20, M21, M22,
    M23, M24, M25, M27, M34, M32,
    M33, M41, M39, M40, M42, M49,
    M47, M48, M56, M54, M55, M63,
    M61, M62, L70, L68, L69, L77,
    L75, L76, L84, L82, L83, L91,
    L89, L90, L98, L96, L97, L105,
    L103, L104, L112, L110, L111,
    M114, M116, M118, M120, M122
  };
} 