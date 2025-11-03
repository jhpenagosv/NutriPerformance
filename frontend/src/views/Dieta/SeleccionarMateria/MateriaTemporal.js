// src/views/Dieta/SeleccionarMateria/MateriaTemporal.js
import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./MateriaTemporal.css";
import { message } from "../../Mensaje/Mensaje";

// Campos numéricos
// Reemplaza tu NUMERIC_FIELDS por este:
const NUMERIC_FIELDS = [
    // Orden principal (como en ReqNutricional)
    { code: "MS", label: "MS (%)" },
    { code: "EM", label: "EM (Mcal/kg)" },
    { code: "NDT", label: "NDT (%)" },
    { code: "PB", label: "PB (%)" },

    // Macro-minerales
    { code: "Ca", label: "Ca (%)" },
    { code: "P", label: "P (%)" },
    { code: "Mg", label: "Mg (%)" },
    { code: "Na", label: "Na (%)" },
    { code: "K", label: "K (%)" },
    { code: "S", label: "S (%)" },

    // Micro-minerales (traza)
    { code: "Cu", label: "Cu (mg/kg)" },
    { code: "Co", label: "Co (mg/kg)" },
    { code: "I", label: "I (mg/kg)" },
    { code: "Fe", label: "Fe (mg/kg)" },
    { code: "Mn", label: "Mn (mg/kg)" },
    { code: "Se", label: "Se (mg/kg)" },
    { code: "Zn", label: "Zn (mg/kg)" },

    // Fibra y carbohidratos
    { code: "FDN", label: "FDN (%)" },
    { code: "EE", label: "EE (%)" },
    { code: "CNF", label: "CNF (%)" },
];


// Session storage helpers
const STORAGE_KEY = "np_temporales";
const readTemporales = () => {
    try { const raw = sessionStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; }
    catch { return []; }
};
const saveTemporales = (arr) => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr || [])); }
    catch { }
};

// Validación numérica (permite 10 enteros y 4 decimales con , o .)
const RX_NUM = /^-?\d{0,10}([.,]\d{0,4})?$/;
const normalizeNumInput = (v) => (v ?? "").toString().trim().replace(",", ".");

export default function MateriaTemporal({ open, onClose, onGuardar }) {
    const [nombre, setNombre] = useState("");
    const [clasificacion, setClasificacion] = useState("");

    const [nums, setNums] = useState(
        NUMERIC_FIELDS.reduce((acc, f) => { acc[f.code] = ""; return acc; }, {})
    );
    const [touched, setTouched] = useState({});
    const [saving, setSaving] = useState(false);

    // Cerrar con ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Errores
    const errors = useMemo(() => {
        const e = {};
        if (!nombre.trim()) e.nombre = "El nombre es obligatorio.";
        for (const { code } of NUMERIC_FIELDS) {
            const raw = normalizeNumInput(nums[code]);
            if (raw === "") continue; // vacío válido
            if (!RX_NUM.test(raw)) e[code] = "Formato inválido (use 10.4 o 10,4).";
        }
        return e;
    }, [nombre, nums]);

    const canSave = useMemo(() => Object.keys(errors).length === 0, [errors]);

    // Handlers numéricos
    const onNumChange = (code, v) => {
        const val = v.replace(",", ".");
        if (val === "" || /^-?\d{0,10}([.]\d{0,4})?$/.test(val)) {
            setNums((p) => ({ ...p, [code]: val }));
        }
    };
    const onNumBlur = (code) => {
        setTouched((p) => ({ ...p, [code]: true }));
        setNums((p) => {
            let v = p[code];
            if (v && /\.$/.test(v)) v = v.slice(0, -1);
            return { ...p, [code]: v };
        });
    };
    const onNombreBlur = () => setTouched((p) => ({ ...p, nombre: true }));

    const resetForm = () => {
        setNombre("");
        setClasificacion("");
        setNums(NUMERIC_FIELDS.reduce((acc, f) => { acc[f.code] = ""; return acc; }, {}));
        setTouched({});
    };

    const handleSave = async () => {
        if (saving) return;

        // Marcar como tocado para mostrar errores
        setTouched((prev) => {
            const all = { ...prev, nombre: true };
            NUMERIC_FIELDS.forEach(({ code }) => (all[code] = true));
            return all;
        });

        if (!canSave) {
            await message.alert({
                title: "Atención",
                text: "Completa los datos requeridos antes de guardar.",
                buttonText: "Aceptar",
            });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: `temp_${Date.now()}`,
                nombre: nombre.trim().slice(0, 100),
                clasificacion: clasificacion.trim(),
                origen: "temporal",
                temporal: true, // para la píldora “Temporal” en Seleccionadas
                ...NUMERIC_FIELDS.reduce((acc, { code }) => {
                    let v = normalizeNumInput(nums[code]);
                    if (v === "" || v === ".") v = "0";
                    if (/\.$/.test(v)) v = v.slice(0, -1);
                    acc[code] = Number(v);
                    return acc;
                }, {}),
                __ts: Date.now(),
            };

            const nextArr = [...readTemporales(), payload];
            saveTemporales(nextArr);

            onGuardar?.(payload, nextArr);
            message.success("Materia temporal guardada.", "Hecho");

            resetForm();
            onClose?.();
        } catch {
            message.error("Error al guardar la materia temporal.");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    // Render en PORTAL con estructura que tu CSS espera:
    // .mt-overlay (fixed, backdrop) -> .mt-modal (ventana)
    return createPortal(
        <div className="mt-overlay" role="dialog" aria-modal="true" aria-label="Nueva materia temporal" onClick={onClose}>
            <div className="mt-modal" onClick={(e) => e.stopPropagation()}>
                <div className="mt-header">
                    <h3 className="mt-title">Nueva materia temporal</h3>
                    <button className="mt-close" onClick={onClose} aria-label="Cerrar">×</button>
                </div>
                <div className="mt-underline" />

                <div className="mt-grid-3">
                    {/* Nombre */}
                    <div className="mt-field">
                        <label className="mt-label">Nombre <span className="mt-code">*</span></label>
                        <input
                            className={`mt-input ${touched.nombre && errors.nombre ? "is-invalid" : ""}`}
                            value={nombre}
                            onBlur={onNombreBlur}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Heno temporal"
                            maxLength={100}
                            autoFocus
                        />
                        {touched.nombre && errors.nombre && (
                            <div className="mt-error">{errors.nombre}</div>
                        )}
                    </div>

                    {/* Clasificación (opcional) */}
                    <div className="mt-field">
                        <label className="mt-label">Clasificación (opcional)</label>
                        <input
                            className="mt-input"
                            value={clasificacion}
                            onChange={(e) => setClasificacion(e.target.value)}
                            placeholder="Ej: Forrajes"
                            maxLength={60}
                        />
                    </div>

                    <div className="mt-spacer" />

                    {/* Numéricos */}
                    {NUMERIC_FIELDS.map(({ code, label }) => {
                        const err = touched[code] && errors[code];
                        return (
                            <div key={code} className="mt-field">
                                <label className="mt-label">{label}</label>
                                <input
                                    className={`mt-input ${err ? "is-invalid" : ""}`}
                                    inputMode="decimal"
                                    value={nums[code]}
                                    placeholder="0"
                                    onChange={(e) => onNumChange(code, e.target.value)}
                                    onBlur={() => onNumBlur(code)}
                                />
                                {err && <div className="mt-error">{errors[code]}</div>}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-actions">
                    <button className="mt-btn ghost" onClick={onClose} disabled={saving}>Cancelar</button>
                    <button className="mt-btn primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
