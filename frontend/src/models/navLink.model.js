export function NavLinkModel({ label, to }) {
  if (typeof label !== "string" || typeof to !== "string") {
    throw new Error("NavLinkModel: props inválidas");
  }
  return { label, to };
}
