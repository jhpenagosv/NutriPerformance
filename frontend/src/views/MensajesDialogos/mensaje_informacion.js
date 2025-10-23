import React from "react";
import "./mensaje_informacion.css";

/**
 * Panel visual informativo reutilizable
 * @param {string} type - "info" | "success" | "warning" | "error"
 */
export default function MensajeInformacion({ open, title, message, type = "info", onClose }) {
  if (!open) return null;

  return (
    <div className="info-overlay">
      <div className={`info-box ${type}`}>
        <h2 className="info-title">{title || "Aviso"}</h2>
        <p className="info-message">{message}</p>

        <div className="info-actions">
          <button className="info-btn" onClick={onClose}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
