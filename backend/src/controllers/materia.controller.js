import { searchMateriasModel, detalleMateriaModel } from "../models/materia.model.js";

export async function searchMaterias(req, res, next) {
    try {
        const q = req.query.query || "";
        const clasificacion_id = req.query.clasificacion_id || null;
        const data = await searchMateriasModel(q, clasificacion_id);
        res.json({ data });
    } catch (err) {
        next(err);
    }
}

export async function getDetalleMateria(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!Number.isFinite(id)) return res.status(400).json({ error: "id inválido" });
        const data = await detalleMateriaModel(id);
        res.json(data);
    } catch (err) {
        next(err);
    }
}
