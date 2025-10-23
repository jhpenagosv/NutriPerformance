// Redondea a 4 decimales pero NO rellena con ceros a la derecha.
// 12.3000 -> "12.3", 72.1800 -> "72.18", 0.0000 -> "0"
export function fmt10_4(v) {
  if (v === null || v === undefined || v === "") return "";
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  if (!Number.isFinite(n)) return "";

  const s = n.toFixed(4);           // precisión de 4
  if (s === "0.0000") return "0";   // caso exacto cero

  // quita ceros a la derecha y el punto si queda colgando
  return s
    .replace(/(\.\d*?[1-9])0+$/,"$1")
    .replace(/\.0+$/,".0")
    .replace(/\.$/,"");
}
