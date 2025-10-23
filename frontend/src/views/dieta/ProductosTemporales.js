import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./ProductosTemporales.css";

const STORAGE_KEY = "np_productos_temporales_v1";

/* Campos numéricos (decimal 10,4) */
const NUMERIC_FIELDS = [
  { code: "MS",  label: "Materia seca" },
  { code: "EE",  label: "Extracto de éter" },
  { code: "EM",  label: "Energía metabolizable" },
  { code: "CSF", label: "Carbohidratos sin fibra" },
  { code: "FDN", label: "Fibra detergente neutra" },
  { code: "NDT", label: "Nutrientes digestibles totales" },
  { code: "EN",  label: "Energía neta" },
  { code: "PDR", label: "Proteína degradable en el rumen" },
  { code: "PND", label: "Proteína no degradable en el rumen" },
  { code: "PC",  label: "Proteína cruda" },
  { code: "PM",  label: "Proteína metabolizable" },
  { code: "Ca",  label: "Calcio" },
  { code: "P",   label: "Fósforo" },
  { code: "Mg",  label: "Magnesio" },
  { code: "K",   label: "Potasio" },
  { code: "Na",  label: "Sodio" },
  { code: "S",   label: "Azufre" },
  { code: "Co",  label: "Cobalto" },
  { code: "Cu",  label: "Cobre" },
  { code: "I",   label: "Yodo" },
  { code: "Mn",  label: "Manganeso" },
  { code: "Se",  label: "Selenio" },
  { code: "Zn",  label: "Zinc" },
];

// regex: hasta 6 enteros y hasta 4 decimales (precision 10, scale 4)
const DEC_10_4 = /^\d{1,6}(\.\d{0,4})?$/;

function sanitize10_4(raw) {
  if (raw === "") return "";
  let s = raw.replace(/[^\d.]/g, "");
  const parts = s.split(".");
  if (parts.length > 2) s = parts[0] + "." + parts.slice(1).join("").replace(/\./g, "");
  const [intRaw, fracRaw] = s.split(".");
  let int = (intRaw || "").replace(/^0+(?=\d)/, "");
  if (int === "") int = intRaw === "" ? "" : "0";
  int = int.slice(0, 6);
  const frac = (fracRaw || "").slice(0, 4);
  if (s.endsWith(".") && fracRaw === undefined) return (int || "0") + ".";
  return fracRaw !== undefined ? `${int || "0"}.${frac}` : int;
}
function isValid10_4(v) { return v === "" || DEC_10_4.test(v); }

