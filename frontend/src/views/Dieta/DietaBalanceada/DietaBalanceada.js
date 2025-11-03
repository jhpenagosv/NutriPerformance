import React from "react";
import "./DietaBalanceada.css";
import { useDietaBalanceadaController } from "../../../controllers/DietaBalanceadaController";

export default function DietaBalanceada({
    DietasController,
    datosAnimal,
    reqNutricional,
    restriccionMateria,   // ← llega desde Paso 4
    onAtras,
}) {
    const {
        infoGeneral,
        materiasConDetalles,
        detalleKeys,
    } = useDietaBalanceadaController(DietasController, datosAnimal);

    const fmtNum = (v) =>
        v === null || v === undefined || v === ""
            ? "—"
            : Number.isFinite(Number(v))
                ? Number(v).toFixed(2)
                : String(v);

    // ===== Requisitos nutricionales (solo padres) =====
    const rnRows = Array.isArray(reqNutricional?.rows) ? reqNutricional.rows : [];
    const rnParentRows = rnRows.filter((r) => !r.isChild);

    // ===== Restricciones por materia (desde Paso 4) =====
    // Esperado: restriccionMateria.rows = [{ idMateria, nombre, tipo, costo, minPctMS, maxPctMS, unidad }, ...]
    const restrRows = Array.isArray(restriccionMateria?.rows) ? restriccionMateria.rows : [];

    return (
        <div className="dbal">
            {/* ===== 1) Información General ===== */}
            <section className="dbal-info">
                <h2 className="dbal-title">Información General</h2>
                <div className="dbal-grid">
                    <Cell label="Raza" value={infoGeneral.raza} />
                    <Cell label="Sistema" value={infoGeneral.sistema} />
                    <Cell label="Sexo" value={infoGeneral.sexo} />
                    <Cell label="Peso Inicial" value={fmtNum(infoGeneral.pesoInicial) + " kg"} />
                    <Cell label="Peso Final" value={fmtNum(infoGeneral.pesoFinal) + " kg"} />
                    <Cell label="Peso Medio" value={fmtNum(infoGeneral.pesoMedio) + " kg"} />
                    <Cell label="Peso Diario" value={fmtNum(infoGeneral.pesoDiario) + " kg/d"} />
                    <Cell label="Temperatura Máx." value={fmtNum(infoGeneral.tempMax) + " °C"} />
                    <Cell label="Humedad" value={fmtNum(infoGeneral.humedad) + " %"} />
                </div>
            </section>

            {/* ===== 2) Restricciones por materia (ANTES) ===== */}
            {restrRows.length ? (
                <section className="dbal-rest">
                    <h2 className="dbal-title">Restricciones por materia</h2>
                    <div className="dbal-table-container">
                        <table className="dbal-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Materia prima</th>
                                    <th>Tipo</th>
                                    <th>Costo ($/kg)</th>
                                    <th>Min. (% MS)</th>
                                    <th>Max. (% MS)</th>
                                    <th>Unidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restrRows.map((r, i) => (
                                    <tr key={r.idMateria ?? i}>
                                        <td>{i + 1}</td>
                                        <td>{r.nombre || "—"}</td>
                                        <td>{r.tipo || "—"}</td>
                                        <td>{fmtNum(r.costo)}</td>
                                        <td>{fmtNum(r.minPctMS)}</td>
                                        <td>{fmtNum(r.maxPctMS)}</td>
                                        <td>{r.unidad || "% MS"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            {/* ===== 3) Requisitos nutricionales utilizados (solo padres) ===== */}
            {rnParentRows.length ? (
                <section className="dbal-rn">
                    <h2 className="dbal-title">Requisitos nutricionales utilizados</h2>
                    <div className="dbal-table-container">
                        <table className="dbal-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Req. nutricional</th>
                                    <th>Sigla</th>
                                    <th>Unidad</th>
                                    <th>Req. Mínimo</th>
                                    <th>Req. Máximo</th>
                                    <th>Req. Obtenido</th> {/* NUEVA COLUMNA */}
                                    <th>Estado</th>        {/* NUEVA COLUMNA */}
                                </tr>
                            </thead>
                            <tbody>
                                {rnParentRows.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.nombre || "—"}</td>
                                        <td>{r.sigla || "—"}</td>
                                        <td>{r.unidad || "—"}</td>
                                        <td>{fmtNum(r.min)}</td>
                                        <td>{r.max == null ? "—" : fmtNum(r.max)}</td>
                                        <td>—</td>            {/* Req. Obtenido (placeholder) */}
                                        <td>—</td>            {/* Estado (placeholder) */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            {/* ===== 4) Detalles bromatológicos ===== */}
            <section className="dbal-detalle">
                <h2 className="dbal-title">Detalles Bromatológicos de Materias</h2>

                {!materiasConDetalles || materiasConDetalles.length === 0 ? (
                    <div className="dbal-empty">No hay materias confirmadas para mostrar.</div>
                ) : (
                    <div className="dbal-table-container">
                        <table className="dbal-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Materia prima</th>
                                    <th>Tipo</th>
                                    {detalleKeys.map((k) => (
                                        <th key={k}>{k}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {materiasConDetalles.map((row, i) => (
                                    <tr key={row.id}>
                                        <td>{i + 1}</td>
                                        <td>{row.nombre}</td>
                                        <td>{row.temporal ? "Temporal" : "Banco"}</td>
                                        {detalleKeys.map((k) => (
                                            <td key={k}>{fmtNum(row.valores[k])}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div className="dbal-actions">
                <button className="dbal-btn" onClick={onAtras}>Atrás</button>
            </div>
        </div>
    );
}

function Cell({ label, value }) {
    return (
        <div className="dbal-cell">
            <span className="dbal-label">{label}:</span>
            <span className="dbal-value">{value || "—"}</span>
        </div>
    );
}
