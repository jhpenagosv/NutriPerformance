import { Router } from 'express';
import clasificacionRoutes from './clasificacion.routes.js';
import materiaRoutes from './materia.routes.js';

const router = Router();

router.use('/clasificaciones', clasificacionRoutes);
router.use('/materias', materiaRoutes);

// healthcheck
router.get('/health', (_, res) => res.json({ ok: true }));

export default router;
