import React, { useEffect, useMemo, useState } from "react";
import "./SeleccionProducto.css";
import ProductosTemporales from "./ProductosTemporales";
import MensajeEliminacion from "../MensajesDialogos/mensaje_eliminacion";
import MensajeInformacion from "../MensajesDialogos/mensaje_informacion";

const STORAGE_KEY = "np_productos_temporales_v1";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3009/api";

function readTemporales() {
  try {
    const a = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
function clearTemporalesStorage() {
  localStorage.setItem(STORAGE_KEY, "[]");
}

export default function SeleccionProducto({ onAtras, onSiguiente }) {
  const [temporales, setTemporales] = useState([]);            // nombres
  const [predeterminados, setPredeterminados] = useState([]);  // nombres
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seleccion, setSeleccion] = useState(new Set());

  // mensajes e interacciones
  const [mensaje, setMensaje] = useState(""); // aviso bajo listas (compat)
  const [toast, setToast] = useState("");
  const [openTemp, setOpenTemp] = useState(false);

  // confirmación (eliminar/limpiar)
  const [confirm, setConfirm] = useState({ open: false, type: null, message: "" });

  // informativo sin confirmación
  const [info, setInfo] = useState({ open: false, message: "", type: "info" });

  // 🔎 Un SOLO buscador global
  const [q, setQ] = useState("");     // texto que escribe el usuario
  const [f, setF] = useState("");     // término aplicado (al presionar "Buscar" o Enter)

  // cargar temporales (nombres) desde storage
  useEffect(() => {
    const items = readTemporales();
    setTemporales(items.map((x) => x?.materia_prima).filter(Boolean));
  }, []);

  // fetch predeterminados desde backend
  const fetchPredeterminados = () => {
    let alive = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort("timeout"), 6000);

    setLoading(true);
    setError("");
    fetch(`${API_BASE}/materias-primas`, { signal: ctrl.signal })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(text || String(res.status));
        const data = JSON.parse(text || "[]");
        const nombres = data.map((d) => d.materia_prima).filter(Boolean);
        if (alive) setPredeterminados(nombres);
      })
      .catch(() => {
        if (alive) {
          setPredeterminados([]);
          setError("No se pudo cargar la lista desde el servidor.");
        }
      })
      .finally(() => {
        if (alive) setLoading(false);
        clearTimeout(timer);
      });

    return () => {
      alive = false;
      clearTimeout(timer);
      ctrl.abort();
    };
  };
  useEffect(fetchPredeterminados, []);

  const toggle = (name) => {
    const next = new Set(seleccion);
    next.has(name) ? next.delete(name) : next.add(name);
    setSeleccion(next);
    if (next.size) setMensaje("");
  };

  const onGuardarTemporal = (_payload, listaActual) => {
    const nombres = (listaActual || []).map((x) => x?.materia_prima).filter(Boolean);
    setTemporales(nombres);
    if (_payload?.materia_prima) {
      setSeleccion((prev) => new Set(prev).add(_payload.materia_prima));
    }
    setOpenTemp(false);
    setInfo({ open: true, message: "Producto temporal agregado.", type: "success" });
  };

  // 🔎 Filtrar AMBAS listas con el mismo término
  const tempFiltrada = useMemo(() => {
    const s = f.trim().toLowerCase();
    const base = temporales;
    return s ? base.filter((p) => p.toLowerCase().includes(s)) : base;
  }, [temporales, f]);

  const predFiltrada = useMemo(() => {
    const s = f.trim().toLowerCase();
    const base = predeterminados;
    return s ? base.filter((p) => p.toLowerCase().includes(s)) : base;
  }, [predeterminados, f]);

  // 🔎 Acciones de búsqueda global
  const buscar = () => setF(q);
  const limpiar = () => {
    setQ("");
    setF("");
  };

  const hasSelectedTemporales = useMemo(
    () => temporales.some((n) => seleccion.has(n)),
    [temporales, seleccion]
  );

  const handleLimpiarTemporales = () => {
    if (!temporales.length) {
      setInfo({ open: true, message: "No hay productos temporales para limpiar.", type: "info" });
      return;
    }
    setConfirm({
      open: true,
      type: "limpiar",
      message: "¿Seguro que deseas eliminar todos los productos temporales?",
    });
  };

  const handleEliminarTemporalesSeleccionados = () => {
    const selectedTempNames = temporales.filter((n) => seleccion.has(n));
    if (selectedTempNames.length === 0) {
      setInfo({
        open: true,
        message: "Selecciona al menos un producto temporal para eliminar.",
        type: "error",
      });
      return;
    }
    setConfirm({
      open: true,
      type: "eliminarSeleccionados",
      message: `¿Eliminar ${selectedTempNames.length} producto(s) temporal(es) seleccionado(s)?`,
    });
  };

  const showToast = (text) => {
    setToast(text);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 3000);
  };

  const handleNext = () => {
    if (!seleccion.size) {
      setInfo({
        open: true,
        message: "Debes seleccionar al menos un producto para continuar.",
        type: "warning",
      });
      return;
    }
    const nombres = Array.from(seleccion);
    onSiguiente?.(nombres);
  };

  return (
    <section className="sp-card">
      <div className="sp-header">
        <h2 className="sp-title">Selección de productos</h2>
        <button className="sp-btn sp-btn-primary sp-add" onClick={() => setOpenTemp(true)}>
          + Agregar producto temporal
        </button>
      </div>

      {/* 🔎 ÚNICO BUSCADOR GLOBAL */}
      <div className="sp-search-row" role="search" aria-label="Buscar en ambas listas">
        <input
          className="sp-search"
          placeholder="Buscar producto en todas las listas…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
        />
        <button className="sp-search-btn" onClick={buscar}>Buscar</button>
        {f && (
          <button className="sp-clear" onClick={limpiar}>Borrar</button>
        )}
      </div>

      <div className="sp-panels">
        {/* IZQUIERDA: Temporales */}
        <div className="sp-panel">
          <h3 className="sp-panel-title">Lista productos temporales</h3>
          <div className="sp-panel-underline" />

          {temporales.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, margin: "6px 0 8px" }}>
              <button className="sp-btn sp-btn-outline" onClick={handleLimpiarTemporales}>
                Limpiar lista
              </button>
              <button
                className="sp-btn sp-btn-outline"
                onClick={handleEliminarTemporalesSeleccionados}
                disabled={!hasSelectedTemporales}
                style={hasSelectedTemporales ? { borderColor: "#e53935", color: "#e53935" } : {}}
                title={
                  hasSelectedTemporales
                    ? "Eliminar temporales seleccionados"
                    : "Selecciona temporales para eliminar"
                }
              >
                Eliminar seleccionados
              </button>
            </div>
          )}

          <div className="sp-list-one">
            {tempFiltrada.length === 0 && <div className="sp-empty">Sin temporales</div>}
            {tempFiltrada.map((p) => (
              <label key={`t-${p}`} className={`sp-item ${seleccion.has(p) ? "checked" : ""}`}>
                <input type="checkbox" checked={seleccion.has(p)} onChange={() => toggle(p)} />
                <span>{p}</span>
              </label>
            ))}
          </div>
        </div>

        {/* DERECHA: Predeterminados */}
        <div className="sp-panel">
          <h3 className="sp-panel-title">Lista productos predeterminados</h3>
          <div className="sp-panel-underline" />

          {loading && <div className="sp-empty">Cargando productos…</div>}
          {!loading && error && (
            <div className="sp-warn" style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <span>{error}</span>
              <button className="sp-btn sp-btn-outline" onClick={fetchPredeterminados}>
                Reintentar
              </button>
            </div>
          )}
          {!loading && !error && (
            <div className="sp-list-grid">
              {predFiltrada.length === 0 && <div className="sp-empty">Sin resultados</div>}
              {predFiltrada.map((p) => (
                <label key={`p-${p}`} className={`sp-item ${seleccion.has(p) ? "checked" : ""}`}>
                  <input type="checkbox" checked={seleccion.has(p)} onChange={() => toggle(p)} />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {mensaje && <div className="sp-warn">{mensaje}</div>}

      <div className="sp-actions">
        <button className="sp-btn sp-btn-outline" onClick={onAtras}>
          Atrás
        </button>
        <button className="sp-btn sp-btn-primary" onClick={handleNext}>
          Siguiente
        </button>
      </div>

      {/* Toast (feedback no modal) */}
      {toast && <div className="sp-toast">{toast}</div>}

      {/* Modal de alta de temporales */}
      <ProductosTemporales open={openTemp} onClose={() => setOpenTemp(false)} onGuardar={onGuardarTemporal} />

      {/* Confirmación (eliminar/limpiar) */}
      <MensajeEliminacion
        open={confirm.open}
        title="Confirmar acción"
        message={confirm.message}
        onCancel={() => setConfirm({ open: false, type: null, message: "" })}
        onConfirm={() => {
          if (confirm.type === "limpiar") {
            clearTemporalesStorage();
            setSeleccion(new Set());
            setTemporales([]);
            showToast("✅ Lista de productos temporales eliminada correctamente.");
          }
          if (confirm.type === "eliminarSeleccionados") {
            const selectedTempNames = temporales.filter((n) => seleccion.has(n));
            const arr = readTemporales();
            const nextArr = arr.filter((obj) => !selectedTempNames.includes(obj?.materia_prima));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextArr));
            const nextNames = nextArr.map((x) => x?.materia_prima).filter(Boolean);
            setTemporales(nextNames);
            setSeleccion((prev) => {
              const next = new Set(prev);
              selectedTempNames.forEach((n) => next.delete(n));
              return next;
            });
            showToast("🗑️ Productos seleccionados eliminados correctamente.");
          }
          setConfirm({ open: false, type: null, message: "" });
        }}
      />

      {/* Información (sin confirmación) con tipos */}
      <MensajeInformacion
        open={info.open}
        title="Atención"
        message={info.message}
        type={info.type || "info"}
        onClose={() => setInfo({ open: false, message: "", type: "info" })}
      />
    </section>
  );
}
