// CRA: usa REACT_APP_API_URL; si no existe, usa localhost:3009/api
const BASE = process.env.REACT_APP_API_URL || "http://localhost:3009/api";

export const pingDb = async () => {
  const res = await fetch(`${BASE}/dietas/ping`);
  if (!res.ok) throw new Error(`Ping falló: ${res.status}`);
  return res.json(); // { ok: true, ts: ... }
};
