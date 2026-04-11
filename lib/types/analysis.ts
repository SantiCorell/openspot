import type { CompetitionVsPopulationInsight } from "@/lib/analysis/competitionInsight";

import type { BusinessType } from "./businessCatalog";

export {
  BUSINESS_TYPES,
  BUSINESS_LABELS,
  BUSINESS_GROUPS,
  isBusinessType,
  type BusinessType,
} from "./businessCatalog";

export interface ZoneInsight {
  id: string;
  name: string;
  lat: number;
  lng: number;
  populationDensity?: number;
  medianIncomeIndex?: number;
  rentPerM2?: number;
  competitorCount?: number;
}

export interface AggregatedCityData {
  city: string;
  citySlug: string;
  zones: ZoneInsight[];
  cityPopulation?: number;
  incomeIndex?: number;
  ineMunicipioCode: string;
  ineYear: number;
  sources: string[];
}

export interface CostBreakdown {
  rentMonthly: number;
  staffMonthly: number;
  licensesMonthly: number;
  totalMonthly: number;
}

export interface RevenueEstimate {
  monthlyLow: number;
  monthlyMid: number;
  monthlyHigh: number;
  assumptions: string[];
}

export interface ScoredZone extends ZoneInsight {
  profitabilityScore: number;
  competitionScore: number;
  saturationScore: number;
  recommendationScore: number;
  investmentRequired: number;
  costs: CostBreakdown;
  revenue: RevenueEstimate;
}

export interface IdealistaStyleListing {
  title: string;
  m2: number;
  rentMonthly: number;
  zoneLabel: string;
  sourceNote: string;
}

export const WEEKDAY_LABELS_ES_SHORT = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom",
] as const;

/** Matriz 7×24 (Lun→Dom × 0–23h): personas/h estimadas en paso peatonal (modelo compuesto). */
export interface FootTrafficHeatmap {
  zoneId: string;
  zoneName: string;
  businessType: BusinessType;
  cells: number[][];
  maxCell: number;
  weekdayAvgPerHour: number;
  saturdayAvgPerHour: number;
  sundayAvgPerHour: number;
  peakWindowLabel: string;
  narrative: string;
}

export interface AlternativeMunicipalityHint {
  ineName: string;
  ineCode: string;
  population: number;
  headline: string;
  expectedEdge: string;
}

export interface MarketSaturationBrief {
  severity: "moderate" | "high" | "extreme";
  title: string;
  body: string;
  alternatives: AlternativeMunicipalityHint[];
}

/** Competencia en punto concreto vía OpenStreetMap (nodos en radio). */
export interface OsmPinAnalysis {
  lat: number;
  lng: number;
  radiusMeters: number;
  osmNodeCount: number;
  tagsQueried: string;
  nearestZoneId?: string;
  nearestZoneName?: string;
  distanceToNearestZoneKm?: number;
  attribution: string;
  note?: string;
  fetchError?: string;
}

export interface AnalysisResult {
  city: string;
  businessType: BusinessType;
  budget: number;
  bestAreas: ScoredZone[];
  summary: string;
  competitionLevel: "baja" | "media" | "alta";
  generatedAt: string;
  ineMunicipioCode: string;
  ineYear: number;
  padronPopulation: number;
  /** Competidores por zona + lectura población / saturación (informe ejecutivo). */
  competitionInsight?: CompetitionVsPopulationInsight;
  /** Mensajes de valor para producto (mapas de calor, históricos, INE, etc.) */
  dataSignals: string[];
  /** Reservado; listados reales próximamente. */
  idealistaSamples: IdealistaStyleListing[];
  barSaturationScore: number;
  /** Afluencia peatonal modelada para la zona mejor clasificada. */
  footTrafficHeatmap: FootTrafficHeatmap;
  /** Presión de mercado + municipios alternativos (p. ej. gimnasio saturado en València). */
  marketSaturationBrief?: MarketSaturationBrief;
  /** Si el usuario eligió pin: recuento OSM y fusión con zona más cercana. */
  osmPinAnalysis?: OsmPinAnalysis;
}

