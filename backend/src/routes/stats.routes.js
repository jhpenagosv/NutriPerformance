import { Router } from "express";
import {
    getClasificacionCount,
    getMateriasPorClasificacion,
} from "../controllers/stats.controller.js";

const router = Router();

router.get("/clasificacion", getClasificacionCount);
// nuevo: materias por clasificación
router.get("/materias-por-clasificacion", getMateriasPorClasificacion);

export default router;
