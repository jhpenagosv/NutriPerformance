import { Router } from "express";
import { searchMaterias, getDetalleMateria } from "../controllers/materia.controller.js";

const router = Router();

router.get("/search", searchMaterias);      // /api/materia/search?query=soya  (o vacío)
router.get("/:id/detalle", getDetalleMateria);

export default router;
