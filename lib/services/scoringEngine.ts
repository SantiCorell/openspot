import { estimateCosts, estimateRevenue, resolveRentPerM2 } from "@/lib/calculations/businessCalculationEngine";
import type {
  AggregatedCityData,
  BusinessType,
  ScoredZone,
  ZoneInsight,
} from "@/lib/types/analysis";

interface ScoringContext {
  businessType: BusinessType;
  budget: number;
  rentByZoneId: Record<string, number>;
  competitorByZoneId: Record<string, number>;
  footTrafficIndex: number;
}

function profitabilityFromMargin(monthlyMargin: number): number {
  const raw = 58 + monthlyMargin / 150;
  return Math.min(100, Math.max(8, Math.round(raw)));
}

export function scoreZones(
  zones: ZoneInsight[],
  ctx: ScoringContext,
): ScoredZone[] {
  return zones.map((zone) => {
    const rentPerM2 = resolveRentPerM2(zone, ctx.rentByZoneId[zone.id]);
    const competitors = ctx.competitorByZoneId[zone.id] ?? zone.competitorCount ?? 20;

    const costs = estimateCosts(ctx.businessType, zone, rentPerM2, competitors);
    const revenue = estimateRevenue(
      ctx.businessType,
      zone,
      competitors,
      ctx.footTrafficIndex,
    );

    const monthlyMargin = revenue.monthlyMid - costs.totalMonthly;
    const profitabilityScore = profitabilityFromMargin(monthlyMargin);
    const competitionScore = Math.round(Math.max(5, 100 - competitors * 2.2));
    const saturationScore = Math.round(Math.min(100, competitors * 2.8));
    const investmentRequired = Math.round(ctx.budget * 0.35 + costs.totalMonthly * 4);
    const recommendationScore = Math.round(
      profitabilityScore * 0.45 + competitionScore * 0.35 + (100 - saturationScore) * 0.2,
    );

    return {
      ...zone,
      rentPerM2: rentPerM2,
      competitorCount: competitors,
      profitabilityScore,
      competitionScore,
      saturationScore,
      recommendationScore,
      investmentRequired,
      costs,
      revenue,
    };
  });
}

export function rankZones(zones: ScoredZone[]): ScoredZone[] {
  return [...zones].sort((a, b) => b.recommendationScore - a.recommendationScore);
}

export function competitionLevelForCity(data: AggregatedCityData): "baja" | "media" | "alta" {
  const avgCompetitors =
    data.zones.reduce((s, z) => s + (z.competitorCount ?? 20), 0) /
    Math.max(1, data.zones.length);
  if (avgCompetitors < 18) return "baja";
  if (avgCompetitors < 28) return "media";
  return "alta";
}
