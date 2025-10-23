import React, { useEffect, useState } from "react";
import "./RestriccionProducto.css";
import MensajeInformacion from "../MensajesDialogos/mensaje_informacion";

export default function RestriccionProducto({
  seleccion = [],
  value = [],
  onAtras,
  onSiguiente,
}) {

  const makeFromProps = () => {
    if (Array.isArray(value) && value.length) {
      return value.map((r) => ({
        name: r.name ?? "",
        costo: r.costo ?? "",
        min: r.min ?? "",
        max: r.max ?? "",
      }));
    }
    return (seleccion || []).map((name) => ({
      name,
      costo: "",
      min: "",
      max: "",
    }));
  };

  /* ---------- estado ---------- */
  const [rows, setRows] = useState(() => makeFromProps());
  const [mensaje, setMensaje] = useState("");
  const [info, setInfo] = useState({ open: false, message: "", type: "warning" }); // ⚠️ panel informativo

  /* ---------- sincronización segura ---------- */
  const selKey = JSON.stringify(seleccion || []);
  const valKey = JSON.stringify(value || []);
  const isSameRows = (a, b) =>
    a.length === b.length &&
    a.every((r, i) =>
      r.name === b[i].name &&
      String(r.costo) === String(b[i].costo) &&
      String(r.min) === String(b[i].min) &&
      String(r.max) === String(b[i].max)
    );

  useEffect(() => {
    const next = makeFromProps();
    setRows((prev) => (isSameRows(prev, next) ? prev : next));
  }, [selKey, valKey]);

  /* ---------- handlers ---------- */
  const updateCell = (idx, field, val) => {
    setRows((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleNext = () => {
    if (!rows.length) {
      setMensaje("No hay productos seleccionados para restringir.");
      return;
    }


    const incompletos = rows.filter((r) => !r.costo || r.costo.trim() === "");
    if (incompletos.length > 0) {
      setInfo({
        open: true,
        message: "Por favor, completa todos los costos antes de continuar.",
        type: "warning",
      });
      return;
    }

    onSiguiente?.(rows);
  };

  /* ---------- UI ---------- */
  return (
    <section className="rp-card">
      <h2 className="rp-title">Restricciones</h2>
      <div className="rp-underline" />

      {rows.length === 0 ? (
        <div className="rp-empty">No hay productos seleccionados.</div>
      ) : (
        <div className="rp-table">
          <div className="rp-header">
            <div>Producto</div>
            <div>Costo</div>
            <div>Mínimo</div>
            <div>Máximo</div>
          </div>

          {rows.map((r, i) => (
            <div className="rp-row" key={r.name || i}>
              <div className="rp-cell rp-name">{r.name}</div>
              <div className="rp-cell">
                <input
                  className="rp-input"
                  type="number"
                  step="any"
                  placeholder="Costo"
                  value={r.costo}
                  onChange={(e) => updateCell(i, "costo", e.target.value)}
                />
              </div>
              <div className="rp-cell">
                <input
                  className="rp-input"
                  type="number"
                  step="any"
                  placeholder="Mín"
                  value={r.min}
                  onChange={(e) => updateCell(i, "min", e.target.value)}
                />
              </div>
              <div className="rp-cell">
                <input
                  className="rp-input"
                  type="number"
                  step="any"
                  placeholder="Máx"
                  value={r.max}
                  onChange={(e) => updateCell(i, "max", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {mensaje && <div className="rp-warn">{mensaje}</div>}

      <div className="rp-actions">
        <button className="rp-btn rp-btn-outline" onClick={onAtras}>
          Atrás
        </button>
        <button className="rp-btn rp-btn-primary" onClick={handleNext}>
          Siguiente
        </button>
      </div>

      <MensajeInformacion
        open={info.open}
        title="Atención"
        message={info.message}
        type={info.type}
        onClose={() => setInfo({ open: false, message: "", type: "info" })}
      />
    </section>
  );
}
