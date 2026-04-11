import type { NormalizedIneBlock } from "@/lib/data-sources/types";
import type { IneMunicipioRecord } from "@/lib/ine/municipios";

/**
 * INE — cifras oficiales de población municipal (padrón) desde dataset agregado en repo.
 */
export async function fetchIneDataFromPadron(
  municipio: IneMunicipioRecord,
): Promise<NormalizedIneBlock> {
  const pop = municipio.p;
  const incomeIndex = Math.min(0.95, 0.5 + Math.log10(pop + 10) / 22);
  const densityIndex = Math.min(0.95, Math.log10(pop + 10) / 6.2);

  return {
    source: "ine",
    city: municipio.n,
    population: pop,
    incomeIndex,
    densityIndex,
    year: municipio.y,
    raw: {
      ineMunicipioCode: municipio.c,
      fuente:
        "INE — Cifras oficiales de población resultantes de la revisión del Padrón municipal (datos locales agregados OpenSpot).",
    },
  };
}
