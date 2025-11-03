import "./Acerca.css";
import { getAcercaDocs } from "../../controllers/acerca.controller.js";

export default function Acerca() {
    const docs = getAcercaDocs();

    return (
        <section className="acerca wrap" aria-labelledby="acerca-title">
            <header className="acerca-header">
                <h1 id="acerca-title">Acerca NutriPerformance</h1>
                <p className="acerca-lead">
                    NutriPerformance es una herramienta web para formular dietas bovinas
                    balanceadas en el Sumapaz, optimizando desempeño y costos bajo
                    lineamientos académicos de la Universidad de Cundinamarca.
                </p>
            </header>

            <div className="acerca-grid">
                {docs.map((d) => (
                    <article className="card" key={d.titulo}>
                        <h3 className="card-title">{d.titulo}</h3>
                        <div className="card-divider" />
                        <p className="card-desc">{d.descripcion}</p>
                        <a
                            href={d.archivo}
                            className="btn-download"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                        >
                            <svg
                                className="pdf-icon"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16a2 2 0 0 0 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM8 13h2a2 2 0 0 1 0 4H8v-4zm2 3a1 1 0 0 0 0-2H9v2h1zm3-3h2a1.5 1.5 0 0 1 0 3h-1v1h-1v-4zm2 2a.5.5 0 0 0 0-1h-1v1h1zm-5-5V3.5L16.5 10H11z" />
                            </svg>
                            Descargar
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
}