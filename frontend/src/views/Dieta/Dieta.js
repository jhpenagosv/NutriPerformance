import React, { useState, useCallback } from "react";
import "./Dieta.css";

// PASOS
import DatosAnimal from "./DatosAnimal/DatosAnimal";
import ReqNutricional from "./ReqNutricional/reqNutricional";
import SeleccionMateria from "./SeleccionarMateria/SeleccionMateria";
import RestriccionMateria from "./RestriccionMateria/RestriccionMateria";
import DietaBalanceada from "./DietaBalanceada/DietaBalanceada";

// Controlador central
import { DietasController } from "../../controllers/DietasController";

function Item({ index, title, active, onToggle, children, panelId, headerId }) {
    return (
        <div className="diet-acc-item">
            <button
                id={headerId}
                className="diet-acc-header"
                onClick={onToggle}
                aria-expanded={active}
                aria-controls={panelId}
                type="button"
            >
                <span className={`diet-caret ${active ? "rot" : ""}`} />
                <span className="diet-acc-title">{index}. {title}</span>
            </button>

            {active && (
                <div id={panelId} className="diet-acc-panel" role="region" aria-labelledby={headerId}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default function Dieta() {
    const [active, setActive] = useState(1);
    const goto = useCallback((n) => setActive(n), []);

    // Paso 1 → Datos del animal
    const [datosAnimal, setDatosAnimal] = useState(null);

    // Paso 2 → Requisitos nutricionales
    const [reqNutricional, setReqNutricional] = useState(null);

    // Paso 4 → Restricciones por materia
    const [restriccionMateria, setRestriccionMateria] = useState(null);

    // 1 -> 2
    const nextFrom1 = useCallback((payloadPaso1) => {
        setDatosAnimal(payloadPaso1);
        try { localStorage.setItem("np_datosAnimal", JSON.stringify(payloadPaso1)); } catch { }
        goto(2);
    }, [goto]);

    // 2 -> 3
    const nextFrom2 = useCallback((payloadPaso2) => {
        setReqNutricional(payloadPaso2);
        try { localStorage.setItem("np_reqNutricional", JSON.stringify(payloadPaso2)); } catch { }
        goto(3);
    }, [goto]);

    // 3 -> 4
    const nextFrom3 = useCallback(() => goto(4), [goto]);

    // 4 -> 5  (recibe payload con restricciones)
    const nextFrom4 = useCallback((payloadPaso4) => {
        setRestriccionMateria(payloadPaso4);
        try { localStorage.setItem("np_restriccionMateria", JSON.stringify(payloadPaso4)); } catch { }
        goto(5);
    }, [goto]);

    // atrás
    const prevFrom2 = useCallback(() => goto(1), [goto]);
    const prevFrom3 = useCallback(() => goto(2), [goto]);
    const prevFrom4 = useCallback(() => goto(3), [goto]);
    const prevFrom5 = useCallback(() => goto(4), [goto]);

    return (
        <div className="diet-page">
            <h2 className="diet-title">Formule una dieta</h2>
            <div className="diet-underline" />

            <div className="diet-acc">
                {/* PASO 1 */}
                <Item
                    index={1}
                    title="Datos del animal"
                    active={active === 1}
                    onToggle={() => setActive((s) => (s === 1 ? 0 : 1))}
                    panelId="diet-panel-1"
                    headerId="diet-header-1"
                >
                    <DatosAnimal onSiguiente={nextFrom1} />
                </Item>

                {/* PASO 2 */}
                <Item
                    index={2}
                    title="Requisitos nutricionales"
                    active={active === 2}
                    onToggle={() => setActive((s) => (s === 2 ? 0 : 2))}
                    panelId="diet-panel-2"
                    headerId="diet-header-2"
                >
                    <ReqNutricional
                        datosAnimal={datosAnimal}
                        onAtras={prevFrom2}
                        onSiguiente={nextFrom2}
                    />
                </Item>

                {/* PASO 3 */}
                <Item
                    index={3}
                    title="Selección de materias primas"
                    active={active === 3}
                    onToggle={() => setActive((s) => (s === 3 ? 0 : 3))}
                    panelId="diet-panel-3"
                    headerId="diet-header-3"
                >
                    <SeleccionMateria
                        DietasController={DietasController}
                        onAtras={prevFrom3}
                        onSiguiente={nextFrom3}
                    />
                </Item>

                {/* PASO 4 */}
                <Item
                    index={4}
                    title="Restricciones por materia"
                    active={active === 4}
                    onToggle={() => setActive((s) => (s === 4 ? 0 : 4))}
                    panelId="diet-panel-4"
                    headerId="diet-header-4"
                >
                    <RestriccionMateria
                        DietasController={DietasController}
                        onAtras={prevFrom4}
                        onSiguiente={nextFrom4}   // <-- ahora recibe payload
                    />
                </Item>

                {/* PASO 5 */}
                <Item
                    index={5}
                    title="Dieta balanceada"
                    active={active === 5}
                    onToggle={() => setActive((s) => (s === 5 ? 0 : 5))}
                    panelId="diet-panel-5"
                    headerId="diet-header-5"
                >
                    <DietaBalanceada
                        DietasController={DietasController}
                        datosAnimal={datosAnimal}
                        reqNutricional={reqNutricional}
                        restriccionMateria={restriccionMateria}   // <-- nueva prop
                        onAtras={prevFrom5}
                    />
                </Item>
            </div>
        </div>
    );
}
