import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../../img/logo.png"; // ruta del logo institucional

export default function Navbar() {
    return (
        <header className="navbar" role="banner">
            <nav className="nav" role="navigation" aria-label="Principal">
                <div className="brand">
                    <img src={logo} alt="Logo NutriPerformance" className="brand-logo" />
                    <span className="brand-name">NutriPerformance</span>

                    {/* Menú pegado al logo */}
                    <ul className="menu">
                        <li><NavLink to="/" className="link">Inicio</NavLink></li>
                        <li><NavLink to="/dieta" className="link">Formule una dieta</NavLink></li>
                        <li><NavLink to="/materias" className="link">Banco de materias primas</NavLink></li>
                        <li><NavLink to="/acerca" className="link">Acerca</NavLink></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
