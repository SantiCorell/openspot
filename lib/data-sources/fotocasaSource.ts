import type { NormalizedRentBlock } from "@/lib/data-sources/types";
import type { IneMunicipioRecord } from "@/lib/ine/municipios";
import type { ZoneInsight } from "@/lib/types/analysis";
import { fetchIdealistaData } from "@/lib/data-sources/idealistaSource";

/** Fotocasa — cruce de señal de alquiler. */
export async function fetchFotocasaData(
  zones: ZoneInsight[],
  mun: IneMunicipioRecord,
): Promise<NormalizedRentBlock> {
  const idealista = await fetchIdealistaData(zones, mun);
  const rentPerM2ByZone = Object.fromEntries(
    Object.entries(idealista.rentPerM2ByZone).map(([k, v]) => [
      k,
      Math.round(v * 0.97 * 10) / 10,
    ]),
  );

  return {
    source: "fotocasa",
    city: mun.n,
    rentPerM2ByZone,
    currency: "EUR",
    raw: { note: "Eco Fotocasa vs Idealista (ajuste -3%)." },
  };
}
