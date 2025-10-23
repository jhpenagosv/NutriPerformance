export function filterByQuery(list, q, field = "materia_prima") {
  const s = (q || "").trim().toLowerCase();
  if (!s) return list;
  return list.filter((x) => String(x?.[field] || "").toLowerCase().includes(s));
}

export function topN(list, n = 10) {
  return Array.isArray(list) ? list.slice(0, n) : [];
}
