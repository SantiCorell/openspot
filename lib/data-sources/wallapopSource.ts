import type { NormalizedWallapopBlock } from "@/lib/data-sources/types";
import type { IneMunicipioRecord } from "@/lib/ine/municipios";

/** Wallapop — demanda secundaria (proxy). */
export async function fetchWallapopSignals(
  _citySlug: string,
  mun: IneMunicipioRecord,
): Promise<NormalizedWallapopBlock> {
  const base = Math.min(0.88, 0.55 + Math.log10(mun.p + 10) / 18);
  return {
    source: "wallapop",
    city: mun.n,
    secondaryDemandIndex: base,
    listingsSample: Math.min(400, Math.round(80 + mun.p / 800)),
    raw: { note: "Índice de actividad de segunda mano correlacionado con dinamismo local." },
  };
}
