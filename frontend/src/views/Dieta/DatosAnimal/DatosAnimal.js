// src/views/Dieta/DatosAnimal/DatosAnimal.js
import React from "react";
import "./DatosAnimal.css";
import { message } from "../../Mensaje/Mensaje";
import { useDatosAnimalController } from "../../../controllers/DatosAnimalController";

export default function DatosAnimal({ onSiguiente }) {
    const { form, updateField, pesoMedio, handleNext } = useDatosAnimalController(onSiguiente);

    // ✅ Validar antes de avanzar
    const handleNextStep = () => {
        // Validaciones básicas
        if (!form.raza) {
            return message.alert({
                title: "Campo requerido",
                text: "Selecciona la raza del animal antes de continuar.",
                buttonText: "Entendido",
            });
        }

        if (!form.sistema) {
            return message.alert({
                title: "Campo requerido",
                text: "Selecciona el sistema de producción (estabulación o pastoreo).",
                buttonText: "Entendido",
            });
        }

        if (!form.sexo) {
            return message.alert({
                title: "Campo requerido",
                text: "Selecciona el sexo del animal (macho entero, castrado o hembra).",
                buttonText: "Entendido",
            });
        }

        if (!form.pesoInicial || !form.pesoFinal || !form.pesoDiario || !form.tempMax || !form.humedad) {
            return message.alert({
                title: "Campos incompletos",
                text: "Por favor completa todos los datos numéricos antes de continuar (peso inicial, final, ganancia diaria, temperatura y humedad).",
                buttonText: "Corregir",
            });
        }

        // Si todo está correcto → avanzar
        handleNext();
    };

    return (
        <div className="da">
            {/* RAZA */}
            <div className="da__group">
                <div className="da__legend">
                    RAZA <span className="da__req">*</span>
                </div>
                <div className="da__radios">
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="raza"
                            value="cebu"
                            checked={form.raza === "cebu"}
                            onChange={(e) => updateField("raza", e.target.value)}
                        />
                        Cebú
                    </label>
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="raza"
                            value="cruzadocarne"
                            checked={form.raza === "cruzadocarne"}
                            onChange={(e) => updateField("raza", e.target.value)}
                        />
                        Cruzado (Carne)
                    </label>
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="raza"
                            value="cruzadoleche"
                            checked={form.raza === "cruzadoleche"}
                            onChange={(e) => updateField("raza", e.target.value)}
                        />
                        Cruzado (Leche)
                    </label>
                </div>
            </div>

            {/* SISTEMA DE PRODUCCIÓN */}
            <div className="da__group">
                <div className="da__legend">
                    SISTEMA DE PRODUCCIÓN <span className="da__req">*</span>
                </div>
                <div className="da__radios">
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="sistema"
                            value="estabulacion"
                            checked={form.sistema === "estabulacion"}
                            onChange={(e) => updateField("sistema", e.target.value)}
                        />
                        Estabulación
                    </label>
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="sistema"
                            value="pastoreo"
                            checked={form.sistema === "pastoreo"}
                            onChange={(e) => updateField("sistema", e.target.value)}
                        />
                        Pastoreo
                    </label>
                </div>
            </div>

            {/* SEXO */}
            <div className="da__group">
                <div className="da__legend">
                    SEXO <span className="da__req">*</span>
                </div>
                <div className="da__radios">
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="sexo"
                            value="macho_entero"
                            checked={form.sexo === "macho_entero"}
                            onChange={(e) => updateField("sexo", e.target.value)}
                        />
                        Macho entero
                    </label>
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="sexo"
                            value="macho_castrado"
                            checked={form.sexo === "macho_castrado"}
                            onChange={(e) => updateField("sexo", e.target.value)}
                        />
                        Macho castrado
                    </label>
                    <label className="da__radio">
                        <input
                            type="radio"
                            name="sexo"
                            value="hembra"
                            checked={form.sexo === "hembra"}
                            onChange={(e) => updateField("sexo", e.target.value)}
                        />
                        Hembra
                    </label>
                </div>
            </div>

            {/* DATOS DEL ANIMAL */}
            <div className="da__group">
                <div className="da__legend">
                    DATOS DEL ANIMAL <span className="da__req">*</span>
                </div>

                <div className="da__grid">
                    {/* Peso inicial */}
                    <div className="da__field">
                        <div className="da__input-wrap da__suffix--kg">
                            <input
                                className="da__input"
                                placeholder="Ej: 510"
                                inputMode="decimal"
                                value={form.pesoInicial}
                                onChange={(e) => updateField("pesoInicial", e.target.value)}
                            />
                        </div>
                        <div className="da__label">Peso inicial *</div>
                    </div>

                    {/* Peso final */}
                    <div className="da__field">
                        <div className="da__input-wrap da__suffix--kg">
                            <input
                                className="da__input"
                                placeholder="Ej: 530"
                                inputMode="decimal"
                                value={form.pesoFinal}
                                onChange={(e) => updateField("pesoFinal", e.target.value)}
                            />
                        </div>
                        <div className="da__label">Peso final *</div>
                    </div>

                    {/* Peso promedio */}
                    <div className="da__field">
                        <div className="da__input-wrap da__suffix--kg">
                            <input
                                className="da__input da__input--readonly"
                                value={pesoMedio || ""}
                                readOnly
                            />
                        </div>
                        <div className="da__label">Peso promedio</div>
                    </div>

                    {/* Ganancia diaria */}
                    <div className="da__field">
                        <div className="da__input-wrap da__suffix--kg">
                            <input
                                className="da__input"
                                placeholder="Ej: 1.5"
                                inputMode="decimal"
                                value={form.pesoDiario}
                                onChange={(e) => updateField("pesoDiario", e.target.value)}
                            />
                        </div>
                        <div className="da__label">Ganancia diaria *</div>
                    </div>

                    {/* Temperatura */}
                    <div className="da__field">
                        <div className="da__input-wrap da__suffix--c">
                            <input
                                className="da__input"
                                placeholder="Ej: 35"
                                inputMode="decimal"
                                value={form.tempMax}
                                onChange={(e) => updateField("tempMax", e.target.value)}
                            />
                        </div>
                        <div className="da__label">Temperatura máxima *</div>
                    </div>

                    {/* Humedad */}
                    <div className="da__field">
                        <div className="da__input-wrap da__suffix--pct">
                            <input
                                className="da__input"
                                placeholder="Ej: 80"
                                inputMode="decimal"
                                value={form.humedad}
                                onChange={(e) => updateField("humedad", e.target.value)}
                            />
                        </div>
                        <div className="da__label">Humedad *</div>
                    </div>
                </div>
            </div>

            {/* Botón siguiente */}
            <div className="step-buttons">
                <button className="btn-step btn-next" onClick={handleNextStep}>
                    Siguiente
                </button>
            </div>
        </div>
    );
}
