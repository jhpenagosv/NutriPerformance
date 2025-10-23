// src/routes/materiasPrimas.routes.js
import { Router } from "express";
import {
  getMateriasPrimas,
  getMateriasPrimasRaw, // ⬅️ opcional
} from "../controllers/materiasPrimas.controller.js";

const router = Router();

router.get("/", getMateriasPrimas);

// ⬇️ (Opcional) expone valores crudos sin promediar/redondear
router.get("/raw", getMateriasPrimasRaw);

export default router;
