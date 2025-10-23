import React, { useEffect, useMemo, useState } from "react";
import "./ReqNutricional.css";

import { NUTRIENTES } from "../../models/nutriente.model";
import { fmt10_4 } from "../../utils/numberFormat";

/** Unidades por sigla */
const UNITS = {
  MS: "kg/día", EE: "kg/día", EM: "Mcal/día", CSF: "kg/día", FDN: "Mcal/día",
  NDT: "kg/día", EN: "Mcal/día", PDR: "g/día", PND: "g/día", PC: "g/día",
  PM: "g/día", Ca: "g/día", P: "g/día", Mg: "g/día", K: "g/día", Na: "g/día",
  S: "g/día", Co: "mg/día", Cu: "mg/día", I: "mg/día", Mn: "mg/día",
  Se: "mg/día", Zn: "mg/día",
};

/** Ítems expandibles (solo Magnesio - Mg) */
const ALLOW_DETAILS = new Set(["Mg"]);

/** Subtabla configurada solo para Magnesio */
const SUBTABLE_CONFIG = {
  Mg: {
    siglas: ["MgLg", "MgLT", "MgDm", "MgDg"],
    medida: "(g/d)",
  },
};

/** Generar filas desde el modelo base */
function buildRows(fromObj) {
  const src = fromObj ?? {};
  return NUTRIENTES.map((n, idx) => ({
    id: idx + 1,
    code: n.code,
    label: n.label,
    unidad: UNITS[n.code] || "—",
    valor: fmt10_4(src[n.code] ?? ""),
  }));
}

export default function ReqNutricional({ value, onBack, onNext, onSiguiente }) {
  const [rows, setRows] = useState(() => buildRows(value ?? {}));
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setRows(buildRows(value ?? {}));
  }, [value]);

  const requisitos = useMemo(() => {
    const out = {};
    rows.forEach((r) => {
      const n = (typeof r.valor === "string" ? Number(r.valor.replace(",", ".")) : Number(r.valor));
      out[r.code] = Number.isFinite(n) ? Number(n.toFixed(4)) : "";
    });
    return out;
  }, [rows]);

  const toggleRow = (row) => {
    if (!ALLOW_DETAILS.has(row.code)) return;
    setOpenId((curr) => (curr === row.id ? null : row.id));
  };

  const handleNext = () => {
    (onNext || onSiguiente)?.({ requisitos });
  };

  return (
    <div className="req-wrapper">
      <section className="req-card">
        <h2 className="req-card__title">Requisitos nutricionales</h2>
        <div className="req-card__underline" />

        <div className="table-wrap">
          <table className="req-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                <th className="col-label">Req. nutricionales</th>
                <th className="col-sigla">Sigla</th>
                <th className="col-medida">Medida</th>
                <th className="col-valor">Requisitos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((n) => {
                const isOpen = openId === n.id;
                const isInteractive = ALLOW_DETAILS.has(n.code);

                return (
                  <React.Fragment key={`${n.code}-${n.id}`}>
                    {/* Fila principal */}
                    <tr
                      className={`req-row ${isInteractive ? "interactive" : ""} ${isOpen ? "is-open" : ""}`}
                      onClick={() => toggleRow(n)}
                      role={isInteractive ? "button" : undefined}
                      tabIndex={isInteractive ? 0 : -1}
                      title={isInteractive ? "Desplegar detalles" : undefined}
                    >
                      <td className="col-id">
                        {isInteractive && (
                          <span
                            className={`req-expand-icon ${isOpen ? "open" : ""}`}
                            aria-hidden
                          >
                            ▸
                          </span>
                        )}
                        {n.id}
                      </td>
                      <td className="col-label">{n.label}</td>
                      <td className="col-sigla sigla">{n.code}</td>
                      <td className="col-medida"><span className="unidad">{n.unidad}</span></td>
                      <td className="col-valor">
                        <input
                          className="input input-valor"
                          type="number"
                          inputMode="decimal"
                          value={n.valor}
                          readOnly
                        />
                      </td>
                    </tr>

                    {/* Subtabla solo para Mg */}
                    {isInteractive && isOpen && (
                      <tr className="req-detail">
                        <td colSpan={5}>
                          {(() => {
                            const cfg = SUBTABLE_CONFIG[n.code];
                            const baseId = n.id;
                            return (
                              <div className="req-subtable-wrap">
                                <table className="req-subtable">
                                  <thead>
                                    <tr>
                                      <th className="sub-col-id">ID</th>
                                      <th className="sub-col-req">requisito</th>
                                      <th className="sub-col-sigla">sigla</th>
                                      <th className="sub-col-medida">medida</th>
                                      <th className="sub-col-valor">requisitos</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cfg.siglas.map((sg, i) => (
                                      <tr key={`${n.code}-${sg}`}>
                                        <td className="sub-col-id">{`${baseId}.${i + 1}`}</td>
                                        <td className="sub-col-req">{n.label}</td>
                                        <td className="sub-col-sigla">{sg}</td>
                                        <td className="sub-col-medida">{cfg.medida}</td>
                                        <td className="sub-col-valor">
                                          <input
                                            className="input input-valor as-text"
                                            value=""
                                            readOnly
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="req-actions">
          <button type="button" className="btn btn-primary-outline" onClick={() => onBack?.()}>
            Atrás
          </button>
          <button type="button" className="btn btn-primary" onClick={handleNext}>
            Siguiente
          </button>
        </div>
      </section>
    </div>
  );
}
