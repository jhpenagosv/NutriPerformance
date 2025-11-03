import { Router } from 'express';
import {
    getCantidadClasificacion,
    getCantidadMateriaPorClasificacion,
    getAllClasificaciones
} from '../controllers/clasificacion.controller.js';

const router = Router();

router.get('/', getAllClasificaciones);                 // NUEVO
router.get('/count', getCantidadClasificacion);
router.get('/materias/count', getCantidadMateriaPorClasificacion);

export default router;
