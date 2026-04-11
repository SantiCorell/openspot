import type { BusinessType } from "@/lib/types/analysis";
import { BUSINESS_LABELS } from "@/lib/types/analysis";

import { aggregateCityData } from "@/lib/services/dataAggregatorService";

export type MunicipioCompareRow = {
  rank: number;
  city: string;
  ineCode: string;
  ineYear: number;
  population: number;
  /** Competidores modelados en el municipio (suma microzonas, ajustada al sector). */
  modeledBusinessesTotal: number;
  modeledBusinessesAvgPerZone: number;
  inhabitantsPerModeledBusiness: number;
  opportunityScore: number;
  avgRentPerM2: number;
  topZoneByCompetitionName: string | null;
  zoneCount: number;
};

export type CompareMunicipalitiesResult = {
  businessType: BusinessType;
  sectorLabel: string;
  rows: MunicipioCompareRow[];
  winners: MunicipioCompareRow[];
  generatedAt: string;
};

function sectorCompetitorWeight(businessType: BusinessType): number {
  const food = new Set<BusinessType>([
    "bar",
    "pub",
    "cafe",
    "restaurant",
    "fast_food",
    "bakery",
    "ice_cream",
    "nightclub",
  ]);
  const retailDense = new Set<BusinessType>([
    "supermarket",
    "convenience",
    "retail_fashion",
    "pharmacy",
  ]);
  if (food.has(businessType)) return 1.12;
  if (retailDense.has(businessType)) return 1.08;
  if (
    businessType === "gym" ||
    businessType === "crossfit_box" ||
    businessType === "yoga_pilates"
  ) {
    return 1.05;
  }
  return 1;
}

export async function compareMunicipalities(
  municipalityNames: string[],
  businessType: BusinessType,
): Promise<CompareMunicipalitiesResult> {
  const unique = [
    ...new Set(
      municipalityNames.map((s) => s.trim()).filter((s) => s.length >= 2),
    ),
  ];

  const weight = sectorCompetitorWeight(businessType);

  const aggregated = await Promise.all(
    unique.map((name) => aggregateCityData(name)),
  );

  const rowsRaw = aggregated.map((agg) => {
    const zones = agg.zones;
    const rawSum = zones.reduce((s, z) => s + (z.competitorCount ?? 0), 0);
    const modeledTotal = Math.max(1, Math.round(rawSum * weight));
    const avgPerZone = zones.length ? rawSum / zones.length : 0;
    const pop = agg.cityPopulation ?? 0;
    const inhPerBiz = pop / modeledTotal;
    const avgRent = zones.length
      ? zones.reduce((s, z) => s + (z.rentPerM2 ?? 0), 0) / zones.length
      : 0;
    const income = agg.incomeIndex ?? 0.62;
    const rentNorm = Math.min(1, Math.max(0, (38 - avgRent) / 22));
    const demandNorm = Math.min(1, Math.log10(inhPerBiz + 12) / 3.6);
    const opportunityScore = Math.round(
      Math.min(
        100,
        Math.max(
          0,
          48 * demandNorm + 32 * income + 20 * rentNorm,
        ),
      ),
    );
    const topZone = [...zones].sort(
      (a, b) => (b.competitorCount ?? 0) - (a.competitorCount ?? 0),
    )[0];
    return {
      city: agg.city,
      ineCode: agg.ineMunicipioCode,
      ineYear: agg.ineYear,
      population: pop,
      modeledBusinessesTotal: modeledTotal,
      modeledBusinessesAvgPerZone: Math.round(avgPerZone * 10) / 10,
      inhabitantsPerModeledBusiness: Math.round(inhPerBiz),
      opportunityScore,
      avgRentPerM2: Math.round(avgRent * 10) / 10,
      topZoneByCompetitionName: topZone?.name ?? null,
      zoneCount: zones.length,
    };
  });

  rowsRaw.sort((a, b) => {
    if (b.opportunityScore !== a.opportunityScore) {
      return b.opportunityScore - a.opportunityScore;
    }
    return b.population - a.population;
  });

  const rows: MunicipioCompareRow[] = rowsRaw.map((r, i) => ({
    ...r,
    rank: i + 1,
  }));

  return {
    businessType,
    sectorLabel: BUSINESS_LABELS[businessType],
    rows,
    winners: rows.slice(0, 2),
    generatedAt: new Date().toISOString(),
  };
}
