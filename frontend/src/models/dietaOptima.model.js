// Normalizador del resultado de optimización para el Paso 5
export function DietaOptimaModel(input) {
  if (!input || typeof input !== "object") {
    return { composicion: [], total: 0, nutrientes: {}, costo: undefined };
  }
  const composicion = Array.isArray(input.composicion)
    ? input.composicion.map((x) => ({
        name: String(x.name ?? x.materia_prima ?? "").trim(),
        porcentaje: Number(x.porcentaje ?? x.pct ?? 0),
      })).filter((x) => x.name)
    : [];

  const total = Number(input.total ?? 0);

  const nutrientes = input.nutrientes && typeof input.nutrientes === "object"
    ? input.nutrientes
    : {};

  const costo = (input.costo != null) ? Number(input.costo) : undefined;

  return { composicion, total, nutrientes, costo };
}
