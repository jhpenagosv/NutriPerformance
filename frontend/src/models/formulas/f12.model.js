// src/models/formulas/f12.model.js
// f12.model con modo "Excel estricto" en series AG/AC, manejo de % y perillas de ajuste.

export function calcularFormulas(ctx) {
    // ===== Utils =====
    const porc = (x) => x / 100;

    // División por porcentaje:
    // - Default: basePct es "porcentaje" (43.9 => 43.9% => /0.439)
    // - Si ctx.percentAsUnit === true, dividimos por basePct tal cual (útil si tu Excel tiene 0.439 o 43.9 sin %)
    const divPorPorc = (valor, basePct) => {
        if (ctx?.percentAsUnit) return valor / Number(basePct);
        return valor / (Number(basePct) / 100);
    };

    // ===== Entradas base =====
    const { P3, Q3, T3, V3, W3 } = ctx;
    if ([P3, Q3, T3, V3, W3].some(v => v === undefined || v === null || Number.isNaN(Number(v)))) {
        throw new Error("Faltan entradas base válidas: P3, Q3, T3, V3, W3");
    }

    // ===== Constantes (overrideables por ctx) =====
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

    const Y40 = ctx.Y40 ?? 47.4; // fijo en tus fórmulas
    const T8 = ctx.T8 ?? 517;

    // ===== Bases comunes =====
    const R3 = (Number(P3) + Number(Q3)) / 2;    // AVERAGE(P3:Q3)
    const S3 = Math.pow(R3, 0.75);               // S3
    const U3 = Number(T3) * Number(T3);          // U3
    const P16 = 0.963 * Math.pow(Number(T3), 1.0151);
    const R14 = 0.9247 * Math.pow(R3, 1.0085);
    const P14 = 0.8915 * Math.pow(R3, 1.0151);
    const R14p075 = Math.pow(R14, 0.75);

    // ===== Normalizaciones tipo *_18 y auxiliares =====
    const Y14 = 0.611 * Math.pow(P14, 1.0667);
    const Y18 = (Y14 / T8) * T8;

    // ===== Fuente AA14 (conmutable por ctx.aa14Source) =====
    // Opciones: "Q8" (default, como en f2), "Y14", "P14", "R14"
    const Q8 = 0.8507 * Math.pow(P14, 1.0002);
    const aa14Source = (ctx.aa14Source ?? "Q8").toUpperCase();
    const AA14 = aa14Source === "Y14" ? Y14
        : aa14Source === "P14" ? P14
            : aa14Source === "R14" ? R14
                : Q8; // "Q8" por defecto
    const AA18 = (AA14 / T8) * T8;

    const D8 = 0.061 * Math.pow(Y18, 0.75) * Math.pow(P16, 1.035);

    // U22, X22 y AA26 (X26) como en f2
    const U22 = 1.14 * Math.pow(D8 / P16, -1.137);
    const Q18 = (Q8 / T8) * T8;
    const X22 = 1.14 * Math.pow((0.061 * Math.pow(Q18, 0.75) * Math.pow(P16, 1.035)) / P16, -1.137);
    const AA26 = 0.327 / (0.539 + X22); // mapeo X26 -> AA26

    // ===== H6 =====
    const H6 = -2.8836 + (0.08435 * S3) + (4.5145 * Number(T3)) - (0.9631 * U3);

    // ===== J-bloque =====
    const R19 = (0.513 + (0.173 * U22) + (0.01 * P16)) * 1;

    const J7 = 0.075 * Math.pow(AA14, 0.75);
    const J8 = 0.061 * Math.pow(AA18, 0.75) * Math.pow(P16, 1.035);
    const J9 = J7 + J8;
    const J10 = J7 / R19;
    const J11 = J8 / AA26;
    const J12 = J10 + J11;

    // J13: usar paréntesis exactos como en tu fórmula
    // (((J12/H6)+(0.3032)/0.9455)*H6)  -> por precedencia correcta:
    // (((J12/H6) + 0.3032) / 0.9455) * H6
    const J13 = (((J12 / H6) + 0.3032) / 0.9455) * H6;
    const J14 = J13 / 4.4;

    const J16 = 3.6 * R14p075;
    const J17 = (176.01 * P16) - (0.381 * Math.pow(AA18, 0.75) * Math.pow(P16, 1.035));

    const X40 = (84.665 - (0.1179 * AA18));
    const J18 = divPorPorc(J17, X40);
    const J19 = divPorPorc(J17, Y40);
    const J20 = J16 + J18;
    const J21 = J16 + J19;

    // ===== Series AG (Excel estricto: sin /1000 dentro de la recursión) =====
    function serieRecExcel(desde, hasta, seed, corriente) {
        const out = {}; out[desde] = seed;
        for (let i = desde + 1; i <= hasta; i++) {
            const prev = out[i - 1];
            // Estructura de actualización sin dividir /1000 dentro de la recursión
            out[i] = (prev + (corriente - (prev * 0.64)) / 0.8);
        }
        return out;
    }

    // Semilla AJ50: en algunas hojas ya viene en milésimas;
    // aquí ofrecemos ambas variantes; por defecto usamos "en unidades" y dividimos al final.
    const AJ50_seed_units = ((120 * J14) + (J21 - (120 * J14) * 0.64) / 0.8);
    const AG_hi = serieRecExcel(50, 150, AJ50_seed_units, J21); // para AG150
    const AG_lo = serieRecExcel(155, 255, AJ50_seed_units, J20); // para AG255

    // Cuando Excel espera milésimas, se divide por 1000 en el uso final (no en la recursión):
    const AG150 = (-53.07 + (304.9 * (AG_hi[150] / 1000)) + (90.8 * J14) - (3.13 * Math.pow(J14, 2)));
    const AG255 = (-53.07 + (304.9 * (AG_lo[255] / 1000)) + (90.8 * J14) - (3.13 * Math.pow(J14, 2)));

    const J22 = AG255;
    const J23 = AG150;
    const J24 = (J20 - (J23 * 0.64)) / 0.8;
    const J25 = (J21 - (J23 * 0.64)) / 0.8;
    const J26 = J22 + J24;
    const J27 = J23 + J25;

    // ===== Magnitudes lineales B* =====
    // Overrides de escala por si tu Excel usa otras unidades
    const B29 = (11.7 * R3) / 1000;
    const B36 = (13.5 * R3) / 1000;
    const B44 = (5.9 * R3) / 1000;
    const B51 = (6.3 * R3) / 1000;
    const B58 = (23.5 * R3) / 1000;
    const B65 = (10.4 * R3) / 1000;
    const B72 = (95.6 * R3) / 1000;

    const B79 = ((ctx.B79_override ?? (13.5 / 1000)) * R3);
    const B86 = ((ctx.B86_override ?? (2942 / 1000)) * R3);
    const B93 = ((ctx.B93_override ?? (184.9 / 1000)) * R3);

    const B100 = (3.72 * R3) / 1000;
    const B107 = (334.4 * R3) / 1000;

    // ===== Bloques porcentuales J30..J112 =====
    const J30 = P16 * (66 * Math.pow(AA14, -0.32));
    const J31 = B29 + J30;
    const J32 = divPorPorc(B29, P45);
    const J33 = divPorPorc(J30, P45);
    const J34 = J32 + J33;

    const J37 = P16 * (25.4 * Math.pow(AA14, -0.25));
    const J38 = B36 + J37;
    const J39 = divPorPorc(B36, Q45);
    const J40 = divPorPorc(J37, Q45);
    const J41 = J39 + J40;
    const J42 = J34 / J41;

    const J45 = P16 * (1.0597 * Math.pow(AA14, -0.2386));
    const J46 = B44 + J45;
    const J47 = divPorPorc(B44, R45);
    const J48 = divPorPorc(J45, R45);
    const J49 = J47 + J48;

    const J52 = P16 * (1.977 * Math.pow(AA14, -0.058));
    const J53 = B51 + J52;
    const J54 = divPorPorc(B51, S45);
    const J55 = divPorPorc(J52, S45);
    const J56 = J54 + J55;

    const J59 = P16 * (0.3418 * Math.pow(AA14, 0.32));
    const J60 = B58 + J59;
    const J61 = divPorPorc(B58, T45);
    const J62 = divPorPorc(J59, T45);
    const J63 = J61 + J62;

    const J66 = P16 * (0.03 * Math.pow(AA14, 0.89));
    const J67 = B65 + J66;
    const J68 = divPorPorc(B65, U45);
    const J69 = divPorPorc(J66, U45);
    const J70 = J68 + J69;

    const J73 = P16 * (1.25 * Math.pow(AA14, 0.33));
    const J74 = B72 + J73;
    const J75 = divPorPorc(B72, V45);
    const J76 = divPorPorc(J73, V45);
    const J77 = J75 + J76;

    const J80 = P16 * (0.045 * Math.pow(AA14, -0.023));
    const J81 = B79 + J80;
    const J82 = divPorPorc(B79, W45);
    const J83 = divPorPorc(J80, W45);
    const J84 = J82 + J83;

    const J87 = P16 * (10.4 * Math.pow(AA14, 0.24));
    const J88 = B86 + J87;
    const J89 = divPorPorc(B86, X45);
    const J90 = divPorPorc(J87, X45);
    const J91 = J89 + J90;

    const J94 = P16 * (0.07 * Math.pow(AA14, 0.8));
    const J95 = B93 + J94;
    const J96 = divPorPorc(B93, Y45);
    const J97 = divPorPorc(J94, Y45);
    const J98 = J96 + J97;

    const J101 = P16 * (1.07 * Math.pow(AA14, -0.07));
    const J102 = B100 + J101;
    const J103 = divPorPorc(B100, Z45);
    const J104 = divPorPorc(J101, Z45);
    const J105 = J103 + J104;

    const J108 = P16 * (1.16 * Math.pow(AA14, 0.86));
    const J109 = B107 + J108;
    const J110 = divPorPorc(B107, AA45);
    const J111 = divPorPorc(J108, AA45);
    const J112 = J110 + J111;

    // ===== H-bloque (AC-series, Excel estricto) =====
    const U14 = 0.7248 * Math.pow(R14, 1.0314);
    const U18 = (U14 / T8) * T8;

    const H16 = 3.6 * R14p075;
    const H17 = (176.01 * P16) - (0.381 * Math.pow(U18, 0.75) * Math.pow(P16, 1.035));
    const H19 = divPorPorc(H17, Y40);
    const H21 = H16 + H19;

    // Serie AC con H14 = J14 (overrideable por ctx.H14)
    const H14 = (ctx.H14 !== undefined) ? Number(ctx.H14) : J14;
    const AH50_seed_units = ((120 * H14) + (H21 - (120 * H14) * 0.64) / 0.8);
    const AC_hi = serieRecExcel(50, 150, AH50_seed_units, H21); // AC150 (en unidades)
    const AC150 = (-53.07 + (304.9 * (AC_hi[150] / 1000)) + (90.8 * H14) - (3.13 * Math.pow(H14, 2)));

    const H23 = AC150;
    const H25 = (H21 - (H23 * 0.64)) / 0.8;
    const H27 = H23 + H25;

    const H114 = 0.5 * H6;
    const H116 = H6 * porc(25);
    const H118 = H6 * porc(5);
    const H120 = (H6 * porc(90)) - ((H27 / 1000) + H116 + H118);
    const H122 = 9.445 + (0.19 * S3) + (0.271 * Number(V3)) - (0.259 * Number(W3)) + (0.489 * H6);

    // ===== Salida =====
    return {
        H6,
        J12,
        J10,
        J11,
        J14,
        J26,
        J16,
        J18,
        J19,
        J20,
        J21,
        J22,
        J23,
        J24,
        J25,
        J27,
        J34,
        J32,
        J33,
        J41,
        J39,
        J40,
        J42,
        J49,
        J47,
        J48,
        J56,
        J54,
        J55,
        J63,
        J61,
        J62,
        J70,
        J68,
        J69,
        J77,
        J75,
        J76,
        J84,
        J82,
        J83,
        J91,
        J89,
        J90,
        J98,
        J96,
        J97,
        J105,
        J103,
        J104,
        J112,
        J110,
        J111,
        H114,
        H116,
        H118,
        H120,
        H122
    };
}
