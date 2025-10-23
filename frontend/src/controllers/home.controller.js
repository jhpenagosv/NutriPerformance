import { API_BASE, PUBLIC_URL, TMP_KEY } from "../utils/env";

// Cuenta productos permanentes vía API
export async function getPermanentesCount() {
  const res  = await fetch(`${API_BASE}/materias-primas`);
  const text = await res.text();
  const data = res.ok ? JSON.parse(text) : [];
  return Array.isArray(data) ? data.length : 0;
}

// Cuenta productos temporales en localStorage
export function getTemporalesCount() {
  try {
    const arr = JSON.parse(localStorage.getItem(TMP_KEY) || "[]");
    return Array.isArray(arr) ? arr.length : 0;
  } catch { return 0; }
}

// Lista de PDFs “dieta_optimaN.pdf” leyendo manifest en /public/dietas_formuladas
export async function listDietasFormuladas() {
  const res = await fetch(`${PUBLIC_URL}/dietas_formuladas/manifest.json?_=${Date.now()}`);
  if (!res.ok) throw new Error("manifest.json no encontrado");
  const files = await res.json();
  return Array.isArray(files) ? files : [];
}

// Eliminar PDF (requiere endpoint backend)
export async function deleteDietaFormulada(fileName) {
  const res = await fetch(`${API_BASE}/dietas-formuladas?file=${encodeURIComponent(fileName)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Servidor respondió ${res.status}`);
  return true;
}
