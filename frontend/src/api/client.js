// Base de la API: toma del .env o usa localhost:3009/api por defecto
const BASE = process.env.REACT_APP_API_URL || "http://localhost:3009/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} - ${txt}`);
  }
  // Algunos endpoints pueden no devolver JSON; ajusta si hace falta
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

// Solo lectura (GET). Si en futuro activas escritura, añade post/put/delete.
export const get  = (p) => request(p, { method: "GET" });
