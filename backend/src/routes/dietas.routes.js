import { Router } from "express";
import {
  ping, crearDieta, setDatosAnimal, setRequisitos,
  setSeleccion, setRestricciones, getDieta
} from "../controllers/dietas.controller.js";

const router = Router();

router.get("/ping", ping);
router.post("/", crearDieta);
router.put("/:id/datos-animal", setDatosAnimal);
router.put("/:id/requisitos", setRequisitos);
router.put("/:id/seleccion", setSeleccion);
router.put("/:id/restricciones", setRestricciones);
router.get("/:id", getDieta);

export default router;
