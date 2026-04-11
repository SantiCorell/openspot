import type { NormalizedPlacesBlock } from "@/lib/data-sources/types";
import type { IneMunicipioRecord } from "@/lib/ine/municipios";
import type { ZoneInsight } from "@/lib/types/analysis";

/**
 * Google Maps / Places — modelo de competencia y afluencia (capa preparada para API).
 */
export async function fetchGoogleMapsData(
  zones: ZoneInsight[],
  mun: IneMunicipioRecord,
): Promise<NormalizedPlacesBlock> {
  const popFactor = Math.log10(mun.p + 10) / 6.2;
  const competitorCountByZone = Object.fromEntries(
    zones.map((z, i) => [
      z.id,
      z.competitorCount ??
        Math.max(5, Math.round(10 + mun.p / 32_000 + i * 2.4)),
    ]),
  );

  return {
    source: "google_maps",
    city: mun.n,
    competitorCountByZone,
    footTrafficIndex: Math.min(
      0.94,
      0.56 + popFactor * 0.3 + (mun.c.startsWith("28") ? 0.05 : 0),
    ),
    raw: {
      note:
        "Señal compuesta: densidad censal INE + patrón tipo Google Places (competencia y rotación histórica de locales). Conectar Nearby Search para producción.",
    },
  };
}
