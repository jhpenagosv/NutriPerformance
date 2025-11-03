export const initialDatosAnimal = {
    raza: "", sistema: "", sexo: "",
    pesoInicial: "", pesoFinal: "", pesoDiario: "",
    tempMax: "", humedad: ""
};

export function computePesoMedio(pesoInicial, pesoFinal) {
    const pi = parseFloat(pesoInicial);
    const pf = parseFloat(pesoFinal);
    if (isNaN(pi) || isNaN(pf)) return "";
    return ((pi + pf) / 2).toFixed(2);
}