import React from "react";
import "./Acerca.css";

export default function Acerca() {
  return (
    <div className="acerca">
      {/* Título principal */}
      <h1 className="acerca__title">Acerca NutriPerformance</h1>
      <hr className="acerca__divider" />

      {/* Párrafo introductorio */}
      <p className="acerca__intro">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus,
        neque nec feugiat posuere, risus urna dictum lorem, vitae laoreet lacus
        arcu a metus. Integer malesuada, lorem non pretium suscipit, lorem enim
        sodales arcu, eu volutpat risus ligula nec justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam cursus,
        neque nec feugiat posuere, risus urna dictum lorem, vitae laoreet lacus
        arcu a metus. Integer malesuada, lorem non pretium suscipit, lorem enim
        sodales arcu, eu volutpat risus ligula nec justo.
      </p>

      {/* Tarjetas / Formularios */}
      <div className="acerca__cards">
        {/* Formulario 1 */}
        <section className="acerca-card">
          <h2 className="acerca-card__title">Manual de usuario</h2>
          <hr className="acerca-card__divider" />
          <p className="acerca-card__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non
            sapien vitae lorem tristique finibus. Suspendisse potenti.
          </p>
          <a
            className="btn-download"
            href="/docs/manual-usuario.pdf"
            download
          >
            Descargar
          </a>
        </section>

        {/* Formulario 2 */}
        <section className="acerca-card">
          <h2 className="acerca-card__title">Manual técnico</h2>
          <hr className="acerca-card__divider" />
          <p className="acerca-card__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non
            sapien vitae lorem tristique finibus. Suspendisse potenti.
          </p>
          <a
            className="btn-download"
            href="/docs/manual-tecnico.pdf"
            download
          >
            Descargar
          </a>
        </section>

        {/* Formulario 3 */}
        <section className="acerca-card">
          <h2 className="acerca-card__title">Diagramas</h2>
          <hr className="acerca-card__divider" />
          <p className="acerca-card__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non
            sapien vitae lorem tristique finibus. Suspendisse potenti.
          </p>
          <a
            className="btn-download"
            href="/docs/diagramas.pdf"
            download
          >
            Descargar
          </a>
        </section>
      </div>
    </div>
  );
}
