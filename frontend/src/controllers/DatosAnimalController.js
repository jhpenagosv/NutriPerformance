import { useMemo, useState } from "react";
import { initialDatosAnimal, computePesoMedio } from "../models/datosAnimal.model";
import { computeFormulasBySelection } from "../models/formulas";

export function useDatosAnimalController(onSiguiente) {
    const [form, setForm] = useState(initialDatosAnimal);

    const pesoMedio = useMemo(
        () => computePesoMedio(form.pesoInicial, form.pesoFinal),
        [form.pesoInicial, form.pesoFinal]
    );

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleNext = async () => {
        const required = ["raza", "sistema", "sexo", "pesoInicial", "pesoFinal", "pesoDiario", "tempMax", "humedad"];
        const missing = required.filter(k => !form[k] && form[k] !== 0);
        if (missing.length) {
            alert("Por favor completa todos los campos requeridos en Paso 1.");
            return;
        }

        const ctx = {
            P3: parseFloat(form.pesoInicial),
            Q3: parseFloat(form.pesoFinal),
            T3: parseFloat(form.pesoDiario),
            V3: parseFloat(form.tempMax),
            W3: parseFloat(form.humedad),
        };

        const selection = { raza: form.raza, sistema: form.sistema, sexo: form.sexo };

        try {
            const { resultados, controlKey, controlValue, order, variant } =
                await computeFormulasBySelection(selection, ctx);

            if (onSiguiente) onSiguiente({ ...form, pesoMedio, resultados, controlKey, controlValue, order, variant });
        } catch (error) {
            console.error(error);
            alert(error.message || "Error en el cálculo de las fórmulas");
        }
    };

    return { form, updateField, pesoMedio, handleNext };
}