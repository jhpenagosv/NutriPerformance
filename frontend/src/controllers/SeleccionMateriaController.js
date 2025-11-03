import { getMaterias } from "../Api/materia.api";
import { getClasificaciones } from "../Api/clasificacion.api";
import { normalizeMaterias } from "../models/materia.model";

const SESSION_TEMP_KEY = "np_materias_temporales_session_v1";
const SESSION_SEL_KEY = "np_materias_seleccionadas_v1";

function readTemporalesFromSession() {
    try { const a = JSON.parse(sessionStorage.getItem(SESSION_TEMP_KEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch { return []; }
}
function writeTemporalesToSession(arr) {
    try { sessionStorage.setItem(SESSION_TEMP_KEY, JSON.stringify(arr || [])); } catch { }
}
function readSeleccionadasFromSession() {
    try { const a = JSON.parse(sessionStorage.getItem(SESSION_SEL_KEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch { return []; }
}
function writeSeleccionadasToSession(arr) {
    try { sessionStorage.setItem(SESSION_SEL_KEY, JSON.stringify(arr || [])); } catch { }
}

export class SeleccionMateriaController {
    constructor({ DietasController } = {}) {
        this.DietasController = DietasController ?? null;

        this.state = {
            q: "",
            clasificacionId: "",
            clasificaciones: [],
            banco: [],
            temporales: [],
            seleccionadas: readSeleccionadasFromSession(),
            checksTemporales: new Set(),
            loading: false,
            error: null,
        };

        this._listeners = new Set();
    }

    subscribe(fn) { this._listeners.add(fn); try { fn(this.snapshot()); } catch { } return () => this._listeners.delete(fn); }
    _emit() { const s = this.snapshot(); for (const fn of this._listeners) fn(s); }
    snapshot() {
        return {
            q: this.state.q,
            clasificacionId: this.state.clasificacionId,
            clasificaciones: [...this.state.clasificaciones],
            banco: [...this.state.banco],
            temporales: [...this.state.temporales],
            seleccionadas: [...this.state.seleccionadas],
            checksTemporales: new Set(this.state.checksTemporales),
            loading: this.state.loading,
            error: this.state.error,
        };
    }

    async init() {
        this._loadTemporalesFromSession();
        await this._loadClasificaciones();
        await this.search();
    }

    _loadTemporalesFromSession() {
        const raws = readTemporalesFromSession();
        this.state.temporales = raws.map(r => ({
            id: String(r.id),
            nombre: String(r.nombre),
            clasificacion: "Temporal",
        }));
        this._emit();
    }

    async _loadClasificaciones() {
        try {
            const data = await getClasificaciones();
            this.state.clasificaciones = Array.isArray(data) ? data : [];
            this._emit();
        } catch { }
    }

    setQuery(q) { this.state.q = q ?? ""; this._emit(); this.search(); }
    setClasificacion(id) { this.state.clasificacionId = id ?? ""; this._emit(); this.search(); }

    async search() {
        try {
            this.state.loading = true; this.state.error = null; this._emit();
            const data = await getMaterias({
                q: this.state.q || undefined,
                clasificacionId: this.state.clasificacionId || undefined,
            });
            this.state.banco = normalizeMaterias(data);
        } catch (e) {
            this.state.error = "No se pudo cargar la lista desde el servidor.";
        } finally {
            this.state.loading = false; this._emit();
        }
    }

    getFilteredTemporales() {
        const q = (this.state.q || "").trim().toLowerCase();
        if (!q) return this.state.temporales;
        return this.state.temporales.filter(t => t.nombre?.toLowerCase?.().includes(q));
    }
    isSeleccionada(id) { return this.state.seleccionadas.some(s => String(s.id) === String(id)); }

    _persistSeleccionadas() {
        writeSeleccionadasToSession(this.state.seleccionadas);
        if (this.DietasController?.setMaterias) {
            this.DietasController.setMaterias([...this.state.seleccionadas]);
        }
    }

    toggleBancoCheck(m) {
        const id = String(m.id);
        if (this.isSeleccionada(id)) {
            this.state.seleccionadas = this.state.seleccionadas.filter(s => String(s.id) !== id);
        } else {
            this.state.seleccionadas = [
                ...this.state.seleccionadas,
                { id, nombre: m.nombre ?? "Sin nombre", clasificacion: m.clasificacion ?? "" },
            ];
        }
        this._persistSeleccionadas();
        this._emit();
    }

    toggleTemporalCheck(idRaw) {
        const id = String(idRaw);
        // marcar para acciones (borrado en bloque)
        const set = this.state.checksTemporales;
        if (set.has(id)) set.delete(id); else set.add(id);

        const temp = this.state.temporales.find(t => String(t.id) === id);
        if (temp) {
            if (this.isSeleccionada(id)) {
                this.state.seleccionadas = this.state.seleccionadas.filter(s => String(s.id) !== id);
            } else {
                this.state.seleccionadas = [
                    ...this.state.seleccionadas,
                    { id, nombre: temp.nombre, clasificacion: "Temporal" },
                ];
            }
            this._persistSeleccionadas();
        }
        this._emit();
    }

    addTemporal(m) {
        const id = String(m.id);
        if (this.state.temporales.some(t => String(t.id) === id)) return;
        this.state.temporales = [
            ...this.state.temporales,
            { id, nombre: m.nombre ?? "Sin nombre", clasificacion: "Temporal" },
        ];
        writeTemporalesToSession(this.state.temporales);
        this._emit();
    }

    eliminarTemporalesSeleccionados() {
        const ids = new Set([...this.state.checksTemporales].map(String));
        if (!ids.size) return;

        this.state.temporales = this.state.temporales.filter(t => !ids.has(String(t.id)));
        writeTemporalesToSession(this.state.temporales);

        this.state.seleccionadas = this.state.seleccionadas.filter(s => !ids.has(String(s.id)));
        this._persistSeleccionadas();

        this.state.checksTemporales = new Set();
        this._emit();
    }

    eliminarTemporalesTodos() {
        const idSet = new Set(this.state.temporales.map(t => String(t.id)));
        this.state.temporales = [];
        writeTemporalesToSession([]);

        this.state.seleccionadas = this.state.seleccionadas.filter(s => !idSet.has(String(s.id)));
        this._persistSeleccionadas();

        this.state.checksTemporales = new Set();
        this._emit();
    }

    getSelectedNames() { return this.state.seleccionadas.map(s => s.nombre).filter(Boolean); }
}