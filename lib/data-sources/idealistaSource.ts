import type { NormalizedRentBlock } from "@/lib/data-sources/types";
import type { IneMunicipioRecord } from "@/lib/ine/municipios";
import type { ZoneInsight } from "@/lib/types/analysis";

/** Idealista — modelo €/m² por zona (listo para feed o scraping acordado). */
export async function fetchIdealistaData(
  zones: ZoneInsight[],
  mun: IneMunicipioRecord,
): Promise<NormalizedRentBlock> {
  const rentPerM2ByZone = Object.fromEntries(
    zones.map((z) => [z.id, z.rentPerM2 ?? 22]),
  );

  return {
    source: "idealista",
    city: mun.n,
    rentPerM2ByZone,
    currency: "EUR",
    raw: {
      ineCode: mun.c,
      note:
        "Capa de alquiler sintética por barrio; en producción se cruza con agregados Idealista/Fotocasa por bbox.",
    },
  };
}
