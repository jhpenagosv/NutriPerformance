import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ROUTES } from "./utils/routes";

// Vistas
import Inicio from "./views/Inicio/Inicio";
import Dieta from "./views/dieta/Dieta";
import Producto from "./views/Producto/Producto";
import Acerca from "./views/Acerca/Acerca";
import Visualizar from "./views/Visualizar/Visualizar";

// Navbar
import Navbar from "./views/navbar/navbar";

// Estilos base opcionales
import "./index.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path={ROUTES.HOME} element={<Inicio />} />
          <Route path={ROUTES.DIETA} element={<Dieta />} />
          <Route path={ROUTES.PRODUCTO} element={<Producto />} />
          <Route path={ROUTES.ACERCA} element={<Acerca />} />
          <Route path={ROUTES.VISUAL} element={<Visualizar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
