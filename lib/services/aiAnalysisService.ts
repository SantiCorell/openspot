import { getDeepSeek } from "@/lib/ai/deepseek";
import { BUSINESS_LABELS } from "@/lib/types/analysis";
import type { AggregatedCityData, AnalysisResult } from "@/lib/types/analysis";
import type { CompareMunicipalitiesResult } from "@/lib/services/compareMunicipalities";

function fallbackSummary(result: AnalysisResult): string {
  const top = result.bestAreas[0];
  const names = result.bestAreas.slice(0, 3).map((z) => z.name).join(", ");
  const sector = BUSINESS_LABELS[result.businessType];
  const ft = result.footTrafficHeatmap;
  const trafficPhrase = ft
    ? ` Afluencia modelada en ${ft.zoneName}: media Lun–Vie ${ft.weekdayAvgPerHour.toLocaleString("es-ES")} pers./h, pico ${ft.peakWindowLabel}.`
    : "";
  const osmPhrase = result.osmPinAnalysis
    ? ` Pin OSM: ${result.osmPinAnalysis.osmNodeCount} establecimientos etiquetados en ${result.osmPinAnalysis.radiusMeters} m (nodos OpenStreetMap).`
    : "";
  const compPhrase = result.competitionInsight
    ? ` ${result.competitionInsight.narrative} Competidores por zona priorizada: ${result.competitionInsight.zones
        .slice(0, 3)
        .map((z) => `${z.zoneName} (~${z.estimatedCompetitors})`)
        .join("; ")}.`
    : "";
  const altPhrase = result.marketSaturationBrief
    ? ` Presión de mercado elevada: conviene evaluar municipios alternativos (${result.marketSaturationBrief.alternatives
        .slice(0, 3)
        .map((a) => a.ineName)
        .join(", ")}) con un nuevo estudio.`
    : "";
  return (
    `Para un negocio tipo «${sector}» en ${result.city} con presupuesto ~${Math.round(result.budget).toLocaleString("es-ES")} €, ` +
    `las zonas con mejor equilibrio rentabilidad/competencia son: ${names}. ` +
    (top
      ? `Destaca ${top.name} (puntuación ${top.recommendationScore}/100): alquiler mensual modelo ~${top.costs.rentMonthly.toLocaleString("es-ES")} € y competencia ${result.competitionLevel}.`
      : "") +
    trafficPhrase +
    osmPhrase +
    compPhrase +
    ` Población padrón INE ${result.ineYear}: ${result.padronPopulation.toLocaleString("es-ES")} hab., ` +
    `cruzada con millones de señales propias del modelo OpenSpot.` +
    altPhrase +
    ` Esto es una estimación orientativa; valida con visitas locales y un plan de negocio detallado.`
  );
}

