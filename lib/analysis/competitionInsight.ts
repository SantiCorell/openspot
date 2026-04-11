/** Evita import circular con `lib/types/analysis`. */
type ZoneRowInput = {
  id: string;
  name: string;
  competitorCount?: number;
  saturationScore: number;
  competitionScore: number;
  recommendationScore: number;
};

export type ZoneCompetitionRow = {
  zoneId: string;
  zoneName: string;
  estimatedCompetitors: number;
  saturationScore: number;
  competitionScore: number;
  recommendationScore: number;
};

export type SaturationVerdict = "relativamente_baja" | "moderada" | "elevada";

export type CompetitionVsPopulationInsight = {
  cityPopulation: number;
  avgCompetitorsPerZone: number;
  zoneCount: number;
  /** Padrón municipal / media de competidores modelados por microzona (orientativo). */
  inhabitantsPerAvgCompetitor: number;
  saturationVerdict: SaturationVerdict;
  /** Párrafo para el informe (HTML-free). */
  narrative: string;
  zones: ZoneCompetitionRow[];
  recommendExploreOtherAreas: boolean;
  recommendReason: string;
};

const verdictLabels: Record<SaturationVerdict, string> = {
  relativamente_baja: "competencia relativamente baja frente al padrón",
  moderada: "competencia moderada en relación con el padrón municipal",
  elevada: "presión competitiva elevada respecto al tamaño del mercado local",
};

export function buildCompetitionVsPopulationInsight(params: {
  rankedZones: ZoneRowInput[];
  bestAreas: ZoneRowInput[];
  cityPopulation: number;
  barSaturationScore: number;
}): CompetitionVsPopulationInsight {
  const { rankedZones, bestAreas, cityPopulation, barSaturationScore } = params;
  const n = Math.max(1, rankedZones.length);
  const sumComp = rankedZones.reduce(
    (s, z) => s + (z.competitorCount ?? 0),
    0,
  );
  const avgCompetitorsPerZone = Math.round((sumComp / n) * 10) / 10;
  const inhabitantsPerAvgCompetitor = Math.round(
    cityPopulation / Math.max(1, avgCompetitorsPerZone),
  );

  let saturationVerdict: SaturationVerdict = "moderada";
  if (avgCompetitorsPerZone < 17 && inhabitantsPerAvgCompetitor >= 2200) {
    saturationVerdict = "relativamente_baja";
  } else if (
    avgCompetitorsPerZone > 30 ||
    inhabitantsPerAvgCompetitor < 1100 ||
    barSaturationScore >= 62
  ) {
    saturationVerdict = "elevada";
  }

  const zones: ZoneCompetitionRow[] = bestAreas.map((z) => ({
    zoneId: z.id,
    zoneName: z.name,
    estimatedCompetitors: Math.round(z.competitorCount ?? 0),
    saturationScore: z.saturationScore,
    competitionScore: z.competitionScore,
    recommendationScore: z.recommendationScore,
  }));

  const top = bestAreas[0];
  const recommendExploreOtherAreas =
    saturationVerdict === "elevada" ||
    barSaturationScore >= 54 ||
    (top != null && top.saturationScore >= 56);

  const narrative =
    `Padrón municipal ${cityPopulation.toLocaleString("es-ES")} habitantes. ` +
    `El modelo sitúa una media de unos ${avgCompetitorsPerZone.toLocaleString("es-ES", { maximumFractionDigits: 1 })} competidores tipo por microzona analizada (${n} zonas), ` +
    `es decir, orientativamente unos ${inhabitantsPerAvgCompetitor.toLocaleString("es-ES")} habitantes por cada unidad competitiva media. ` +
    `Interpretación agregada: ${verdictLabels[saturationVerdict]}. ` +
    (top
      ? `La zona prioritaria «${top.name}» concentra ~${Math.round(top.competitorCount ?? 0)} competidores modelados e índice de saturación ${top.saturationScore}/100.`
      : "");

  const recommendReason = recommendExploreOtherAreas
    ? saturationVerdict === "elevada"
      ? "La densidad competitiva del municipio y/o la saturación de las mejores microzonas aconsejan contrastar otros emplazamientos o municipios con más cabida de mercado antes de decidir inversión."
      : "Aunque el equilibrio sea aceptable, conviene validar alternativas (otras zonas o ciudades) para comparar relación población / competencia y no depender de una sola lectura."
    : "El equilibrio entre padrón y competencia modelada es razonable en las zonas destacadas; sigue siendo recomendable contrastar con un segundo estudio en otra ubicación antes de cerrar local.";

  return {
    cityPopulation,
    avgCompetitorsPerZone,
    zoneCount: n,
    inhabitantsPerAvgCompetitor,
    saturationVerdict,
    narrative,
    zones,
    recommendExploreOtherAreas,
    recommendReason,
  };
}