function readTemporales() {
  try {
    const a = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(a) ? a : [];
  } catch { return []; }
}
function saveTemporales(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/**
 * Modal de Productos Temporales
 * @param {boolean} open     - controla si se muestra
 * @param {function} onClose - cierra el modal
 * @param {function} onGuardar - callback (payload, listaActual) tras guardar OK
 * @param {function} onSaved   - (compat) mismo que onGuardar
 */
export default function ProductosTemporales({ open = false, onClose, onGuardar, onSaved }) {
  // Efectos de entorno
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Estado del formulario
  const [materiaPrima, setMateriaPrima] = useState("");
  const [nums, setNums] = useState(() =>
    NUMERIC_FIELDS.reduce((acc, f) => { acc[f.code] = ""; return acc; }, {})
  );
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);

  // Aviso de guardado (junto a los botones)
  const [notice, setNotice] = useState(null); // {type:'success'|'error', text}
  const noticeTimerRef = useRef(null);
  useEffect(() => () => { if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current); }, []);

  const materiaPrimaLen = materiaPrima.length;

  const errors = useMemo(() => {
    const e = {};
    if (!materiaPrima.trim()) e.materia_prima = "Requerido.";
    if (materiaPrimaLen > 100) e.materia_prima = "Máximo 100 caracteres.";
    NUMERIC_FIELDS.forEach(({ code }) => {
      const v = nums[code];
      if (v !== "" && !isValid10_4(v)) e[code] = "Formato 10,4. Ej: 123456.1234";
    });
    return e;
  }, [materiaPrima, materiaPrimaLen, nums]);

  const canSave = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const setNum = (code, raw) => setNums((p) => ({ ...p, [code]: sanitize10_4(raw) }));
  const handleBlur = (name) => setTouched((p) => ({ ...p, [name]: true }));

  const handleSave = () => {
    setTouched((p) => {
      const all = { ...p, materia_prima: true };
      NUMERIC_FIELDS.forEach(({ code }) => (all[code] = true));
      return all;
    });
    if (!canSave) return;

    setSaving(true);
    try {
      const payload = {
        materia_prima: materiaPrima.trim().slice(0, 100),
        ...NUMERIC_FIELDS.reduce((acc, { code }) => {
          let v = nums[code];
          if (v === "" || v === ".") v = "0";
          if (/\.$/.test(v)) v = v.slice(0, -1);
          acc[code] = Number(v);
          return acc;
        }, {}),
        __ts: Date.now(),
      };

      // Guardar en storage y obtener lista actualizada
      const nextArr = [...readTemporales(), payload];
      saveTemporales(nextArr);

      // Notificar al padre (Selección de productos)
      onGuardar?.(payload, nextArr);
      onSaved?.(payload, nextArr); // compat

      // Reset del formulario
      setMateriaPrima("");
      setNums(NUMERIC_FIELDS.reduce((a, f) => ((a[f.code] = ""), a), {}));
      setTouched({});

      // Aviso de éxito
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      setNotice({ type: "success", text: "Producto temporal guardado correctamente." });
      noticeTimerRef.current = setTimeout(() => setNotice(null), 3000);
    } catch (e) {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
      setNotice({ type: "error", text: "Ocurrió un error al guardar." });
      noticeTimerRef.current = setTimeout(() => setNotice(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="pt-overlay" onClick={() => onClose?.()}>
      <div
        className="pt-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pt-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="pt-header">
          <h2 id="pt-title" className="pt-title">Agregar productos temporales</h2>
          <button className="pt-close" aria-label="Cerrar" onClick={() => onClose?.()}>×</button>
        </header>
        <div className="pt-underline" />

        {/* Materia prima (varchar 100) */}
        <div className="pt-grid-3">
          <div className="pt-field">
            <label className="pt-label"><span className="pt-code">Materia prima</span></label>
            <input
              type="text"
              className={`pt-input ${touched.materia_prima && errors.materia_prima ? "is-invalid" : ""}`}
              placeholder="Nombre del producto (máx. 100)"
              value={materiaPrima}
              maxLength={100}
              onChange={(e) => setMateriaPrima(e.target.value)}
              onBlur={() => handleBlur("materia_prima")}
            />
            <div className="pt-meta">
              <span className="pt-counter">{materiaPrimaLen}/100</span>
              {touched.materia_prima && errors.materia_prima && (
                <span className="pt-error">{errors.materia_prima}</span>
              )}
            </div>
          </div>
          <div className="pt-spacer" />
          <div className="pt-spacer" />
        </div>

        {/* Campos 10,4 en 3 columnas */}
        <div className="pt-grid-3">
          {NUMERIC_FIELDS.map(({ code, label }) => (
            <div className="pt-field" key={code}>
              <label className="pt-label">
                <span className="pt-code">{code}</span> · {label}
              </label>
              <input
                className={`pt-input ${touched[code] && errors[code] ? "is-invalid" : ""}`}
                type="text"
                inputMode="decimal"
                step="0.0001"
                placeholder="0.0000"
                value={nums[code]}
                onChange={(e) => setNum(code, e.target.value)}
                onBlur={() => handleBlur(code)}
              />
              {touched[code] && errors[code] && (
                <div className="pt-error">{errors[code]}</div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-actions">
          <button type="button" className="pt-btn ghost" onClick={() => onClose?.()} disabled={saving}>
            Atrás
          </button>
          <button
            type="button"
            className="pt-btn primary"
            onClick={handleSave}
            disabled={!canSave || saving}
            title={!canSave ? "Completa los campos requeridos" : "Guardar producto temporal"}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>

          {/* Aviso junto a los botones */}
          {notice && (
            <div className={`pt-alert-inline ${notice.type}`} role="status" aria-live="polite">
              {notice.text}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
