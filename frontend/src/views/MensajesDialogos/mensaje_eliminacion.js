import React from "react";
import "./mensaje_eliminacion.css";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h2 className="confirm-title">{title || "Confirmación"}</h2>
        <p className="confirm-message">{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-btn confirm" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
