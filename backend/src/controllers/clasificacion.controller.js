// src/controllers/clasificacion.controller.js
import {
    getCountClasificacion,
    getCountMateriaGroupByClasificacion,
    listClasificaciones,
} from '../models/clasificacion.model.js';

export async function getAllClasificaciones(req, res) {
    try {
        const data = await listClasificaciones();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error listando clasificaciones' });
    }
}

export async function getCantidadClasificacion(req, res) {
    try {
        const total = await getCountClasificacion();
        res.json({ total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo cantidad de clasificaciones' });
    }
}

export async function getCantidadMateriaPorClasificacion(req, res) {
    try {
        const filas = await getCountMateriaGroupByClasificacion();
        res.json(filas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo cantidad de materias por clasificación' });
    }
}
