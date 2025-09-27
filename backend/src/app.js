import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import "./config/db.js"; // inicializa el pool; si hay error lo verás en consola

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3009;
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
