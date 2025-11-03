import React, { useMemo } from "react";
import "./reqNutricional.css";
import { useReqNutricionalController } from "../../../controllers/ReqNutricionalController";

export default function ReqNutricional({ datosAnimal, onAtras, onSiguiente }) {
    // Controlador/jerarquía y estado del acordeón
    const {
        topLevel,             // [{ id, nombre, sigla, unidad }, ...] (padres)
        childrenByParent,     // { [parentId]: [{ id, nombre, sigla, unidad }, ...] }
        parentsWithChildren,  // Set(ids de padres con hijos)
        isOpen,               // (id) => bool
        toggle,               // (id) => void
    } = useReqNutricionalController();

    // Del Paso 1: resultados (mínimos) y su orden de salida
    const resultados = datosAnimal?.resultados || {};
    const order = Array.isArray(datosAnimal?.order) ? datosAnimal.order : [];
    const controlValue = datosAnimal?.controlValue; // <- se usa para ocultar 4/5

    // Helpers de visibilidad (umbral 340) — como tu versión original
    const isNum = (v) => typeof v === "number" && Number.isFinite(v);
    const showId4 = (cv) => (isNum(cv) ? cv < 340 : true);
    const showId5 = (cv) => (isNum(cv) ? cv > 340 : true);

    // Construimos el orden renderizado (padres + hijos)
    const renderOrderIds = useMemo(() => {
        const list = [];
        topLevel.forEach((r) => {
            list.push(r.id);
            (childrenByParent[r.id] || []).forEach((child) => list.push(child.id));
        });
        return list;
    }, [topLevel, childrenByParent]);

    // Tomamos los valores mínimos según el orden que entrega el motor (Paso 1)
    const valuesInOrder = useMemo(
        () => (order.length ? order.map((k) => resultados[k]) : []),
        [order, resultados]
    );

    // id -> valor mínimo (alineando por índice con renderOrderIds)
    const idToMin = useMemo(() => {
        const map = {};
        const N = Math.min(renderOrderIds.length, valuesInOrder.length);
        for (let i = 0; i < N; i++) map[renderOrderIds[i]] = valuesInOrder[i];
        return map;
    }, [renderOrderIds, valuesInOrder]);

    // Lista de % máximos (por índice de PADRE visible)
    const MAX_PCT_LIST = [
        110, 105, 105, 110, 110, 200, 200, 300, 600, 300,
        160, 300, 2000, 200, 300, 579, 300, 1998, 232, 139, 165,
    ];

    // Padres visibles respetando la regla 4/5
    const visibleParents = useMemo(() => {
        return topLevel
            .filter((row) => {
                if (row.id === "4" && !showId4(controlValue)) return false;
                if (row.id === "5" && !showId5(controlValue)) return false;
                return true;
            })
            .map((r) => r.id);
    }, [topLevel, controlValue]);

    // Máximos por padre visible (el último no tiene máximo)
    const parentIdToMaxFiltered = useMemo(() => {
        const map = {};
        if (!visibleParents.length) return map;
        const lastParentId = visibleParents[visibleParents.length - 1];
        visibleParents.forEach((pid, idx) => {
            if (pid === lastParentId) {
                map[pid] = undefined;
                return;
            }
            const pct = MAX_PCT_LIST[idx];
            const minVal = idToMin[pid];
            if (typeof pct === "number" && Number.isFinite(minVal)) {
                map[pid] = minVal * (pct / 100);
            } else {
                map[pid] = undefined;
            }
        });
        return map;
    }, [visibleParents, idToMin]);

    const fmt2 = (v) =>
        typeof v === "number" && Number.isFinite(v) ? v.toFixed(2) : "—";

    // Construir y enviar payload del Paso 2 (ya filtrado)
    const handleNextStep = () => {
        const rows = [];

        topLevel.forEach((row) => {
            // Respeta la visibilidad 4/5
            if (row.id === "4" && !showId4(controlValue)) return;
            if (row.id === "5" && !showId5(controlValue)) return;

            const minParent = idToMin[row.id];
            const maxParent = parentIdToMaxFiltered[row.id];

            rows.push({
                id: row.id,
                nombre: row.nombre,
                sigla: row.sigla,
                unidad: row.unidad,
                min: Number.isFinite(minParent) ? minParent : null,
                max: Number.isFinite(maxParent) ? maxParent : null,
                isChild: false,
            });

            // Hijos (no tienen máximo)
            (childrenByParent[row.id] || []).forEach((child) => {
                const minChild = idToMin[child.id];
                rows.push({
                    id: child.id,
                    nombre: child.nombre,
                    sigla: child.sigla,
                    unidad: child.unidad,
                    min: Number.isFinite(minChild) ? minChild : null,
                    max: null,
                    isChild: true,
                });
            });
        });

        const payloadPaso2 = {
            order: rows.map((r) => r.id), // ya sin 4/5 si estaban ocultos
            rows,
            minById: rows.reduce((m, r) => ((m[r.id] = r.min), m), {}),
            maxById: rows.reduce((m, r) => ((m[r.id] = r.max), m), {}),
        };

        if (typeof onSiguiente === "function") onSiguiente(payloadPaso2);
    };

    return (
        <section className="rn page">
            <div className="rn__wrap">
                <div className="rn__scroll">
                    <table className="rn__table">
                        <thead>
                            <tr className="rn__head">
                                <th>ID</th>
                                <th>Req. nutricionales</th>
                                <th>Sigla</th>
                                <th>Medida</th>
                                <th>Requisitos mínimos</th>
                                <th>Requisitos máximos</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {topLevel.map((row) => {
                                // Oculta 4 o 5 según controlValue
                                if (row.id === "4" && !showId4(controlValue)) return null;
                                if (row.id === "5" && !showId5(controlValue)) return null;

                                const hasChildren = parentsWithChildren.has(row.id);
                                const open = isOpen(row.id);

                                const minParent = idToMin[row.id];
                                const maxParent = parentIdToMaxFiltered[row.id];

                                return (
                                    <React.Fragment key={row.id}>
                                        <tr className={open ? "is-open-parent" : ""}>
                                            <td>{row.id}</td>
                                            <td>{row.nombre}</td>
                                            <td>{row.sigla}</td>
                                            <td>{row.unidad}</td>
                                            <td>{fmt2(minParent)}</td>
                                            <td>{fmt2(maxParent)}</td>
                                            <td className="rn__actions">
                                                {hasChildren && (
                                                    <button
                                                        className={`rn__iconbtn ${open ? "is-open" : ""}`}
                                                        onClick={() => toggle(row.id)}
                                                        title={open ? "Contraer" : "Desplegar"}
                                                    >
                                                        <svg
                                                            className="rn__icon"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle
                                                                cx="11"
                                                                cy="11"
                                                                r="7"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                fill="none"
                                                            />
                                                            <line
                                                                x1="16.65"
                                                                y1="16.65"
                                                                x2="21"
                                                                y2="21"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>

                                        {(childrenByParent[row.id] || []).map((child) => {
                                            const minChild = idToMin[child.id];
                                            return (
                                                <tr
                                                    key={child.id}
                                                    className={`rn__child ${open ? "" : "is-hidden"}`}
                                                >
                                                    <td>{child.id}</td>
                                                    <td className="rn__child-name">{child.nombre}</td>
                                                    <td>{child.sigla}</td>
                                                    <td>{child.unidad}</td>
                                                    <td>{fmt2(minChild)}</td>
                                                    <td>—</td>
                                                    <td></td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="step-buttons">
                <button className="btn-step btn-prev" onClick={onAtras}>
                    Atrás
                </button>
                <button className="btn-step btn-next" onClick={handleNextStep}>
                    Siguiente
                </button>
            </div>
        </section>
    );
}
