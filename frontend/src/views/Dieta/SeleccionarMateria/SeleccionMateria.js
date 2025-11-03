import React, { useEffect, useState } from "react";
import "./SeleccionMateria.css";

import MateriaTemporal from "./MateriaTemporal";

import {
    cargarClasificaciones,
    buscarMaterias,
    cargarDetalleMateria,
} from "../../../controllers/MateriasController";

import { message } from "../../Mensaje/Mensaje";

export default function SeleccionMateria({ DietasController, onAtras, onSiguiente }) {
    // --------- Estado UI / filtros ---------
    const [q, setQ] = useState("");
    const [clasificacionId, setClasificacionId] = useState("");

    // Catálogo de clasificaciones
    const [clasificaciones, setClasificaciones] = useState([]);

    // Banco de materias filtrado
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(false);

    // Selección local del paso
    const [seleccionadas, setSeleccionadas] = useState([]);

    // Modal de creación temporal
    const [modalOpen, setModalOpen] = useState(false);

    // --------- Bootstrap (snapshot + catálogo + banco completo) ---------
    useEffect(() => {
        let alive = true;
        (async () => {
            // recuperar selección previa
            const snap = DietasController?.snapshot?.() || {};
            if (Array.isArray(snap.materiasSeleccionadas) && snap.materiasSeleccionadas.length > 0) {
                setSeleccionadas(snap.materiasSeleccionadas);
            }

            // catálogo + banco
            try {
                setLoading(true);
                const [cls, mats] = await Promise.all([
                    cargarClasificaciones(),
                    buscarMaterias({ q: "", clasificacionId: "" }),
                ]);
                if (!alive) return;
                setClasificaciones(Array.isArray(cls) ? cls : []);
                setMaterias(Array.isArray(mats) ? mats : []);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --------- Re-carga por filtros ---------
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const mats = await buscarMaterias({ q, clasificacionId });
                if (!alive) return;
                setMaterias(Array.isArray(mats) ? mats : []);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [q, clasificacionId]);

    // --------- Helpers selección ---------
    const isSelected = (id) => seleccionadas.some((x) => String(x.id) === String(id));

    const toggleSel = (m) => {
        setSeleccionadas((prev) => {
            const exists = prev.some((x) => String(x.id) === String(m.id));
            return exists ? prev.filter((x) => String(x.id) !== String(m.id)) : [...prev, m];
        });
    };

    const vaciarSeleccion = () => setSeleccionadas([]);

    // --------- Confirmar (guarda + prefetch detalles) ---------
    const confirmarSeleccion = async () => {
        if (seleccionadas.length === 0) {
            await message.alert({
                title: "Sin selección",
                text: "Selecciona al menos una materia prima antes de confirmar.",
                buttonText: "Entendido",
            });
            return;
        }

        // 1) Persistir selección
        DietasController?.setSeleccionadas(seleccionadas);

        // 2) Prefetch detalles bromatológicos
        for (const m of seleccionadas) {
            try {
                const det = await cargarDetalleMateria(m.id);
                if (det?.detalle) {
                    DietasController?.setDetalleMateria(m.id, det.detalle);
                }
            } catch {
                // ignorar error individual
            }
        }

        // 3) Toast de éxito
        message.success("Selección guardada correctamente.", "Hecho");
    };

    // --------- Derivados UI ---------
    const bancoVacio = !loading && materias.length === 0;
    const selVacia = seleccionadas.length === 0;

    // Píldora: si es temporal muestra “Temporal”, si no la clasificación
    const pillSeleccionada = (m) =>
        <span className={`pill ${m.temporal ? "" : "neutral"}`}>{m.temporal ? "Temporal" : (m.clasificacion || "—")}</span>;

    const pillBanco = (texto) => <span className="pill">{texto || "—"}</span>;

    // --------- JSX ---------
    return (
        <div className="selmat-grid">
            {/* Toolbar superior (quedó SOLO el botón del modal, se quitó "Confirmar selección" de aquí) */}
            <div className="selmat-toolbar">
                <div className="selmat-search">
                    <input
                        placeholder="Buscar materia prima…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <select
                        className="selmat-select"
                        value={clasificacionId}
                        onChange={(e) => setClasificacionId(e.target.value)}
                    >
                        <option value="">Todas las clasificaciones</option>
                        {clasificaciones.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="selmat-actions">
                    <button className="btn btn-gold" onClick={() => setModalOpen(true)}>
                        Agregar materia prima temporal
                    </button>
                </div>
            </div>

            {/* Panel izquierdo: Seleccionadas (ahora con Confirmar al lado de Vaciar) */}
            <div className="selmat-panel">
                <h3 className="panel-title">
                    Seleccionadas
                    <span className="line" />
                </h3>

                <div className="scroll-area">
                    <ul className="list">
                        {selVacia && <li className="empty">Aún no has seleccionado materias</li>}
                        {seleccionadas.map((m) => (
                            <li key={m.id} className="row selected">
                                <span className="name">{m.nombre}</span>
                                {pillSeleccionada(m)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="temp-actions">
                    <button
                        className="btn-danger-outline"
                        onClick={vaciarSeleccion}
                        disabled={selVacia}
                    >
                        Vaciar selección
                    </button>

                    <button
                        className="btn btn-gold"
                        onClick={confirmarSeleccion}
                        disabled={selVacia}
                        title={selVacia ? "Selecciona al menos una materia" : "Guardar selección (no avanza)"}
                    >
                        Confirmar selección
                    </button>
                </div>
            </div>

            {/* Panel derecho: Banco */}
            <div className="selmat-panel">
                <h3 className="panel-title">
                    Banco de materias
                    <span className="line" />
                </h3>

                <div className="scroll-area">
                    <ul className="list">
                        {loading && <li className="empty">Cargando…</li>}
                        {bancoVacio && <li className="empty">Sin resultados</li>}

                        {!loading &&
                            materias.map((m) => {
                                const active = isSelected(m.id);
                                return (
                                    <li
                                        key={m.id}
                                        className={`row ${active ? "active" : ""}`}
                                        onClick={() => toggleSel(m)}
                                        title={active ? "Quitar de seleccionadas" : "Agregar a seleccionadas"}
                                    >
                                        <span className="name">{m.nombre}</span>
                                        {pillBanco(m.clasificacion)}
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>

            {/* Footer navegación */}
            <div className="selmat-footer">
                <button className="btn ghost" onClick={onAtras}>Atrás</button>
                <button
                    className="btn btn-gold"
                    onClick={async () => {
                        const snap = DietasController?.snapshot?.() || {};
                        const count = snap.materiasSeleccionadas?.length || 0;
                        if (count === 0) {
                            await message.alert({
                                title: "Confirma tu selección",
                                text: "Debes confirmar al menos una materia prima antes de continuar.",
                                buttonText: "Entendido",
                            });
                            return;
                        }
                        onSiguiente?.();
                    }}
                >
                    Siguiente
                </button>
            </div>

            {/* Modal para crear materia temporal */}
            <MateriaTemporal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onGuardar={(payload) => {
                    // payload con flag temporal=true
                    setSeleccionadas((prev) => [...prev, payload]);
                    setModalOpen(false);
                    message.success("Materia temporal guardada.", "Hecho");
                }}
            />
        </div>
    );
}
