import React, { useEffect, useMemo, useState } from "react";
import "./Producto.css";

import { NUTRIENTES } from "../../models/nutriente.model";
import {
  fetchPredeterminados,
  fetchTemporales,
} from "../../controllers/product.controller";
import { fmt10_4 } from "../../utils/numberFormat";

export default function Producto() {
  // Listas
  const [pred, setPred] = useState([]);
  const [temp, setTemp] = useState([]);

  // Un SOLO filtro para ambas listas
  const [q, setQ] = useState("");

  // Selección
  const [sel, setSel] = useState(null);

  // Estados de carga / error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [p, t] = await Promise.all([
          fetchPredeterminados(),
          fetchTemporales(),
        ]);
        if (!alive) return;
        setPred(Array.isArray(p) ? p : []);
        setTemp(Array.isArray(t) ? t : []);
      } catch (e) {
        if (!alive) return;
        setError("No se pudieron cargar los productos.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ---- Filtro SIN LÍMITE (aplica a ambas listas) ----
  const filtrar = (arr, term) => {
    const k = (term ?? "").trim().toLowerCase();
    if (!k) return Array.isArray(arr) ? arr : [];
    return (Array.isArray(arr) ? arr : []).filter((r) =>
      String(r?.materia_prima ?? "").toLowerCase().includes(k)
    );
  };

  const predView = useMemo(() => filtrar(pred, q), [pred, q]);
  const tempView = useMemo(() => filtrar(temp, q), [temp, q]);

  // Clicks
  const onPick = (row) => setSel(row);

  // Lectura segura + formato "10,4"
  const valueOf = (code) => {
    if (!sel) return "";
    const src = sel.nutrientes ?? sel;
    const v = src?.[code];
    return fmt10_4(v ?? "");
  };

  // "Buscar" opcional (el filtro ya aplica en vivo, aquí solo hacemos trim)
  const onBuscar = () => setQ((s) => s.trim());

  if (loading) {
    return (
      <div className="prod-wrapper">
        <div className="panel-der">Cargando productos…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prod-wrapper">
        <div className="panel-der">{error}</div>
      </div>
    );
  }

  return (
    <div className="prod-wrapper">
      <div className="prod-layout">
        {/* ===== Panel izquierdo: listas ===== */}
        <section className="mega-panel" aria-label="Listas de productos">
          <h2 className="sub-title">Buscar productos</h2>
          <div className="sub-underline" />

          {/* Un solo buscador para ambas listas */}
          <div className="sub-search" role="search">
            <input
              className="sub-input"
              placeholder="Buscar por nombre…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onBuscar()}
              aria-label="Buscar en todas las listas"
            />
            <button className="sub-btn" onClick={onBuscar}>
              Buscar
            </button>
            {q !== "" && (
              <button className="sub-btn sub-btn-clear" onClick={() => setQ("")}>
                Eliminar filtros
              </button>
            )}
          </div>

          {/* Lista predeterminados */}
          <h2 className="sub-title" style={{ marginTop: 18 }}>
            Lista de productos predeterminados
          </h2>
          <div className="sub-underline" />
          <div
            className="sub-list"
            role="listbox"
            aria-label="Resultados predeterminados"
          >
            {predView.length === 0 && <div className="state">Sin resultados</div>}
            {predView.map((row) => {
              const active = sel?.materia_prima === row.materia_prima;
              return (
                <div
                  key={row.id ?? row.materia_prima}
                  className={`sub-item ${active ? "active" : ""}`}
                  onClick={() => onPick(row)}
                  role="option"
                  aria-selected={active}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onPick(row)}
                  title="Ver detalles bromatológicos"
                >
                  {row.materia_prima}
                </div>
              );
            })}
          </div>

          {/* Lista temporales (solo si existen) */}
          {temp && temp.length > 0 && (
            <>
              <h2 className="sub-title" style={{ marginTop: 18 }}>
                Lista productos temporales
              </h2>
              <div className="sub-underline" />
              <div
                className="sub-list"
                role="listbox"
                aria-label="Resultados temporales"
              >
                {tempView.length === 0 && (
                  <div className="state">Sin resultados</div>
                )}
                {tempView.map((row, i) => {
                  const active = sel?.materia_prima === row.materia_prima;
                  return (
                    <div
                      key={`${row.id ?? "t"}-${i}`}
                      className={`sub-item ${active ? "active" : ""}`}
                      onClick={() => onPick(row)}
                      role="option"
                      aria-selected={active}
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && onPick(row)}
                      title="Ver detalles bromatológicos"
                    >
                      {row.materia_prima}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* ===== Panel derecho: detalles ===== */}
        <section className="panel-der" aria-live="polite">
          <h2 className="panel-title">Detalles bromatológicos</h2>

          {!sel && (
            <div className="state">
              Selecciona un producto para ver sus detalles.
            </div>
          )}

          {sel && (
            <>
              <div className="state" style={{ textAlign: "left", padding: "0 0 8px" }}>
                <strong>Producto:</strong> {sel.materia_prima}
              </div>

              <div className="det-grid">
                {Array.isArray(NUTRIENTES) &&
                  NUTRIENTES.map((n) => (
                    <div key={n.code} className="det-item">
                      <label className="det-label">
                        <span className="det-code">{n.code}</span> · {n.label}
                      </label>
                      <input
                        className="det-input"
                        type="text"
                        value={valueOf(n.code)}
                        readOnly
                        inputMode="decimal"
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
