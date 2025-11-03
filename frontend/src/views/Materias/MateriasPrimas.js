import React, { useEffect, useMemo, useState } from "react";
import "./MateriasPrimas.css";
import {
    cargarClasificaciones,
    buscarMaterias,
    cargarDetalleMateria,
} from "../../controllers/MateriasController";
import { DETAIL_KEYS } from "../../models/MateriasModel";

export default function MateriasPrimas() {
    // Estados (izquierda)
    const [q, setQ] = useState("");
    const [clasif, setClasif] = useState("");
    const [clasifs, setClasifs] = useState([]);
    const [materias, setMaterias] = useState([]);

    // Selección (derecha)
    const [sel, setSel] = useState(null);
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingDet, setLoadingDet] = useState(false);
    const [error, setError] = useState("");

    // Carga inicial
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const cls = await cargarClasificaciones();
                const ms = await buscarMaterias({ q: "", clasificacionId: "" });
                if (!alive) return;
                setClasifs(Array.isArray(cls) ? cls : []);
                setMaterias(Array.isArray(ms) ? ms : []);
            } catch (e) {
                if (!alive) return;
                setError("No se pudieron cargar los datos iniciales.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    // Buscar / filtrar
    const onBuscar = async (e) => {
        e?.preventDefault?.();
        const ms = await buscarMaterias({ q, clasificacionId: clasif });
        setMaterias(Array.isArray(ms) ? ms : []);
        if (sel && !ms?.some((m) => m.id === sel.id)) {
            setSel(null);
            setDetalle(null);
        }
    };

    // Filtro en vivo (UX)
    const materiasView = useMemo(() => {
        const term = (q ?? "").trim().toLowerCase();
        return (Array.isArray(materias) ? materias : []).filter((m) => {
            const okCls = !clasif || String(m.clasificacion_id ?? m.clasificacionId ?? "") === String(clasif);
            const okTxt = !term || String(m.nombre ?? "").toLowerCase().includes(term);
            return okCls && okTxt;
        });
    }, [materias, q, clasif]);

    // Selección
    const onPick = async (m) => {
        setSel(m);
        setLoadingDet(true);
        try {
            const det = await cargarDetalleMateria(m.id);
            setDetalle(det || null);
        } finally {
            setLoadingDet(false);
        }
    };

    if (loading) {
        return (
            <div className="prod-wrapper">
                <div className="panel-der">Cargando…</div>
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
            <div className="mp-layout">
                {/* ========= Panel IZQUIERDO ========= */}
                <section className="mega-panel" aria-label="Filtro y lista de materias primas">
                    <h2 className="sub-title">Buscar Materia prima</h2>
                    <div className="sub-underline" />

                    {/* Filtro */}
                    <form className="sub-search" onSubmit={onBuscar} role="search">
                        <div className="sub-search-row top">
                            <select
                                className="sub-input"
                                value={clasif}
                                onChange={(e) => setClasif(e.target.value)}
                                aria-label="Filtrar por clasificación"
                            >
                                <option value="">Todas las clasificaciones</option>
                                {clasifs.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="sub-search-row bottom">
                            <input
                                className="sub-input"
                                placeholder="Buscar por nombre…"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && onBuscar(e)}
                                aria-label="Buscar por nombre"
                            />
                            <button className="sub-btn" type="submit">Buscar</button>
                            {(q !== "" || clasif !== "") && (
                                <button
                                    type="button"
                                    className="sub-btn sub-btn-clear"
                                    onClick={() => { setQ(""); setClasif(""); }}
                                >
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Lista */}
                    <h2 className="sub-title" style={{ marginTop: 12 }}>Materias primas</h2>
                    <div className="sub-underline" />
                    <div className="sub-list" role="listbox" aria-label="Resultados de materias primas">
                        {materiasView.length === 0 && <div className="state">Sin resultados</div>}
                        {materiasView.map((m) => {
                            const active = sel?.id === m.id;
                            return (
                                <div
                                    key={m.id}
                                    className={`sub-item ${active ? "active" : ""}`}
                                    onClick={() => onPick(m)}
                                    role="option"
                                    aria-selected={active}
                                    title="Ver detalles bromatológicos"
                                >
                                    <strong>{m.nombre}</strong>
                                    <div className="sub-chip">{m.clasificacion}</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ========= Panel DERECHO ========= */}
                <section className="panel-der" aria-live="polite">
                    <h2 className="panel-title center">Detalles bromatológicos</h2>
                    <div className="sub-underline small" />

                    <p className="det-help">
                        Seleccione una materia prima para ver sus detalles bromatológicos.
                    </p>

                    <div className="det-head">
                        <h3 className="det-mp">{sel?.nombre || "—"}</h3>
                        <span className="det-chip">{sel?.clasificacion || "—"}</span>
                    </div>

                    {loadingDet && sel && <div className="state">Cargando detalles…</div>}

                    {sel && !loadingDet && detalle?.detalle && (
                        <div className="det-grid">
                            {DETAIL_KEYS.map((k) => (
                                <div key={k} className="det-item">
                                    <label className="det-label">
                                        <span className="det-code">{k}</span>
                                    </label>
                                    <input
                                        className="det-input"
                                        type="text"
                                        readOnly
                                        value={detalle.detalle[k] ?? "—"}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
