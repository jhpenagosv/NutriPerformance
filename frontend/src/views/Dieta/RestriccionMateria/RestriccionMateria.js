import React, { useEffect, useMemo, useState } from "react";
import "./RestriccionMateria.css";
import { message } from "../../Mensaje/Mensaje";

export default function RestriccionMateria({ DietasController, onAtras, onSiguiente }) {
  const [items, setItems] = useState([]);
  const [restr, setRestr] = useState({});

  // Cargar materias seleccionadas y restricciones previas
  useEffect(() => {
    const seleccionadas =
      DietasController?.getSeleccionadas?.() ||
      JSON.parse(localStorage.getItem("np_sel")) ||
      [];
    setItems(Array.isArray(seleccionadas) ? seleccionadas : []);

    const prev =
      DietasController?.getRestricciones?.() ||
      JSON.parse(localStorage.getItem("np_restr")) ||
      {};
    setRestr(prev && typeof prev === "object" ? prev : {});
  }, [DietasController]);

  // Filas pantalla
  const rows = useMemo(() => {
    return (items || []).map((m) => {
      const r = restr?.[m.id] || {};
      return {
        id: m.id,
        nombre: m.nombre || "",
        temporal: !!(m.temporal || m.isTemporal || m.esTemporal),
        costo: r.costo ?? "",
        min: r.min ?? "",
        max: r.max ?? "",
      };
    });
  }, [items, restr]);

  // Helpers
  const setField = (id, field, value) => {
    setRestr((prev) => ({
      ...prev,
      [id]: {
        ...(prev?.[id] || {}),
        [field]: value,
      },
    }));
  };

  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return NaN;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };

  // Validación (costo obligatorio y numérico >= 0; min/max opcionales)
  const validar = () => {
    if (!rows.length) {
      message.alert({
        title: "Selecciona materias",
        text: "Debes haber confirmado al menos una materia prima en el paso anterior.",
        buttonText: "Entendido",
      });
      return false;
    }

    for (const r of rows) {
      const costoN = toNum(r.costo);
      if (r.costo === "" || !Number.isFinite(costoN) || costoN < 0) {
        message.alert({
          title: "Costo inválido",
          text: `Ingresa un costo válido (≥ 0) para "${r.nombre}".`,
          buttonText: "Corregir",
        });
        return false;
      }

      const mn = r.min !== "" ? toNum(r.min) : undefined;
      const mx = r.max !== "" ? toNum(r.max) : undefined;

      if (r.min !== "" && (!Number.isFinite(mn) || mn < 0)) {
        message.alert({
          title: "Mínimo inválido",
          text: `Revisa el mínimo de "${r.nombre}". Si no deseas definirlo, deja el campo vacío.`,
          buttonText: "Corregir",
        });
        return false;
      }

      if (r.max !== "" && (!Number.isFinite(mx) || mx < 0)) {
        message.alert({
          title: "Máximo inválido",
          text: `Revisa el máximo de "${r.nombre}". Si no deseas definirlo, deja el campo vacío.`,
          buttonText: "Corregir",
        });
        return false;
      }

      if (r.min !== "" && r.max !== "" && mn > mx) {
        message.alert({
          title: "Rango inválido",
          text: `En "${r.nombre}", el mínimo no puede ser mayor que el máximo.`,
          buttonText: "Corregir",
        });
        return false;
      }
    }
    return true;
  };

  // Confirmar restricciones → enviar payload con COSTO incluido
  const handleConfirm = async () => {
    if (!validar()) return;

    const salida = {};
    const rowsPayload = [];

    for (const r of rows) {
      const costoN = toNum(r.costo);
      const obj = {
        idMateria: r.id,
        nombre: r.nombre,
        tipo: r.temporal ? "Temporal" : "Banco",
        costo: Number.isFinite(costoN) ? costoN : null, // << COSTO numérico
        minPctMS: r.min === "" ? null : toNum(r.min),
        maxPctMS: r.max === "" ? null : toNum(r.max),
        unidad: "% MS",
      };

      salida[r.id] = {
        costo: obj.costo,            // << COSTO en byId
        minPctMS: obj.minPctMS,
        maxPctMS: obj.maxPctMS,
        unidad: obj.unidad,
      };
      rowsPayload.push(obj);
    }

    const payloadPaso4 = {
      rows: rowsPayload, // << Incluye 'costo' por fila
      byId: salida,      // << Incluye 'costo' por id
    };

    // Persistencia y notificación
    DietasController?.setRestricciones?.(salida);
    localStorage.setItem("np_restr", JSON.stringify(salida));
    localStorage.setItem("np_sel", JSON.stringify(items));
    localStorage.setItem("np_restriccionMateria", JSON.stringify(payloadPaso4));

    message.success("Restricciones guardadas correctamente.", "Hecho");

    // Avanzar enviando el payload (con costo)
    onSiguiente?.(payloadPaso4);
  };

  // Render
  return (
    <div className="restm-wrap">
      {/* Encabezado */}
      <div className="restm-header-grid">
        <div className="col">Materia prima <span className="req">*</span></div>
        <div className="col">Costo <span className="pill neutral">$/kg</span></div>
        <div className="col">Restricción mínima <span className="pill">% MS</span></div>
        <div className="col">Restricción máxima <span className="pill">% MS</span></div>
      </div>
      <div className="restm-underline" />

      {/* Filas */}
      <div className="restm-rows">
        {rows.length === 0 ? (
          <div className="restm-empty">
            No hay materias seleccionadas. Vuelve al paso anterior y confirma al menos una.
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="restm-row">
              {/* Nombre + pill Temporal */}
              <div className="col">
                <div className="restm-name-wrap">
                  <span className="restm-name" title={r.nombre}>{r.nombre}</span>
                  {r.temporal && <span className="pill neutral">Temporal</span>}
                </div>
              </div>

              {/* Costo ($/kg) */}
              <div className="col">
                <div className="restm-input-wrap restm-suffix--usd">
                  <input
                    className="restm-input"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={r.costo}
                    onChange={(e) => setField(r.id, "costo", e.target.value)}
                    aria-label={`Costo de ${r.nombre} ($/kg)`}
                  />
                </div>
              </div>

              {/* Min (% MS) */}
              <div className="col">
                <div className="restm-input-wrap restm-suffix--kg">
                  <input
                    className="restm-input"
                    inputMode="decimal"
                    placeholder="(opcional)"
                    value={r.min}
                    onChange={(e) => setField(r.id, "min", e.target.value)}
                    aria-label={`Mínimo de ${r.nombre} (% MS)`}
                  />
                </div>
              </div>

              {/* Max (% MS) */}
              <div className="col">
                <div className="restm-input-wrap restm-suffix--kg">
                  <input
                    className="restm-input"
                    inputMode="decimal"
                    placeholder="(opcional)"
                    value={r.max}
                    onChange={(e) => setField(r.id, "max", e.target.value)}
                    aria-label={`Máximo de ${r.nombre} (% MS)`}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botones */}
      <div className="restm-actions">
        <button type="button" className="btn ghost" onClick={onAtras}>
          Atrás
        </button>
        <button type="button" className="btn gold" onClick={handleConfirm}>
          Confirmar y continuar
        </button>
      </div>
    </div>
  );
}
