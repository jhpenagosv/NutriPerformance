import React from "react";
import "./navbar.css";
import logo from "../../img/logo.png";
import { Link as RouterLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="navbar-logo" src={logo} alt="Logo NutriPerformance" />
        <span className="navbar-title">NutriPerformance</span>
        <div className="navbar-links">
          <RouterLink to="/" className="nav-link">Inicio</RouterLink>
          <RouterLink to="/dieta" className="nav-link">Dieta</RouterLink>
          <RouterLink to="/producto" className="nav-link">Producto</RouterLink>
          <RouterLink to="/acerca" className="nav-link">Acerca</RouterLink>
        </div>
      </div>
    </nav>
  );
}
