// Normaliza una fila de "materias primas" tal como la devuelve tu backend.
// NOTA: guardamos los nutrientes "tal cual" vienen (sin toFixed aquí).
export function ProductModel(row = {}) {
  // Usa 'id' si existe; si no, materia_prima como clave estable para la UI.
  const id =
    row.id ??
    row._id ??
    row.id_materia ??
    row.codigo ??
    row.materia_prima ??
    null;

  const nutrientCodes = [
    "MS","EE","EM","CSF","FDN","NDT","EN","PDR","PND","PC","PM",
    "Ca","P","Mg","K","Na","S","Co","Cu","I","Mn","Se","Zn"
  ];

  const nutrientes = {};
  for (const code of nutrientCodes) {
    // Deja el valor crudo; el formateo se hace en la vista (fmt10_4)
    nutrientes[code] = row[code] ?? row[code.toLowerCase()] ?? "";
  }

  return {
    id,
    materia_prima: row.materia_prima ?? row.nombre ?? row.name ?? "",
    nutrientes,
  };
}
