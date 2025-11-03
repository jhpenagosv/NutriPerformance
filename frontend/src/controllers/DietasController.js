// src/controllers/DietasController.js
// Controlador central del flujo de dieta (singleton)

const state = {
    materiasSeleccionadas: [],       // [{ id, nombre, clasificacion?, temporal? }, ...]
    detallesPorMateria: {},          // { [id]: { MS, EM, NDT, PB, ... } }
    restriccionesPorMateria: {},     // { [id]: { costo: number, min: number, max: number } }
};

export const DietasController = {
    // --- Lecturas / snapshot ---
    snapshot() {
        return JSON.parse(JSON.stringify(state));
    },

    getSeleccionadas() {
        return [...state.materiasSeleccionadas];
    },

    getDetalleMateria(id) {
        return state.detallesPorMateria[id] || null;
    },

    getRestriccionMateria(id) {
        return state.restriccionesPorMateria[id] || null;
    },

    getRestricciones() {
        return { ...state.restriccionesPorMateria };
    },

    // --- Escrituras ---
    setSeleccionadas(arr) {
        // arr: [{id, nombre, ...}]
        state.materiasSeleccionadas = Array.isArray(arr) ? [...arr] : [];
        // (opcional) limpiar restricciones huérfanas
        const validIds = new Set(state.materiasSeleccionadas.map(m => String(m.id)));
        Object.keys(state.restriccionesPorMateria).forEach(id => {
            if (!validIds.has(String(id))) delete state.restriccionesPorMateria[id];
        });
    },

    setDetalleMateria(id, detalle) {
        state.detallesPorMateria[id] = { ...(detalle || {}) };
    },

    setRestriccionMateria(id, data) {
        const parsed = {
            costo: Number(data?.costo ?? 0),
            min: Number(data?.min ?? 0),
            max: Number(data?.max ?? 0),
        };
        state.restriccionesPorMateria[id] = parsed;
    },

    // --- Utilidades ---
    clear() {
        state.materiasSeleccionadas = [];
        state.detallesPorMateria = {};
        state.restriccionesPorMateria = {};
    },
};

export default DietasController;
