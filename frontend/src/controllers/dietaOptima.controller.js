// Acciones del Paso 5 (guardar dieta, etc.)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3009/api";

/**
 * Guarda la dieta en el backend.
 * payload: { animal, requerimientos, restricciones, resultado }
 * Devuelve el objeto respuesta del servidor.
 */
export async function saveDieta(payload) {
  const res = await fetch(`${API_BASE}/dietas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    return { ok: true, raw: text };
  }
}
