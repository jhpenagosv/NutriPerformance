// src/controllers/SideStatsController.js
import { getClasificaciones } from "../Api/clasificacion.api";
import { getMaterias } from "../Api/materia.api";

export class SideStatsController {
    constructor({ refreshMs = 30000 } = {}) {
        this.state = { loading: false, error: null, total: 0, items: [] };
        this.refreshMs = refreshMs;
        this._timer = null;
        this._subs = new Set();
    }

    subscribe(fn) { this._subs.add(fn); try { fn(this.snapshot()); } catch { } return () => this._subs.delete(fn); }
    _emit() { const s = this.snapshot(); for (const fn of this._subs) fn(s); }
    snapshot() { return { ...this.state, items: [...this.state.items] }; }

    async _loadOnce() {
        try {
            this.state.loading = true; this.state.error = null; this._emit();

            const clasifs = await getClasificaciones();
            const safeClasifs = Array.isArray(clasifs) ? clasifs : [];

            const counts = await Promise.all(
                safeClasifs.map(async (c) => {
                    try {
                        const mats = await getMaterias({ clasificacionId: c.id });
                        return { id: c.id, nombre: c.nombre, count: Array.isArray(mats) ? mats.length : 0 };
                    } catch {
                        return { id: c.id, nombre: c.nombre, count: 0 };
                    }
                })
            );

            counts.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
            this.state.items = counts;
            this.state.total = counts.length;
            this.state.loading = false;
            this._emit();
        } catch (e) {
            this.state.loading = false;
            this.state.error = "No se pudo cargar la clasificación.";
            this._emit();
        }
    }

    async start() {
        await this._loadOnce();
        if (this._timer) clearInterval(this._timer);
        this._timer = setInterval(() => this._loadOnce(), this.refreshMs);
    }

    pause() { if (this._timer) { clearInterval(this._timer); this._timer = null; } }
    destroy() { this.pause(); this._subs.clear(); }
}