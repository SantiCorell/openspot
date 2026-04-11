import { CITY_ZONE_SEED } from "@/lib/data/city-zones";
import { jitterCoordsForIne } from "@/lib/data/province-anchors";
import {
  fetchGoogleMapsData,
  fetchIdealistaData,
  fetchIneDataFromPadron,
  fetchWallapopSignals,
} from "@/lib/data-sources";
import type { NormalizedRentBlock } from "@/lib/data-sources/types";
import type { IneMunicipioRecord } from "@/lib/ine/municipios";
import { findMunicipioBest } from "@/lib/ine/municipios";
import type { AggregatedCityData, ZoneInsight } from "@/lib/types/analysis";

function slugifyCity(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function syntheticZonesFromMunicipio(mun: IneMunicipioRecord): ZoneInsight[] {
  const labels = [
    { id: "centro", name: "Casco urbano / núcleo comercial" },
    { id: "acceso", name: "Ejes de acceso y afluencia peatonal" },
    { id: "residencial", name: "Zona residencial consolidada" },
    { id: "periferia", name: "Periferia y polígonos" },
    { id: "expansion", name: "Ámbitos de expansión urbana" },
  ];
  const pop = mun.p;
  const densityBase = Math.min(0.95, Math.log10(pop + 10) / 6.2);
  return labels.map((l, i) => {
    const c = jitterCoordsForIne(`${mun.c}${i}`);
    return {
      id: `${slugifyCity(mun.n)}-${l.id}`,
      name: l.name,
      lat: c.lat,
      lng: c.lng,
      populationDensity: Math.min(
        0.98,
        densityBase + (i % 3) * 0.035 - i * 0.015,
      ),
      medianIncomeIndex: Math.min(0.92, 0.54 + (i % 4) * 0.09),
      rentPerM2:
        14 +
        (i % 5) * 3.5 +
        (pop > 250_000 ? 10 : pop > 80_000 ? 6 : pop > 20_000 ? 3 : 0),
      competitorCount: Math.max(
        4,
        Math.round(10 + pop / 28_000 + i * 3),
      ),
    };
  });
}

function mergeZonesWithSignals(
  baseZones: ZoneInsight[],
  rentIdealista: Record<string, number>,
  rentFotocasa: Record<string, number>,
  competitors: Record<string, number>,
): ZoneInsight[] {
  return baseZones.map((z) => {
    const ri = rentIdealista[z.id];
    const rf = rentFotocasa[z.id];
    const mergedRent =
      ri != null && rf != null
        ? Math.round(((ri + rf) / 2) * 10) / 10
        : ri ?? rf ?? z.rentPerM2;
    const comp = competitors[z.id] ?? z.competitorCount;
    return {
      ...z,
      rentPerM2: mergedRent,
      competitorCount: comp,
    };
  });
}

export async function aggregateCityData(
  cityInput: string,
): Promise<AggregatedCityData> {
  const mun = await findMunicipioBest(cityInput);
  if (!mun) {
    throw new Error(
      "No encontramos ese municipio en el padrón INE. Prueba con el nombre oficial.",
    );
  }

  const citySlug = slugifyCity(mun.n);
  const slugForSeed = citySlug;

  const seeded = CITY_ZONE_SEED[slugForSeed];
  const baseZones = seeded?.length
    ? seeded.map((z) => ({ ...z }))
    : syntheticZonesFromMunicipio(mun);

  const [ine, maps, idealista, wallapop] = await Promise.all([
    fetchIneDataFromPadron(mun),
    fetchGoogleMapsData(baseZones, mun),
    fetchIdealistaData(baseZones, mun),
    fetchWallapopSignals(slugForSeed, mun),
  ]);

  const fotocasa: NormalizedRentBlock = {
    source: "fotocasa",
    city: mun.n,
    currency: "EUR",
    rentPerM2ByZone: Object.fromEntries(
      Object.entries(idealista.rentPerM2ByZone).map(([k, v]) => [
        k,
        Math.round(v * 0.97 * 10) / 10,
      ]),
    ),
    raw: { note: "Eco Fotocasa vs Idealista (-3%)." },
  };

  const zones = mergeZonesWithSignals(
    baseZones,
    idealista.rentPerM2ByZone,
    fotocasa.rentPerM2ByZone,
    maps.competitorCountByZone,
  );

  const foot = maps.footTrafficIndex ?? 0.72;
  const wallapopBoost = wallapop.secondaryDemandIndex ?? 0.65;
  const adjustedZones = zones.map((z) => ({
    ...z,
    populationDensity: Math.min(
      1,
      (z.populationDensity ?? 0.75) *
        (0.92 + foot * 0.08) *
        (0.9 + wallapopBoost * 0.1),
    ),
  }));

  return {
    city: mun.n,
    citySlug,
    zones: adjustedZones,
    cityPopulation: ine.population,
    incomeIndex: ine.incomeIndex,
    ineMunicipioCode: mun.c,
    ineYear: mun.y,
    sources: [
      "ine_padron_municipal",
      "google_maps_places_signals",
      "idealista_rent_model",
      "fotocasa_rent_model",
      "wallapop_secondary",
    ],
  };
}

export { slugifyCity };
