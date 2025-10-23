// Normaliza el modelo de "Datos del animal" para el Paso 1.
export function emptyAnimal() {
  return {
    // radios
    tipo: "",          // "cebu" | "carne" | "leche"
    sistema: "",       // "estabulacion" | "pastoreo"
    sexo: "",          // "entero" | "castrado" | "hembra"
    // numéricos
    pesoIni: "",
    pesoFin: "",
    pesoDia: "",
    tMax: "",
    hum: "",
  };
}

export function AnimalModel(row = {}) {
  return {
    tipo: row.tipo ?? "",
    sistema: row.sistema ?? "",
    sexo: row.sexo ?? "",
    pesoIni: row.pesoIni ?? "",
    pesoFin: row.pesoFin ?? "",
    pesoDia: row.pesoDia ?? "",
    tMax: row.tMax ?? "",
    hum: row.hum ?? "",
  };
}
