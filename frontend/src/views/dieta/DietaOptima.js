import React from "react";
import "./DietaOptima.css";

export default function DietaOptima() {
  // DEMO productos (Formulario 2)
  const productosDemo = [
    { producto: "Maíz", costo: 1.10, minimo: 20, maximo: 60 },
    { producto: "Torta de soya", costo: 1.65, minimo: 10, maximo: 35 },
    { producto: "Afrecho de trigo", costo: 0.50, minimo: 15, maximo: 50 },
  ];

  // DEMO estados (Formulario 3)
  const estadosNutrientes = [
    { tipo: "rojo", titulo: "Baja de nutrientes necesarios", desc: "Uno o más nutrientes están por debajo del requerimiento." },
    { tipo: "verde", titulo: "Nutrientes necesarios", desc: "Todos los nutrientes dentro de los rangos objetivos." },
    { tipo: "amarillo", titulo: "Sobrepasa los requisitos", desc: "Alguno(s) superan el máximo permitido." },
  ];

  // DEMO tabla (Formulario 4, con colores de estado iguales a Formulario 3)
  const reqTabla = [
    ["Materia seca", "MS", "kg/día", 8.5, 8.3, "OK"],
    ["Extracto de éter", "EE", "kg/día", 0.25, 0.20, "Bajo"],
    ["Carbohidratos sin fibra", "CSF", "kg/día", 4.2, 4.5, "OK"],
    ["Fibra detergente neutra", "FDN", "Mcal/día", 2.6, 2.9, "Alto"],
    ["Nutrientes digestibles totales", "NDT", "kg/día", 6.8, 6.8, "OK"],
    ["Energía neta", "EN", "Mcal/día", 6.5, 6.2, "Bajo"],
    ["Energía metabolizable", "EM", "Mcal/día", 7.4, 7.6, "OK"],
    ["Proteína degradable en el rumen", "PDR", "g/día", 650, 640, "Bajo"],
    ["Proteína no degradable en el rumen", "PND", "g/día", 420, 430, "OK"],
    ["Proteína cruda", "PC", "g/día", 1070, 1080, "OK"],
    ["Proteína metabolizable", "PM", "g/día", 950, 970, "OK"],
    ["Calcio", "Ca", "g/día", 30, 28, "Bajo"],
    ["Fósforo", "P", "g/día", 20, 21, "OK"],
    ["Magnesio", "Mg", "g/día", 12, 11, "Bajo"],
    ["Potasio", "K", "g/día", 18, 19, "OK"],
    ["Sodio", "Na", "g/día", 5, 6, "Alto"],
    ["Azufre", "S", "g/día", 4, 4, "OK"],
    ["Cobalto", "Co", "mg/día", 0.12, 0.11, "Bajo"],
    ["Cobre", "Cu", "mg/día", 10, 9, "Bajo"],
    ["Yodo", "I", "mg/día", 0.5, 0.5, "OK"],
    ["Manganeso", "Mn", "mg/día", 45, 48, "OK"],
    ["Selenio", "Se", "mg/día", 0.3, 0.35, "Alto"],
    ["Zinc", "Zn", "mg/día", 50, 51, "OK"],
  ];

  return (
    <div className="do-container">
      {/* ===== FORMULARIO 1 (lista azul no editable) ===== */}
      <section className="do-card">
        <div className="do-title-row">
          <h2 className="do-title">DIETA OPTIMA</h2>
        </div>

        <ul className="do-list-azul">
          <li><span className="do-list-key">Propósito:</span> crecimiento y desarrollo</li>
          <li><span className="do-list-key">TIPO ANIMAL:</span> Bovino de carne</li>
          <li><span className="do-list-key">SISTEMA DE ALIMENTACIÓN:</span> Pastoreo</li>
          <li><span className="do-list-key">SEXO Y CONDICIÓN REPRODUCTIVA:</span> Macho entero</li>
          <li className="do-multiline">
            <span className="do-list-key">INFORMACIÓN DEL ANIMAL:</span>
            Peso: 400 kg
          </li>
        </ul>
      </section>

      {/* ===== FORMULARIO 2 (PRODUCTOS / COSTO / MIN / MAX) ===== */}
      <section className="do-card">
        <div className="do-section-head">
          <h3>Productos seleccionados / costos / mínimos / máximos</h3>
        </div>
        <div className="do-table-wrap">
          <table className="do-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="num">Costo</th>
                <th className="num">Mínimo (%)</th>
                <th className="num">Máximo (%)</th>
              </tr>
            </thead>
            <tbody>
              {productosDemo.map((p) => (
                <tr key={p.producto}>
                  <td>{p.producto}</td>
                  <td className="num">{p.costo.toFixed(2)}</td>
                  <td className="num">{p.minimo}</td>
                  <td className="num">{p.maximo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== FORMULARIO 3 (SEMÁFOROS) ===== */}
      <section className="do-card">
        <div className="do-section-head"><h3>Estado de nutrientes</h3></div>
        <div className="do-status-grid">
          {estadosNutrientes.map((b, i) => (
            <div key={i} className={`do-status-box ${b.tipo}`}>
              <div className="do-status-title">{b.titulo}</div>
              <div className="do-status-desc">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FORMULARIO 4 (tabla completa con ejemplos y chips de color) ===== */}
      <section className="do-card">
        <div className="do-section-head">
          <h3>Requisitos nutricionales (resumen)</h3>
          <span className="do-hint"></span>
        </div>
        <div className="do-table-wrap">
          <table className="do-table">
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Abrev.</th>
                <th>Unidad</th>
                <th className="num">Requerido</th>
                <th className="num">Alcanzado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reqTabla.map(([param, abrev, unidad, req, alc, est]) => (
                <tr key={param}>
                  <td>{param}</td>
                  <td>{abrev}</td>
                  <td>{unidad}</td>
                  <td className="num">{req}</td>
                  <td className="num">{alc}</td>
                  <td>
                    <span
                      className={
                        "do-chip " +
                        (est === "OK" ? "ok" : est === "Bajo" ? "bad" : est === "Alto" ? "warn" : "")
                      }
                    >
                      {est}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Acciones visuales */}
      <div className="do-actions">
        <button type="button" className="ani-btn ghost">Atrás</button>
        <button type="button" className="ani-btn primary">Guardar / Exportar</button>
      </div>
    </div>
  );
}
