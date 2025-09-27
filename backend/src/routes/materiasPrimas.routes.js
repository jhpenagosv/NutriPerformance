import { Router } from "express";
import { listarMateriasPrimas } from "../controllers/materiasPrimas.controller.js";

const router = Router();
router.get("/", listarMateriasPrimas);
export default router;
