import { Router } from "express";
import statsRoutes from "./stats.routes.js";
import materiaRoutes from "./materia.routes.js";

const router = Router();
router.use("/stats", statsRoutes);
router.use("/materia", materiaRoutes);

export default router;
