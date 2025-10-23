// Centraliza las rutas de la app
export const ROUTES = {
  HOME: "/",
  DIETA: "/dieta",
  PRODUCTO: "/producto",
  ACERCA: "/acerca",
  VISUAL: "/visual",   // nueva: página de vista previa
};

// (opcional) helper para construir la URL de Vista previa
export const buildPreviewUrl = ({ P3, Q3, R3, T3, V3, W3 }) => {
  const qs = new URLSearchParams({
    P3: String(P3 ?? ""),
    Q3: String(Q3 ?? ""),
    R3: String(R3 ?? ""),
    T3: String(T3 ?? ""),
    V3: String(V3 ?? ""),
    W3: String(W3 ?? ""),
  });
  return `${ROUTES.VISUAL}?${qs.toString()}`;
};
