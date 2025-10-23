import { ROUTES } from "../utils/routes";
import { NavLinkModel } from "../models/navLink.model";

// Aquí puedes aplicar reglas (roles, flags, feature toggles, etc.)
export function getNavLinks(/* user */) {
  return [
    NavLinkModel({ label: "Inicio",   to: ROUTES.HOME }),
    NavLinkModel({ label: "Dieta",    to: ROUTES.DIETA }),
    NavLinkModel({ label: "Producto", to: ROUTES.PRODUCTO }),
    NavLinkModel({ label: "Acerca",   to: ROUTES.ACERCA }),
  ];
}
