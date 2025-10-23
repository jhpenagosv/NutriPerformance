
export function calcularFormulas({ P3 = 0, Q3 = 0, R3, T3 = 0, V3 = 0, W3 = 0 }) {
  const _P3 = Number(P3) || 0;
  const _Q3 = Number(Q3) || 0;
  const _R3 = Number.isFinite(Number(R3)) ? Number(R3) : (_P3 + _Q3) / 2;
  const _T3 = Number(T3) || 0;
  const _V3 = Number(V3) || 0; 
  const _W3 = Number(W3) || 0;

  const S3 = _R3 ** 0.75;   // pcmet
  const U3 = _T3 * _T3;     // gmd2

  // ===== TABLA 1 =====
  const P8 = 0.8915 * _R3 ** 1.0151;     // PCA
  const Q8 = 0.8507 * P8 ** 1.0002;      // PCVC
  const R8 = 0.963 * _T3 ** 1.0151;      // GMDCVC
  const T8 = 517;                        // PCmad
  const S8 = (Q8 / T8) * T8;             // PCVCeq (= Q8)

  const L8_pre = 0.052 * (S8 ** 0.75) * (R8 ** 1.062);
  const U8 = 1.14 * (L8_pre / R8) ** -1.137; // ERpro
  const V8 = 0.327 / (0.539 + U8);           // kg
  const W8 = (0.513 + 0.173 * V8 + 0.1 * R8) * 0.92; // km

  // ===== TABLA 2 =====
  const L6 = -2.1948 + 0.08388 * S3 + 3.9328 * _T3 - 0.903 * U3;
  const M6 = -0.6273 + 0.06453 * S3 + 3.871 * _T3 - 0.614 * U3;
  const N6 = -2.8836 + 0.08435 * S3 + 4.5145 * _T3 - 0.9631 * U3;

  const L7 = 0.075 * (Q8 ** 0.75);
  const M7 = L7;
  const N7 = L7;

  const L8 = 0.052 * (S8 ** 0.75) * (R8 ** 1.062);
  const M8 = L8;
  const N8 = L8;

  const L9 = L7 + L8;
  const M9 = M7 + M8;
  const N9 = N7 + N8;

  const L10 = L7 / W8, M10 = M7 / W8, N10 = N7 / W8;
  const L11 = L8 / V8, M11 = M8 / V8, N11 = N8 / V8;

  const L12 = L10 + L11;
  const M12 = M10 + M11;
  const N12 = N10 + N11;

  const K = 0.3032 / 0.9455; // (solo 0.3032 / 0.9455)
  const L13 = (L12 / L6 + K) * L6;
  const N13 = (L12 / N6 + K) * N6;
  const M13 = N13;

  const L14 = L13 / 4.4;
  const N14 = N13 / 4.4;
  const M14 = N14;

  // ===== TABLA 3 =====
  const P33 = 84.665 - 0.1179 * S8;
  const PCA_mayor_340 = 47.4;

  // ===== TABLA 4 =====
  const P14 = 0.8915 * _R3 ** 1.0151;
  const Q14 = 0.8915 * _R3 ** 1.0151;
  const R14 = 0.9247 * _R3 ** 1.0085;

  // ===== TABLA 5 =====
  const S14 = 0.8126 * P14 ** 1.0134;
  const T14 = 0.7248 * Q14 ** 1.0314;
  const U14 = 0.7248 * R14 ** 1.0314;

  const V14 = 0.6241 * P14 ** 1.0608;
  const W14 = 0.6586 * Q14 ** 1.0499;
  const X14 = 0.6586 * R14 ** 1.0499;

  const Y14 = 0.611 * P14 ** 1.0667;
  const Z14 = 0.6314 * Q14 ** 1.0602;
  const AA14 = 0.6314 * R14 ** 1.0602;

  // ===== TABLA 7 =====
  const S18 = (S14 / 517) * 517;
  const T18 = (T14 / 517) * 517;
  const U18 = (U14 / 517) * 517;
  const V18 = (V14 / 517) * 517;
  const W18 = (W14 / 517) * 517;
  const X18 = (X14 / 517) * 517;
  const Y18 = (Y14 / 517) * 517;
  const Z18 = (Z14 / 517) * 517;
  const AA18 = (AA14 / 517) * 517;

  // ===== TABLA 10 (base B6..J9) =====
  const B6 = -2.1948 + 0.08388 * S3 + 3.9328 * _T3 - 0.903 * U3;
  const C6 = B6, D6 = B6;
  const E6 = -0.6273 + 0.06453 * S3 + 3.871 * _T3 - 0.614 * U3;
  const F6 = E6, G6 = E6;
  const H6 = -2.8836 + 0.08435 * S3 + 4.5145 * _T3 - 0.9631 * U3;
  const I6 = H6, J6 = H6;

  const B7 = 0.075 * S14 ** 0.75;
  const C7 = 0.075 * V14 ** 0.75;
  const D7 = 0.075 * Y14 ** 0.75;
  const E7 = 0.075 * T14 ** 0.75;
  const F7 = 0.075 * W14 ** 0.75;
  const G7 = 0.075 * Z14 ** 0.75;
  const H7 = 0.075 * U14 ** 0.75;
  const I7 = 0.075 * X14 ** 0.75;
  const J7 = 0.075 * AA14 ** 0.75;

  const P16 = 0.963 * _T3 ** 1.0151; // ≈ GMDCVC
  const B8 = 0.061 * S18 ** 0.75 * P16 ** 1.035;
  const C8 = 0.061 * V18 ** 0.75 * P16 ** 1.035;
  const D8 = 0.061 * Y18 ** 0.75 * P16 ** 1.035;
  const E8 = 0.061 * T18 ** 0.75 * P16 ** 1.035;
  const F8 = 0.061 * W18 ** 0.75 * P16 ** 1.035;
  const G8 = 0.061 * Z18 ** 0.75 * P16 ** 1.035;
  const H8 = 0.061 * U18 ** 0.75 * P16 ** 1.035;
  const I8 = 0.061 * X18 ** 0.75 * P16 ** 1.035;
  const J8 = 0.061 * AA18 ** 0.75 * P16 ** 1.035;

  const B9 = B7 + B8, C9 = C7 + C8, D9 = D7 + D8;
  const E9 = E7 + E8, F9 = F7 + F8, G9 = G7 + G8;
  const H9 = H7 + H8, I9 = I7 + I8, J9 = J7 + J8;

  // ===== TABLA 8 =====
  const S22 = 1.14 * (B8 / P16) ** -1.137;
  const T22 = 1.14 * (C8 / P16) ** -1.137;
  const U22 = 1.14 * (D8 / P16) ** -1.137;
  const V22 = 1.14 * (E8 / P16) ** -1.137;
  const W22 = 1.14 * (F8 / P16) ** -1.137;
  const X22 = 1.14 * (G8 / P16) ** -1.137;
  const Y22 = 1.14 * (H8 / P16) ** -1.137;
  const Z22 = 1.14 * (I8 / P16) ** -1.137;
  const AA22 = 1.14 * (J8 / P16) ** -1.137;

  // ===== TABLA 9 =====
  const S26 = 0.327 / (0.539 + S22);
  const T26 = 0.327 / (0.539 + T22);
  const U26 = 0.327 / (0.539 + U22);
  const V26 = 0.327 / (0.539 + V22);
  const W26 = 0.327 / (0.539 + W22);
  const X26 = 0.327 / (0.539 + X22);
  const Y26 = 0.327 / (0.539 + Y22);
  const Z26 = 0.327 / (0.539 + Z22);
  const AA26 = 0.327 / (0.539 + AA22);

  // ===== TABLA 6 =====
  const P19 = 0.513 + 0.173 * S22 + 0.1 * P16;
  const Q19 = 0.513 + 0.173 * T22 + 0.073 * P16;
  const R19 = 0.513 + 0.173 * U22 + 0.01 * P16;

  // ===== TABLA 10 (B10..J14) =====
  const B10 = B7 / P19, C10 = C7 / P19, D10 = D7 / P19;
  const E10 = E7 / Q19, F10 = F7 / Q19, G10 = G7 / Q19;
  const H10 = H7 / R19, I10 = I7 / R19, J10 = J7 / R19;

  const B11 = B8 / S26, C11 = C8 / V26, D11 = D8 / Y26;
  const E11 = E8 / T26, F11 = F8 / W26, G11 = G8 / Z26;
  const H11 = H8 / U26, I11 = I8 / X26, J11 = J8 / AA26;

  const B12 = B10 + B11, C12 = C10 + C11, D12 = D10 + D11;
  const E12 = E10 + E11, F12 = F10 + F11, G12 = G10 + G11;
  const H12 = H10 + H11, I12 = I10 + I11, J12 = J10 + J11;

  const B13 = (B12 / B6 + K) * B6;
  const C13 = (C12 / B6 + K) * B6;
  const D13 = (D12 / B6 + K) * B6;

  const E13 = (E12 / E6 + K) * E6;
  const F13 = (F12 / E6 + K) * E6;
  const G13 = (G12 / E6 + K) * E6;

  const H13 = (H12 / H6 + K) * H6;
  const I13 = (I12 / H6 + K) * H6;
  const J13 = (J12 / H6 + K) * H6;

  const B14 = B13 / 4.4, C14 = C13 / 4.4, D14 = D13 / 4.4;
  const E14 = E13 / 4.4, F14 = F13 / 4.4, G14 = G13 / 4.4;
  const H14 = H13 / 4.4, I14 = I13 / 4.4, J14 = J13 / 4.4;

  return {
    base: { P3: _P3, Q3: _Q3, R3: _R3, T3: _T3, V3: _V3, W3: _W3, S3, U3 },
    tabla1: { P8, Q8, R8, S8, T8, U8, V8, W8, R3: _R3 },
    tabla2: { L6, M6, N6, L7, M7, N7, L8, M8, N8, L9, M9, N9, L10, M10, N10, L11, M11, N11, L12, M12, N12, L13, M13, N13, L14, M14, N14 },
    tabla3: { P33, PCA_mayor_340 },
    tabla4: { P14, Q14, R14 },
    tabla5: { S14, T14, U14, V14, W14, X14, Y14, Z14, AA14 },
    tabla7: { S18, T18, U18, V18, W18, X18, Y18, Z18, AA18 },
    tabla10a: { B6, C6, D6, E6, F6, G6, H6, I6, J6, B7, C7, D7, E7, F7, G7, H7, I7, J7, B8, C8, D8, E8, F8, G8, H8, I8, J8, B9, C9, D9, E9, F9, G9, H9, I9, J9 },
    tabla8: { S22, T22, U22, V22, W22, X22, Y22, Z22, AA22 },
    tabla9: { S26, T26, U26, V26, W26, X26, Y26, Z26, AA26 },
    tabla6: { P19, Q19, R19, P16 },
    tabla10b: { B10, C10, D10, E10, F10, G10, H10, I10, J10, B11, C11, D11, E11, F11, G11, H11, I11, J11, B12, C12, D12, E12, F12, G12, H12, I12, J12, B13, C13, D13, E13, F13, G13, H13, I13, J13, B14, C14, D14, E14, F14, G14, H14, I14, J14 },
  };
}
