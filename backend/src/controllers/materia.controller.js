import {
    getMaterias,
    getPromedioComposicionByMateriaId,
    getPromediosComposicion
} from '../models/materia.model.js';

// GET /api/materias?q=&clasificacionId=
export async function listMaterias(req, res) {
    try {
        const { q, clasificacionId } = req.query;
        const data = await getMaterias({ q, clasificacionId });
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error listando materias' });
    }
}

// GET /api/materias/:id/composicion-promedio
export async function getPromedioByMateria(req, res) {
    try {
        const id = Number(req.params.id);
        const data = await getPromedioComposicionByMateriaId(id);
        if (!data) return res.status(404).json({ error: 'Materia no encontrada' });
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error obteniendo composición promedio' });
    }
}

// GET /api/materias/composicion-promedio?materiaId=&clasificacionId=
export async function getPromedioComposicion(req, res) {
    try {
        const { materiaId, clasificacionId } = req.query;
        const data = await getPromediosComposicion({ materiaId, clasificacionId });
        res.json(data);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error obteniendo promedios de composición' });
    }
}
