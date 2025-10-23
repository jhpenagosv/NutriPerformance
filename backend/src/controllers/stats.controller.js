import {
    countClasificacionModel,
    materiasPorClasificacionModel,
} from "../models/stats.model.js";

export async function getClasificacionCount(req, res, next) {
    try {
        const count = await countClasificacionModel();
        res.json({ count });
    } catch (err) { next(err); }
}

export async function getMateriasPorClasificacion(req, res, next) {
    try {
        const data = await materiasPorClasificacionModel();
        res.json({ data });
    } catch (err) { next(err); }
}
