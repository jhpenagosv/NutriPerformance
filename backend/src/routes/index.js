import { Router } from "express";
import materias from "./materiasPrimas.routes.js";

const router = Router();
router.get("/dietas/ping", (req, res) => res.json({ ok: true, ts: Date.now() }));
router.use("/materias-primas", materias);
export default router;
