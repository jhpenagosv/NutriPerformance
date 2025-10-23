import React, { useState } from "react";
import "./Dieta.css";

import DatosAnimal from "./DatosAnimal";
import ReqNutricional from "./ReqNutricional";
import SeleccionProducto from "./SeleccionProducto";
import RestriccionProducto from "./RestriccionProducto";
import DietaOptima from "./DietaOptima";

export default function Dieta() {
  const [openStep, setOpenStep] = useState(1);

  // Puedes dejar estos estados si luego volverás a usarlos,
  // pero ya NO se pasan al paso 5.
  const [animal, setAnimal] = useState(null);
  const [requisitos, setRequisitos] = useState({});
  const [seleccion, setSeleccion] = useState([]);
  const [restricciones, setRestricciones] = useState([]);
  const [resultado, setResultado] = useState(null);

  const StepHeader = ({ n, title }) => {
    const active = openStep === n;
    return (
      <div
        className={`step-header ${active ? "active" : ""}`}
        onClick={() => setOpenStep(active ? 0 : n)}
      >
        <span className={`step-tri ${active ? "open" : ""}`} aria-hidden="true" />
        <span className="step-label">
          <strong>PASO {n}:</strong> {title}
        </span>
      </div>
    );
  };

  return (
    <div className="dieta-wrapper">
      <h1 className="dieta-title">Formulación de Dietas</h1>
      <div className="dieta-underline" />

      {/* PASO 1 */}
      <div className="step">
        <StepHeader n={1} title="DATOS DEL ANIMAL" />
        {openStep === 1 && (
          <div className="step-body">
            <DatosAnimal
              onSiguiente={(data) => {
                setAnimal(data);
                setOpenStep(2);
              }}
            />
          </div>
        )}
      </div>

      {/* PASO 2 */}
      <div className="step">
        <StepHeader n={2} title="REQUISITOS NUTRICIONALES DEL ANIMAL" />
        {openStep === 2 && (
          <div className="step-body">
            <ReqNutricional
              animal={animal}
              onAtras={() => setOpenStep(1)}
              onSiguiente={(req) => {
                setRequisitos(req);
                setOpenStep(3);
              }}
            />
          </div>
        )}
      </div>

      {/* PASO 3 */}
      <div className="step">
        <StepHeader n={3} title="SELECCIÓN DE PRODUCTOS ALIMENTICIOS" />
        {openStep === 3 && (
          <div className="step-body">
            <SeleccionProducto
              onAtras={() => setOpenStep(2)}
              onSiguiente={(nombres) => {
                setSeleccion(nombres);
                setOpenStep(4);
              }}
            />
          </div>
        )}
      </div>

      {/* PASO 4 */}
      <div className="step">
        <StepHeader n={4} title="RESTRICCIÓN DE PRODUCTOS ALIMENTICIOS" />
        {openStep === 4 && (
          <div className="step-body">
            <RestriccionProducto
              seleccion={seleccion}
              onAtras={() => setOpenStep(3)}
              onSiguiente={(restr) => {
                setRestricciones(restr || []);
                setOpenStep(5);
              }}
            />
          </div>
        )}
      </div>

      {/* PASO 5 */}
      <div className="step">
        <StepHeader n={5} title="FORMULACIÓN DE DIETA ÓPTIMA" />
        {openStep === 5 && (
          <div className="step-body">
            {/* 👉 Ya NO pasamos props. Solo abrimos el diseño */}
            <DietaOptima />
          </div>
        )}
      </div>
    </div>
  );
}