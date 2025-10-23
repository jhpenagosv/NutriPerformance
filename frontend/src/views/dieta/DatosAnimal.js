import React, { useEffect, useMemo, useRef, useState } from "react";
import "./DatosAnimal.css";
import { buildPreviewUrl } from "../../utils/routes";
import MensajeInformacion from "../MensajesDialogos/mensaje_informacion"; // ✅ panel informativo como en RestriccionProducto

export default function DatosAnimal({ value, onChange, onNext, onSiguiente, onPreview }) {
  const [form, setForm] = useState({
    // Radios
    tipoAnimal: "",            // cebu | carne | leche
    sistemaAlimentacion: "",   // estabulacion | pastoreo
    sexoCondicion: "",         // macho_entero | macho_castrado | hembra
    // Información del animal
    pesoIni: "",               // P3
    pesoFin: "",               // Q3
    pesoDia: "",               // T3
    tMax: "",                  // V3
    hum: "",                   // W3
  });

  // ⬇️ Estado para el panel informativo (mismo patrón que RestriccionProducto)
  const [info, setInfo] = useState({ open: false, message: "", type: "warning" });

  /* -------- Hidratar una sola vez desde "value" -------- */
  const hydratedOnce = useRef(false);
  useEffect(() => {
    if (!hydratedOnce.current && value && typeof value === "object") {
      setForm((prev) => ({ ...prev, ...value }));
      hydratedOnce.current = true;
    }
  }, [value]);

  /* -------- Propagar cambios al padre -------- */
  useEffect(() => {
    onChange?.(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const setField = (name) => (e) => {
    const v = e.target.value;
    setForm((prev) => (prev[name] === v ? prev : { ...prev, [name]: v }));
  };

  // Derivados
  const P3 = parseFloat(form.pesoIni) || 0;
  const Q3 = parseFloat(form.pesoFin) || 0;
  const R3 = useMemo(() => ((P3 + Q3) > 0 ? (P3 + Q3) / 2 : 0), [P3, Q3]);
  const T3 = parseFloat(form.pesoDia) || 0;
  const V3 = parseFloat(form.tMax) || 0;
  const W3 = parseFloat(form.hum) || 0;

  // Validación mínima (requeridos no vacíos)
  const canNext =
    form.tipoAnimal &&
    form.sistemaAlimentacion &&
    form.sexoCondicion &&
    form.pesoIni !== "" &&
    form.pesoFin !== "" &&
    form.pesoDia !== "" &&
    form.tMax !== "" &&
    form.hum !== "";

  // Avanzar solo si está completo — mismo enfoque que RestriccionProducto (panel)
  const handleNext = () => {
    if (!canNext) {
      setInfo({
        open: true,
        message: "Por favor, completa todos los campos obligatorios (marcados con *) antes de continuar.",
        type: "warning",
      });
      return;
    }
    const payload = { ...form, R3 };
    (onNext || onSiguiente)?.(payload);
  };

  const handlePreview = () => {
    const url = buildPreviewUrl({ P3, Q3, R3, T3, V3, W3 });
    if (onPreview) return onPreview({ ...form, R3, url });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="ani-wrap">
      <h2 className="ani-title">Datos del animal</h2>

      {/* TIPO ANIMAL */}
      <div className="ani-section">
        <div className="ani-section-title">
          TIPO ANIMAL <span className="req">*</span>
        </div>
        <div className="ani-radios">
          <label><input type="radio" name="tipoAnimal" value="cebu"
                  checked={form.tipoAnimal === "cebu"}
                  onChange={setField("tipoAnimal")} /> Cebú</label>
          <label><input type="radio" name="tipoAnimal" value="carne"
                  checked={form.tipoAnimal === "carne"}
                  onChange={setField("tipoAnimal")} /> Bovino de carne</label>
          <label><input type="radio" name="tipoAnimal" value="leche"
                  checked={form.tipoAnimal === "leche"}
                  onChange={setField("tipoAnimal")} /> Bovino de leche</label>
        </div>
      </div>

      {/* SISTEMA DE ALIMENTACIÓN */}
      <div className="ani-section">
        <div className="ani-section-title">
          SISTEMA DE ALIMENTACIÓN <span className="req">*</span>
        </div>
        <div className="ani-radios">
          <label><input type="radio" name="sistemaAlimentacion" value="estabulacion"
                  checked={form.sistemaAlimentacion === "estabulacion"}
                  onChange={setField("sistemaAlimentacion")} /> Estabulación</label>
          <label><input type="radio" name="sistemaAlimentacion" value="pastoreo"
                  checked={form.sistemaAlimentacion === "pastoreo"}
                  onChange={setField("sistemaAlimentacion")} /> Pastoreo</label>
        </div>
      </div>

      {/* SEXO Y CONDICIÓN */}
      <div className="ani-section">
        <div className="ani-section-title">
          SEXO Y CONDICIÓN REPRODUCTIVA DEL ANIMAL <span className="req">*</span>
        </div>
        <div className="ani-radios">
          <label><input type="radio" name="sexoCondicion" value="macho_entero"
                  checked={form.sexoCondicion === "macho_entero"}
                  onChange={setField("sexoCondicion")} /> Macho entero</label>
          <label><input type="radio" name="sexoCondicion" value="macho_castrado"
                  checked={form.sexoCondicion === "macho_castrado"}
                  onChange={setField("sexoCondicion")} /> Macho castrado</label>
          <label><input type="radio" name="sexoCondicion" value="hembra"
                  checked={form.sexoCondicion === "hembra"}
                  onChange={setField("sexoCondicion")} /> Hembra</label>
        </div>
      </div>

      {/* INFORMACIÓN DEL ANIMAL */}
      <div className="ani-section">
        <div className="ani-section-title">INFORMACIÓN DEL ANIMAL</div>

        <div className="ani-grid four">
          <div className="ani-field">
            <input
              className="ani-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.pesoIni}
              onChange={setField("pesoIni")}
              placeholder="Ej: 250"
            />
            <div className="ani-help">
              <strong>Peso inicial animal (kg)</strong> <span className="req">*</span>
            </div>
          </div>

          <div className="ani-field">
            <input
              className="ani-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.pesoFin}
              onChange={setField("pesoFin")}
              placeholder="Ej: 420"
            />
            <div className="ani-help">
              <strong>Peso final del animal (kg)</strong> <span className="req">*</span>
            </div>
          </div>

          <div className="ani-field">
            <input
              className="ani-input"
              value={R3 ? R3.toFixed(2) : ""}
              readOnly
              placeholder="Promedio"
              title="(P3 + Q3) / 2"
            />
            <div className="ani-help"><strong>Peso promedio del animal (kg)</strong></div>
          </div>

          <div className="ani-field">
            <input
              className="ani-input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.pesoDia}
              onChange={setField("pesoDia")}
              placeholder="Ej: 0.9"
            />
            <div className="ani-help">
              <strong>Peso diario del animal (kg)</strong> <span className="req">*</span>
            </div>
          </div>
        </div>

        <div className="ani-grid two">
          <div className="ani-field">
            <input
              className="ani-input"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={form.tMax}
              onChange={setField("tMax")}
              placeholder="Ej: 35"
            />
            <div className="ani-help">
              <strong>T. max</strong> <span className="req">*</span>
            </div>
          </div>

          <div className="ani-field">
            <input
              className="ani-input"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="0.1"
              value={form.hum}
              onChange={setField("hum")}
              placeholder="Ej: 70"
            />
            <div className="ani-help">
              <strong>HUM</strong> <span className="req">*</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="ani-actions">
        <button
          type="button"
          className="ani-btn primary"
          onClick={handleNext}
          // Tip: si prefieres, puedes volver a deshabilitarlo con disabled={!canNext}
          title={!canNext ? "Completa los campos obligatorios" : undefined}
        >
          Siguiente
        </button>
        <button type="button" className="ani-btn secondary" onClick={handlePreview}>
          Vista previa
        </button>
      </div>

      {/* Panel informativo (igual patrón que RestriccionProducto) */}
      <MensajeInformacion
        open={info.open}
        title="Atención"
        message={info.message}
        type={info.type}        // "warning" | "info" | etc.
        onClose={() => setInfo({ open: false, message: "", type: "info" })}
      />
    </section>
  );
}
