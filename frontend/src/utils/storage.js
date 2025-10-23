const KEY = "np_productos_temporales_v1";

export function readTemporales() {
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

export function writeTemporales(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list || [])); }
  catch { /* ignore */ }
}
