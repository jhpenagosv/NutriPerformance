import express from "express";
import cors from "cors";
import indexRoutes from "./routes/index.js";
import materiaRoutes from "./routes/materia.routes.js";
import clasificacionRoutes from "./routes/clasificacion.routes.js";

const app = express();

// ======================
// 🔹 CONFIGURAR CORS
// ======================
const FRONTEND_URL = "http://localhost:3000";
app.use(
    cors({
        origin: FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ======================
// 🔹 MIDDLEWARES BASE
// ======================
app.use(express.json());

// ======================
// 🔹 RUTAS
// ======================
app.use("/api", indexRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/clasificaciones", clasificacionRoutes);

// ======================
// 🔹 RUTA DE PRUEBA (opcional)
// ======================
app.get("/api/ping", (req, res) => {
    res.json({ ok: true, message: "Servidor backend operativo 🚀" });
});

// ======================
// 🔹 INICIAR SERVIDOR AQUÍ
// ======================
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