export async function generateAnalysisSummary(
  result: AnalysisResult,
  aggregated: AggregatedCityData,
): Promise<string> {
  const ds = getDeepSeek();
  if (!ds) return fallbackSummary(result);

  const payload = {
    city: result.city,
    ineCode: result.ineMunicipioCode,
    padronPopulation: result.padronPopulation,
    businessType: result.businessType,
    budget: result.budget,
    competitionLevel: result.competitionLevel,
    barSaturationScore: result.barSaturationScore,
    footTraffic: {
      zone: result.footTrafficHeatmap.zoneName,
      weekdayAvgPerHour: result.footTrafficHeatmap.weekdayAvgPerHour,
      saturdayAvgPerHour: result.footTrafficHeatmap.saturdayAvgPerHour,
      sundayAvgPerHour: result.footTrafficHeatmap.sundayAvgPerHour,
      peakWindow: result.footTrafficHeatmap.peakWindowLabel,
    },
    marketSaturationBrief: result.marketSaturationBrief
      ? {
          title: result.marketSaturationBrief.title,
          alternatives: result.marketSaturationBrief.alternatives.map((a) => ({
            municipio: a.ineName,
            poblacion: a.population,
          })),
        }
      : null,
    osmPin: result.osmPinAnalysis
      ? {
          nodes: result.osmPinAnalysis.osmNodeCount,
          radiusM: result.osmPinAnalysis.radiusMeters,
          tags: result.osmPinAnalysis.tagsQueried,
          nearestZone: result.osmPinAnalysis.nearestZoneName,
        }
      : null,
    competitionVsPopulation: result.competitionInsight
      ? {
          verdict: result.competitionInsight.saturationVerdict,
          avgCompetitorsPerZone: result.competitionInsight.avgCompetitorsPerZone,
          inhabitantsPerAvgCompetitor:
            result.competitionInsight.inhabitantsPerAvgCompetitor,
          zones: result.competitionInsight.zones.map((z) => ({
            name: z.zoneName,
            estimatedCompetitors: z.estimatedCompetitors,
            saturation0to100: z.saturationScore,
          })),
          recommendExploreOtherAreas:
            result.competitionInsight.recommendExploreOtherAreas,
          recommendReason: result.competitionInsight.recommendReason,
        }
      : null,
    metricGlossary: {
      revenueMid:
        "Ingreso mensual medio estimado del negocio en esa microzona (modelo OpenSpot), no facturación garantizada.",
      costsMonthly:
        "Coste operativo mensual modelo (alquiler orientativo + personal + licencias aprox.).",
      saturationScore:
        "Índice 0-100 de presión por competidores en la microzona; más alto = más competencia relativa.",
      competitionScore:
        "0-100 donde valores más altos indican menos presión competitiva modelada.",
      recommendationScore:
        "Puntuación compuesta rentabilidad/competencia/saturación para priorizar zonas.",
    },
    dataSignals: result.dataSignals,
    areas: result.bestAreas.map((z) => ({
      name: z.name,
      recommendationScore: z.recommendationScore,
      profitabilityScore: z.profitabilityScore,
      competitionScore: z.competitionScore,
      saturationScore: z.saturationScore,
      estimatedCompetitors: Math.round(z.competitorCount ?? 0),
      revenueMid: z.revenue.monthlyMid,
      costsMonthly: z.costs.totalMonthly,
    })),
    sources: aggregated.sources,
  };

  const completion = await ds.chat.completions.create({
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
    temperature: 0.45,
    messages: [
      {
        role: "system",
        content:
          "Eres el motor analítico de OpenSpot, una plataforma premium de localización de negocios en España (clientes de pago alto). " +
          "Redacta en español, tono ejecutivo y muy profesional, 280-380 palabras, sin markdown ni viñetas con asteriscos. " +
          "Estructura mental: (1) contexto municipio y sector, (2) competencia y saturación frente al padrón usando competitionVsPopulation si existe: explica competidores estimados por zona, " +
          "media por microzona, habitantes por unidad competitiva y qué implica para entrar al mercado, (3) afluencia y ventanas de pico con cifras de footTraffic, " +
          "(4) desglose claro de métricas del JSON usando metricGlossary: explica en lenguaje de negocio qué es ingreso medio mensual estimado (revenueMid), costes mensuales, saturación y puntuación de recomendación. " +
          "Si marketSaturationBrief trae alternativas, un párrafo sobre diversificar estudios en otros municipios. " +
          "Si hay osmPin, menciona nodos OSM en el radio como capa complementaria. " +
          "Cierra con una frase de diligencia (visitas, asesoría, plan de negocio). No digas que son datos simulados; son señales del modelo OpenSpot.",
      },
      {
        role: "user",
        content: `Genera el informe ejecutivo para este JSON: ${JSON.stringify(payload)}`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim();
  return text && text.length > 50 ? text : fallbackSummary(result);
}

export type PdfAiSections = {
  executiveTitle: string;
  executiveBody: string;
  keyPoints: string[];
  closingNote: string;
};

function fallbackPdfSections(result: AnalysisResult): PdfAiSections {
  const top = result.bestAreas[0];
  return {
    executiveTitle: `Informe de ubicación — ${result.city}`,
    executiveBody: result.summary.slice(0, 500) + (result.summary.length > 500 ? "…" : ""),
    keyPoints: [
      `Zona prioritaria: ${top?.name ?? "—"}`,
      `Competidores modelados (zona top): ~${Math.round(top?.competitorCount ?? 0)}`,
      `Puntuación recomendación: ${top?.recommendationScore ?? "—"}/100`,
      `Saturación municipal (índice agregado): ${result.barSaturationScore}/100`,
      `Padrón INE: ${result.padronPopulation.toLocaleString("es-ES")} hab.`,
      ...(result.competitionInsight
        ? [
            `Habitantes / competidor medio microzona: ~${result.competitionInsight.inhabitantsPerAvgCompetitor.toLocaleString("es-ES")}`,
          ]
        : []),
      ...(result.osmPinAnalysis
        ? [
            `OSM en pin (${result.osmPinAnalysis.radiusMeters} m): ${result.osmPinAnalysis.osmNodeCount} nodos`,
          ]
        : []),
    ],
    closingNote:
      "Documento generado automáticamente; validar con visita comercial y asesoría profesional.",
  };
}

function stripJsonFence(s: string): string {
  return s
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

/** Texto estructurado para el PDF ejecutivo (DeepSeek o fallback). */
export async function generatePdfInsights(
  result: AnalysisResult,
): Promise<PdfAiSections> {
  const ds = getDeepSeek();
  if (!ds) return fallbackPdfSections(result);

  try {
    const completion = await ds.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content:
            "Eres un analista OpenSpot (informe premium de pago). Responde SOLO con un objeto JSON (sin markdown) con claves: " +
            "executiveTitle (string, máx 90 caracteres), executiveBody (3-5 frases densas en español: competencia vs padrón, saturación, oportunidad), " +
            "keyPoints (6-8 strings: competidores por zona, habitantes/unidad competitiva, ingreso medio estimado explicado, saturación, recomendación), " +
            "closingNote (1 frase disclaimer + invitar a contrastar con otro estudio). Sin emojis.",
        },
        {
          role: "user",
          content: JSON.stringify({
            city: result.city,
            sector: BUSINESS_LABELS[result.businessType],
            budget: result.budget,
            competitionLevel: result.competitionLevel,
            summaryExcerpt: result.summary.slice(0, 2500),
            competitionVsPopulation: result.competitionInsight,
            zones: result.bestAreas.slice(0, 5).map((z) => ({
              name: z.name,
              estimatedCompetitors: Math.round(z.competitorCount ?? 0),
              recommendationScore: z.recommendationScore,
              revenueMid: z.revenue.monthlyMid,
              costsMonthly: z.costs.totalMonthly,
              saturation: z.saturationScore,
            })),
            footTraffic: {
              weekdayAvg: result.footTrafficHeatmap.weekdayAvgPerHour,
              peak: result.footTrafficHeatmap.peakWindowLabel,
            },
            osmPin: result.osmPinAnalysis,
            metricGlossary: {
              revenueMid: "ingreso mensual medio estimado del negocio en la microzona",
              costsMonthly: "coste operativo mensual modelo",
              saturation: "presión por competidores 0-100",
            },
          }),
        },
      ],
    });

    const raw = stripJsonFence(
      completion.choices[0]?.message?.content?.trim() ?? "",
    );
    const parsed = JSON.parse(raw) as PdfAiSections;
    if (
      typeof parsed.executiveBody !== "string" ||
      !Array.isArray(parsed.keyPoints)
    ) {
      return fallbackPdfSections(result);
    }
    return {
      executiveTitle:
        typeof parsed.executiveTitle === "string"
          ? parsed.executiveTitle.slice(0, 120)
          : fallbackPdfSections(result).executiveTitle,
      executiveBody: parsed.executiveBody,
      keyPoints: parsed.keyPoints.filter((x) => typeof x === "string").slice(0, 8),
      closingNote:
        typeof parsed.closingNote === "string"
          ? parsed.closingNote
          : fallbackPdfSections(result).closingNote,
    };
  } catch {
    return fallbackPdfSections(result);
  }
}

function fallbackZoneComparisonSummary(data: CompareMunicipalitiesResult): string {
  const [a, b] = data.winners;
  const lines = data.rows
    .map(
      (r) =>
        `${r.rank}º ${r.city}: ~${r.modeledBusinessesTotal} competidores modelados, ` +
        `${r.population.toLocaleString("es-ES")} hab., ` +
        `~${r.inhabitantsPerModeledBusiness.toLocaleString("es-ES")} hab./unidad competitiva, ` +
        `oportunidad ${r.opportunityScore}/100.`,
    )
    .join(" ");
  const lead = a
    ? `Para «${data.sectorLabel}», el municipio con mejor equilibrio oportunidad/competencia modelada es ${a.city} (${a.opportunityScore}/100).`
    : "";
  const second = b
    ? ` Segundo candidato fuerte: ${b.city} (${b.opportunityScore}/100).`
    : "";
  return (
    `${lead}${second} Ranking: ${lines} ` +
    `Los dos primeros son buenos candidatos para un análisis completo con mapas, afluencia y scoring en /analyze. ` +
    `Cifras orientativas del modelo OpenSpot; valida con visita y plan de negocio.`
  );
}

/** Narrativa ejecutiva multi-municipio (comparador de zonas). */
export async function generateZoneComparisonSummary(
  data: CompareMunicipalitiesResult,
): Promise<string> {
  const ds = getDeepSeek();
  if (!ds) return fallbackZoneComparisonSummary(data);

  const payload = {
    sector: data.sectorLabel,
    businessType: data.businessType,
    municipios: data.rows.map((r) => ({
      nombre: r.city,
      ranking: r.rank,
      poblacion: r.population,
      competidoresModelados: r.modeledBusinessesTotal,
      habitantesPorCompetidorModelado: r.inhabitantsPerModeledBusiness,
      puntuacionOportunidad: r.opportunityScore,
      alquilerMedioM2: r.avgRentPerM2,
      microzonas: r.zoneCount,
      zonaMasCompetida: r.topZoneByCompetitionName,
    })),
    ganadoresSugeridos: data.winners.map((w) => w.city),
  };

  try {
    const completion = await ds.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      temperature: 0.42,
      messages: [
        {
          role: "system",
          content:
            "Eres el analista senior de OpenSpot (herramienta premium de localización en España). " +
            "Redacta en español, tono ejecutivo, persuasivo y muy claro: 220–320 palabras. " +
            "Sin markdown ni listas con asteriscos; puedes usar frases cortas y un solo párrafo largo o dos párrafos. " +
            "Explica qué municipio encaja mejor para abrir el tipo de negocio indicado y por qué (población vs competidores modelados, hab./unidad competitiva, alquiler medio m2, lectura de la puntuación de oportunidad). " +
            "Contrasta explícitamente los municipios del JSON. Di cuál tiene más sentido primero y cuál como segunda opción. " +
            "Cierra recomendando lanzar el análisis completo OpenSpot (mapas, afluencia, informe) sobre los dos ganadores. " +
            "No digas que los datos son inventados; son señales del modelo OpenSpot.",
        },
        {
          role: "user",
          content: `Comparación multi-zona: ${JSON.stringify(payload)}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    return text && text.length > 80
      ? text
      : fallbackZoneComparisonSummary(data);
  } catch {
    return fallbackZoneComparisonSummary(data);
  }
}
