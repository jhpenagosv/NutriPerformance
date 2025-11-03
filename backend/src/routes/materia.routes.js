import { Router } from 'express';
import {
    listMaterias,
    getPromedioComposicion,
    getPromedioByMateria
} from '../controllers/materia.controller.js';

const router = Router();

router.get('/', listMaterias);
router.get('/composicion-promedio', getPromedioComposicion);
router.get('/:id/composicion-promedio', getPromedioByMateria);

export default router;
