import { PUBLIC_URL } from "../utils/env";

const RX_OPTIMA = /^dieta_optima(\d+)\.pdf$/i;

export function mapDocsForUI(files) {
  return files
    .filter((n) => RX_OPTIMA.test(n))
    .map((name) => {
      const m = name.match(RX_OPTIMA);
      return {
        name,
        index: m ? parseInt(m[1], 10) : null,
        url: `${PUBLIC_URL}/dietas_formuladas/${name}`,
      };
    })
    .filter((x) => Number.isInteger(x.index))
    .sort((a, b) => a.index - b.index);
}
