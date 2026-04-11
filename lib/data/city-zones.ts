import type { ZoneInsight } from "@/lib/types/analysis";

/** Datos semilla MVP (Madrid + Valencia). Sustituir por agregación real de fuentes. */
const MADRID: ZoneInsight[] = [
  {
    id: "salamanca",
    name: "Barrio de Salamanca",
    lat: 40.4308,
    lng: -3.6777,
    populationDensity: 0.88,
    medianIncomeIndex: 0.94,
    rentPerM2: 38,
    competitorCount: 14,
  },
  {
    id: "chueca-justicia",
    name: "Chueca / Justicia",
    lat: 40.422,
    lng: -3.6979,
    populationDensity: 0.82,
    medianIncomeIndex: 0.78,
    rentPerM2: 34,
    competitorCount: 32,
  },
  {
    id: "lavapies",
    name: "Lavapiés / Embajadores",
    lat: 40.4084,
    lng: -3.7036,
    populationDensity: 0.91,
    medianIncomeIndex: 0.62,
    rentPerM2: 26,
    competitorCount: 22,
  },
  {
    id: "chamberi",
    name: "Chamberí",
    lat: 40.436,
    lng: -3.703,
    populationDensity: 0.79,
    medianIncomeIndex: 0.81,
    rentPerM2: 30,
    competitorCount: 18,
  },
];

const VALENCIA: ZoneInsight[] = [
  {
    id: "russafa",
    name: "Ruzafa",
    lat: 39.4567,
    lng: -0.3733,
    populationDensity: 0.84,
    medianIncomeIndex: 0.72,
    rentPerM2: 22,
    competitorCount: 26,
  },
  {
    id: "ciutat-vella",
    name: "Ciutat Vella",
    lat: 39.4753,
    lng: -0.3755,
    populationDensity: 0.9,
    medianIncomeIndex: 0.58,
    rentPerM2: 20,
    competitorCount: 35,
  },
  {
    id: "el-carme",
    name: "El Carme",
    lat: 39.4781,
    lng: -0.3824,
    populationDensity: 0.86,
    medianIncomeIndex: 0.65,
    rentPerM2: 21,
    competitorCount: 28,
  },
  {
    id: "benimaclet",
    name: "Benimaclet",
    lat: 39.4872,
    lng: -0.3578,
    populationDensity: 0.72,
    medianIncomeIndex: 0.7,
    rentPerM2: 16,
    competitorCount: 12,
  },
];

export const CITY_ZONE_SEED: Record<string, ZoneInsight[]> = {
  madrid: MADRID,
  valencia: VALENCIA,
};
