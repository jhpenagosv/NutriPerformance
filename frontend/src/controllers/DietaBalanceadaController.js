// src/controllers/DietaBalanceadaController.js
import { useEffect, useMemo, useState } from "react";
import {
    buildInfoGeneral,
    buildMateriasSeleccionadas,
    buildDetallesBromatologicos,
    DETALLE_KEYS,
} from "../models/dietaBalanceada.model";

// Importa solo lo que existe en tu MateriasController
import { cargarDetalleMateria } from "./MateriasController";

/**
 * Resuelve la fuente de datos del Paso 1 (Datos del animal):
 * 1) Prop recibida,
 * 2) DietasController.getDatosAnimal(),
 * 3) localStorage("np_datosAnimal")
 */
export function resolveDatosAnimal(DietasController, datosAnimalProp) {
    if (datosAnimalProp) return datosAnimalProp;

    if (typeof DietasController?.getDatosAnimal === "function") {
        const fromCtl = DietasController.getDatosAnimal();
        if (fromCtl) return fromCtl;
    }

    try {
        const ls = localStorage.getItem("np_datosAnimal");
        if (ls) return JSON.parse(ls);
    } catch (_) { }

    return {};
}

/**
 * Hook controlador para DietaBalanceada:
 * - Sesión 1: Información general
 * - Sesión 2: Listado con detalles bromatológicos por materia (Banco y Temporales)
 */
export function useDietaBalanceadaController(DietasController, datosAnimalProp) {
    const [raw, setRaw] = useState(null);

    // Paso 3: selección + restricciones
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [restricciones, setRestricciones] = useState({});

    // Detalles bromatológicos por id de materia
    const [detallesById, setDetallesById] = useState({});

    // Carga inicial de datos generales + selección y restricciones
    useEffect(() => {
        // Sesión 1
        const data = resolveDatosAnimal(DietasController, datosAnimalProp);
        setRaw(data || {});

        // Sesión 2: materias seleccionadas
        const sel =
            typeof DietasController?.getSeleccionadas === "function"
                ? DietasController.getSeleccionadas()
                : JSON.parse(localStorage.getItem("np_sel") || "[]");

        // Restricciones (costo/min/max)
        const restr =
            typeof DietasController?.getRestricciones === "function"
                ? DietasController.getRestricciones()
                : JSON.parse(localStorage.getItem("np_restr") || "{}");

        setSeleccionadas(Array.isArray(sel) ? sel : []);
        setRestricciones(restr && typeof restr === "object" ? restr : {});
    }, [DietasController, datosAnimalProp]);

    // Cargar detalles bromatológicos (Banco y Temporales)
    useEffect(() => {
        let cancel = false;

        // Opcional: detalles de materias temporales guardados por el formulario de Materia Temporal
        // Estructura sugerida: { [idTemporal]: { MS: 88, EM: 1.5, ... } }
        let tempDetallesLS = {};
        try {
            tempDetallesLS = JSON.parse(localStorage.getItem("np_temp_detalles") || "{}");
        } catch (_) { }

        async function fetchDetalles() {
            const acc = {};

            for (const m of seleccionadas || []) {
                try {
                    // Si es temporal, prioriza detalle inline o en LS
                    if (m.temporal || m.isTemporal || m.esTemporal) {
                        const inline =
                            m.detalle || m.bromatologia || m.detalles || m.composicion || null;
                        const fromLS = tempDetallesLS?.[m.id] || null;

                        acc[m.id] = inline || fromLS || {};
                        continue;
                    }

                    // Banco: cargar desde API/controlador
                    let det = await cargarDetalleMateria(m.id);
                    if (Array.isArray(det)) det = det[0]; // si tu API devuelve array
                    acc[m.id] = det || {};
                } catch (e) {
                    acc[m.id] = {};
                }
            }

            if (!cancel) setDetallesById(acc);
        }

        if (seleccionadas && seleccionadas.length) fetchDetalles();
        else setDetallesById({});

        return () => {
            cancel = true;
        };
    }, [seleccionadas]);

    // Sesión 1: Información general (Paso 1)
    const infoGeneral = useMemo(() => buildInfoGeneral(raw), [raw]);

    // Sesión 2A: Listado simple (nombre/tipo/costo/min/max) si lo necesitas
    const materias = useMemo(
        () => buildMateriasSeleccionadas(seleccionadas, restricciones),
        [seleccionadas, restricciones]
    );

    // Sesión 2B: Detalles bromatológicos por materia (para la tabla)
    const detalleKeys = DETALLE_KEYS; // ["MS","EM","NDT","PB","Ca","P","Mg","Na","K","S","FDN","EE","CNF"]
    const materiasConDetalles = useMemo(
        () => buildDetallesBromatologicos(seleccionadas, detallesById, detalleKeys),
        [seleccionadas, detallesById, detalleKeys]
    );

    return { infoGeneral, materias, materiasConDetalles, detalleKeys };
}
