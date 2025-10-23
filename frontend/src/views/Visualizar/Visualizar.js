import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { calcularFormulas } from "../../utils/formulas";
import "./Visualizar.css";

// formateo simple
const fmt = (x) => (Number.isFinite(x) ? Number(x).toFixed(2) : "-");

function SectionTable({ title, headers, rows, note = "" }) {
  return (
    <section className="viz-section">
      <header className="viz-h">
        {title}
        {note && <span className="viz-note">{note}</span>}
      </header>

      <table className="viz-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} className="viz-th">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, i) => (
                <td key={i} className={`viz-td ${i === 0 ? "left" : "mono"}`}>
                  {i === 0 ? cell : fmt(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Visualizar() {
  const [params] = useSearchParams();

  // Lee parámetros de la URL y calcula en cliente
  const data = useMemo(() => {
    const P3 = Number(params.get("P3")) || 0;
    const Q3 = Number(params.get("Q3")) || 0;
    const R3 = params.get("R3"); // si no viene, se calcula como promedio
    const T3 = Number(params.get("T3")) || 0;
    const V3 = Number(params.get("V3")) || 0;
    const W3 = Number(params.get("W3")) || 0;
    return calcularFormulas({ P3, Q3, R3, T3, V3, W3 });
  }, [params]);

  const {
    base,
    tabla1,
    tabla2,
    tabla3,
    tabla4,
    tabla5,
    tabla7,
    tabla10a,
    tabla8,
    tabla9,
    tabla6,
    tabla10b,
  } = data;

  return (
    <div className="visual-wrapper">
      <h2 className="visual-title">Resultados de cálculos (local)</h2>

      <SectionTable
        title="Tabla 1"
        headers={["Campo", "Valor"]}
        rows={[
          ["PCA (P8)", tabla1.P8],
          ["PCVC (Q8)", tabla1.Q8],
          ["GMDCVC (R8)", tabla1.R8],
          ["PCVCeq (S8)", tabla1.S8],
          ["PCmad (T8)", tabla1.T8],
          ["ERpro (U8)", tabla1.U8],
          ["kg (V8)", tabla1.V8],
          ["km (W8)", tabla1.W8],
          ["promedio (R3)", base.R3],
        ]}
      />

      <SectionTable
        title="Tabla 2"
        headers={["", "Cebú (L)", "Cruce carne (M)", "Cruce leche (N)"]}
        rows={[
          ["6", tabla2.L6, tabla2.M6, tabla2.N6],
          ["7", tabla2.L7, tabla2.M7, tabla2.N7],
          ["8", tabla2.L8, tabla2.M8, tabla2.N8],
          ["9", tabla2.L9, tabla2.M9, tabla2.N9],
          ["10", tabla2.L10, tabla2.M10, tabla2.N10],
          ["11", tabla2.L11, tabla2.M11, tabla2.N11],
          ["12", tabla2.L12, tabla2.M12, tabla2.N12],
          ["13", tabla2.L13, tabla2.M13, tabla2.N13],
          ["14", tabla2.L14, tabla2.M14, tabla2.N14],
        ]}
      />

      <SectionTable
        title="Tabla 3"
        headers={["Rango", "Valor"]}
        rows={[
          ["PCA < 340 kg (P33)", tabla3.P33],
          ["PCA > 340 kg", tabla3.PCA_mayor_340],
        ]}
      />

      <SectionTable
        title="Tabla 4"
        headers={["Tipo", "Valor"]}
        rows={[
          ["Cebuinos (P14)", tabla4.P14],
          ["Cruce carne (Q14)", tabla4.Q14],
          ["Cruce leche (R14)", tabla4.R14],
        ]}
      />

      <SectionTable
        title="Tabla 5"
        headers={["", "Cebú", "Carne", "Leche"]}
        rows={[
          ["S14 / T14 / U14", tabla5.S14, tabla5.T14, tabla5.U14],
          ["V14 / W14 / X14", tabla5.V14, tabla5.W14, tabla5.X14],
          ["Y14 / Z14 / AA14", tabla5.Y14, tabla5.Z14, tabla5.AA14],
        ]}
      />

      <SectionTable
        title="Tabla 7"
        headers={["", "Cebú", "Carne", "Leche"]}
        rows={[
          ["S18 / T18 / U18", tabla7.S18, tabla7.T18, tabla7.U18],
          ["V18 / W18 / X18", tabla7.V18, tabla7.W18, tabla7.X18],
          ["Y18 / Z18 / AA18", tabla7.Y18, tabla7.Z18, tabla7.AA18],
        ]}
      />

      {/* ======= ENCABEZADOS CORREGIDOS POR BLOQUES ======= */}
      <SectionTable
        title="Tabla 10 (base B6..J9)"
        headers={[
          "",
          "Cebú 1","Cebú 2","Cebú 3",
          "Carne 1","Carne 2","Carne 3",
          "Leche 1","Leche 2","Leche 3",
        ]}
        rows={[
          ["6",  tabla10a.B6, tabla10a.C6, tabla10a.D6, tabla10a.E6, tabla10a.F6, tabla10a.G6, tabla10a.H6, tabla10a.I6, tabla10a.J6],
          ["7",  tabla10a.B7, tabla10a.C7, tabla10a.D7, tabla10a.E7, tabla10a.F7, tabla10a.G7, tabla10a.H7, tabla10a.I7, tabla10a.J7],
          ["8",  tabla10a.B8, tabla10a.C8, tabla10a.D8, tabla10a.E8, tabla10a.F8, tabla10a.G8, tabla10a.H8, tabla10a.I8, tabla10a.J8],
          ["9",  tabla10a.B9, tabla10a.C9, tabla10a.D9, tabla10a.E9, tabla10a.F9, tabla10a.G9, tabla10a.H9, tabla10a.I9, tabla10a.J9],
        ]}
        note="Previo a Tablas 8 y 9"
      />

      <SectionTable
        title="Tabla 8"
        headers={[
          "",
          "Cebú 1","Cebú 2","Cebú 3",
          "Carne 1","Carne 2","Carne 3",
          "Leche 1","Leche 2","Leche 3",
        ]}
        rows={[
          ["S22…AA22", tabla8.S22, tabla8.T22, tabla8.U22, tabla8.V22, tabla8.W22, tabla8.X22, tabla8.Y22, tabla8.Z22, tabla8.AA22],
        ]}
      />

      <SectionTable
        title="Tabla 9"
        headers={[
          "",
          "Cebú 1","Cebú 2","Cebú 3",
          "Carne 1","Carne 2","Carne 3",
          "Leche 1","Leche 2","Leche 3",
        ]}
        rows={[
          ["S26…AA26", tabla9.S26, tabla9.T26, tabla9.U26, tabla9.V26, tabla9.W26, tabla9.X26, tabla9.Y26, tabla9.Z26, tabla9.AA26],
        ]}
      />

      <SectionTable
        title="Tabla 6"
        headers={["Campo", "Valor"]}
        rows={[
          ["GMDCVC (P16)", tabla6.P16],
          ["CEBUINOS (P19)", tabla6.P19],
          ["CARNE (Q19)", tabla6.Q19],
          ["LECHE (R19)", tabla6.R19],
        ]}
      />

      {/* ======= ENCABEZADOS CORREGIDOS POR BLOQUES ======= */}
      <SectionTable
        title="Tabla 10 (B10..J14)"
        headers={[
          "",
          "Cebú 1","Cebú 2","Cebú 3",
          "Carne 1","Carne 2","Carne 3",
          "Leche 1","Leche 2","Leche 3",
        ]}
        rows={[
          ["10", tabla10b.B10, tabla10b.C10, tabla10b.D10, tabla10b.E10, tabla10b.F10, tabla10b.G10, tabla10b.H10, tabla10b.I10, tabla10b.J10],
          ["11", tabla10b.B11, tabla10b.C11, tabla10b.D11, tabla10b.E11, tabla10b.F11, tabla10b.G11, tabla10b.H11, tabla10b.I11, tabla10b.J11],
          ["12", tabla10b.B12, tabla10b.C12, tabla10b.D12, tabla10b.E12, tabla10b.F12, tabla10b.G12, tabla10b.H12, tabla10b.I12, tabla10b.J12],
          ["13", tabla10b.B13, tabla10b.C13, tabla10b.D13, tabla10b.E13, tabla10b.F13, tabla10b.G13, tabla10b.H13, tabla10b.I13, tabla10b.J13],
          ["14", tabla10b.B14, tabla10b.C14, tabla10b.D14, tabla10b.E14, tabla10b.F14, tabla10b.G14, tabla10b.H14, tabla10b.I14, tabla10b.J14],
        ]}
      />
    </div>
  );
}
