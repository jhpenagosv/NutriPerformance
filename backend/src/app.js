import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes);          // ← aquí queda /api/stats/clasificacion

app.use(notFound);
app.use(errorHandler);

export default app;
