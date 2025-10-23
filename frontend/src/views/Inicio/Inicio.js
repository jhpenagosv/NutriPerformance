import React, { useEffect, useMemo, useState } from "react";
import "./Inicio.css";

// controllers / models / utils
import {
  getPermanentesCount,
  getTemporalesCount,
  listDietasFormuladas,
  deleteDietaFormulada,
} from "../../controllers/home.controller";
import { mapDocsForUI } from "../../models/docs.model";

/* Tarjeta pequeña de indicador */
function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card" role="group" aria-label={label}>
      <div className="stat-icon" aria-hidden="true">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Inicio() {
  const [permCount, setPermCount] = useState(0);
  const [tmpCount, setTmpCount]   = useState(0);

  const [docs, setDocs] = useState([]);         // [{name, url, index}]
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError]     = useState("");

  // Conteo de productos permanentes (API)
  useEffect(() => {
    let alive = true;
    (async () => {
      const n = await getPermanentesCount().catch(() => 0);
      if (alive) setPermCount(n);
    })();
    return () => { alive = false; };
  }, []);

  // Conteo de productos temporales (localStorage)
  useEffect(() => {
    const read = () => setTmpCount(getTemporalesCount());
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  // Listado de PDFs dieta_optimaN.pdf (manifest en /public/dietas_formuladas)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingDocs(true);
      setDocsError("");
      try {
        const list = await listDietasFormuladas();
        if (alive) setDocs(mapDocsForUI(list));
      } catch {
        if (alive) { setDocs([]); setDocsError("No se pudo cargar el listado."); }
      } finally {
        if (alive) setLoadingDocs(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Pedido original: no calcular (por ahora) “dietas formuladas”
  const dietasCount = useMemo(() => "—", []);

  // Eliminar documento (requiere endpoint backend)
  const eliminarDoc = async (name) => {
    const ok = window.confirm(`¿Eliminar el documento "${name}"?`);
    if (!ok) return;
    try {
      await deleteDietaFormulada(name);
      setDocs((prev) => prev.filter((d) => d.name !== name));
    } catch {
      alert("La eliminación requiere el endpoint DELETE /dietas-formuladas en el backend.");
    }
  };

  return (
    <div className="home-wrapper main-content">
      <h1 className="home-title">NutriPerformance</h1>
      <div className="home-underline" />

      {/* Indicadores rápidos */}
      <section className="stats-row" aria-label="Indicadores rápidos">
        <StatCard icon="📦" value={permCount}  label="Productos permanentes" />
        <StatCard icon="📝" value={tmpCount}   label="Productos temporales" />
        <StatCard icon="🥣" value={dietasCount} label="Dietas formuladas" />
      </section>

      {/* Documentos generados */}
      <section className="docs-panel">
        <div className="docs-head">
          <h2 className="docs-title">Dietas formuladas (PDF)</h2>
        </div>

        {loadingDocs && <div className="muted">Cargando…</div>}
        {!loadingDocs && docsError && <div className="error">{docsError}</div>}

        {!loadingDocs && !docsError && (
          docs.length > 0 ? (
            <ul className="docs-list">
              {docs.map((d) => (
                <li key={d.name} className="docs-item">
                  <div className="doc-left">
                    <span className="doc-icon" aria-hidden="true">📄</span>
                    <span className="doc-name" title={d.name}>
                      {d.index}. {d.name}
                    </span>
                  </div>
                  <div className="doc-actions">
                    <a className="doc-btn" href={d.url} download>Descargar</a>
                    <button className="doc-btn danger" onClick={() => eliminarDoc(d.name)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="muted">No hay documentos aún.</div>
          )
        )}
      </section>
    </div>
  );
}
