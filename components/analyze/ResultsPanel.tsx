"use client";

import {
  BUSINESS_LABELS,
  type AnalysisResult,
} from "@/lib/types/analysis";

import { MarketSaturationPanel } from "@/components/analyze/MarketSaturationPanel";
import { PopulationTrafficSection } from "@/components/analyze/PopulationTrafficSection";
import { ZonesMap } from "@/components/analyze/ZonesMap";
import Link from "next/link";

const SATURATION_VERDICT_ES = {
  relativamente_baja: "Baja presión relativa",
  moderada: "Presión moderada",
  elevada: "Alta presión competitiva",
} as const;

export function ResultsPanel({
  result,
  analysisId,
  showHistoryLink = true,
}: {
  result: AnalysisResult;
  analysisId?: string | null;
  showHistoryLink?: boolean;
}) {
  const top = result.bestAreas[0];
  const sectorLabel = BUSINESS_LABELS[result.businessType];
  const ci = result.competitionInsight;

  return (
    <div className="space-y-6">
      {analysisId && showHistoryLink ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-3 text-[13px]">
          <span className="text-[var(--foreground)]">
            Informe guardado en tu historial.
          </span>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/analisis/${analysisId}`}
              className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Abrir informe completo
            </Link>
            <a
              href={`/api/analyses/${analysisId}/pdf`}
              className="font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              Descargar PDF
            </a>
          </div>
        </div>
      ) : null}

      {result.marketSaturationBrief ? (
        <MarketSaturationPanel brief={result.marketSaturationBrief} />
      ) : null}

      <div className="os-card p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Capa de datos OpenSpot
        </p>
        <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-[var(--muted)]">
          {result.dataSignals.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--accent)]">·</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {ci ? (
        <div className="os-card overflow-hidden">
          <div className="border-b border-[var(--border)] bg-[var(--muted-bg)]/50 px-4 py-3">
            <p className="text-[13px] font-semibold text-[var(--foreground)]">
              Competencia por zona y lectura frente al padrón
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--muted)]">
              Estimación modelada de establecimientos competidores por microzona (no censo oficial).
              Cruzamos con el padrón municipal para valorar si, orientativamente, el mercado aparece
              más o menos saturado para el tipo de negocio.
            </p>
          </div>
          <div className="space-y-4 px-4 py-4">
            <div className="flex flex-wrap gap-3 text-[13px]">
              <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-medium">
                Padrón: {ci.cityPopulation.toLocaleString("es-ES")} hab.
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-medium">
                Competidores / microzona (media):{" "}
                {ci.avgCompetitorsPerZone.toLocaleString("es-ES", {
                  maximumFractionDigits: 1,
                })}
              </span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 font-medium">
                ~{ci.inhabitantsPerAvgCompetitor.toLocaleString("es-ES")} hab. / unidad
                competitiva media
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-semibold text-indigo-800 dark:text-indigo-200">
                {SATURATION_VERDICT_ES[ci.saturationVerdict]}
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-[var(--foreground)]">
              {ci.narrative}
            </p>
            <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
              <table className="w-full min-w-[520px] text-left text-[13px]">
                <thead className="bg-[var(--muted-bg)] text-[11px] uppercase tracking-wide text-[var(--muted)]">
                  <tr>
                    <th className="px-3 py-2">Zona</th>
                    <th className="px-3 py-2">Compet. (est.)</th>
                    <th className="px-3 py-2">Saturación</th>
                    <th className="px-3 py-2">Score competencia</th>
                    <th className="px-3 py-2">Recom.</th>
                  </tr>
                </thead>
                <tbody>
                  {ci.zones.map((z) => (
                    <tr
                      key={z.zoneId}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="px-3 py-2.5 font-medium">{z.zoneName}</td>
                      <td className="px-3 py-2.5 tabular-nums">
                        ~{z.estimatedCompetitors}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {z.saturationScore}/100
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {z.competitionScore}/100
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {z.recommendationScore}/100
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[12px] leading-relaxed text-[var(--muted)]">
              <strong className="text-[var(--foreground)]">Score competencia</strong>: valores más
              altos indican menos presión competitiva modelada en esa microzona.{" "}
              <strong className="text-[var(--foreground)]">Saturación</strong>: 0–100, presión por
              competidores; más alto = más competencia relativa.
            </p>
          </div>
        </div>
      ) : null}

      <div className="os-card p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Informe ejecutivo (IA)
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground)]">
          {result.summary}
        </p>
      </div>

      <div className="os-card p-6 sm:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Cómo leer las métricas del cuadro de zonas
        </p>
        <dl className="mt-4 space-y-3 text-[13px] leading-relaxed text-[var(--muted)]">
          <div>
            <dt className="font-semibold text-[var(--foreground)]">
              Ingreso mediano mensual (est.)
            </dt>
            <dd>
              Estimación del ingreso mensual medio que el modelo asocia a tu tipo de negocio en esa
              microzona, según afluencia y competencia; no es una promesa de facturación.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--foreground)]">Costes / mes (est.)</dt>
            <dd>
              Coste operativo mensual orientativo: alquiler modelo, personal aproximado y cargas
              recurrentes; ajústalo con presupuesto real y negociación de renta.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--foreground)]">Saturación (0–100)</dt>
            <dd>
              Índice de presión por competidores en la microzona; cuanto más alto, más competencia
              relativa modelada frente a la capacidad de mercado.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-[var(--foreground)]">Rentabilidad / Competencia / Recom.</dt>
            <dd>
              Puntuaciones compuestas del motor OpenSpot: equilibrio entre margen estimado, presión
              competitiva y saturación. La recomendación prioriza zonas con mejor encaje global para
              tu presupuesto y sector.
            </dd>
          </div>
        </dl>
      </div>

      <PopulationTrafficSection
        city={result.city}
        ineYear={result.ineYear}
        ineCode={result.ineMunicipioCode}
        padronPopulation={result.padronPopulation}
        heatmap={result.footTrafficHeatmap}
        sectorLabel={sectorLabel.toLowerCase()}
        defaultTab="traffic"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard
          label="Rentabilidad (zona top)"
          value={top?.profitabilityScore ?? 0}
          hint="Basada en margen mensual estimado"
        />
        <ScoreCard
          label="Competencia (zona top)"
          value={top?.competitionScore ?? 0}
          hint="Más alto = menos presión modelada"
        />
        <ScoreCard
          label="Saturación del sector (índice)"
          value={result.barSaturationScore}
          hint="Media municipal del modelo"
        />
        <ScoreCard
          label="Inversión orientativa"
          value={null}
          display={`~${(top?.investmentRequired ?? 0).toLocaleString("es-ES")} €`}
          hint="CAPEX aproximado + colchón"
        />
      </div>

      <ZonesMap zones={result.bestAreas} />

      <div className="os-card overflow-hidden border border-dashed border-[var(--border)] bg-[var(--muted-bg)]/30">
        <div className="px-4 py-5 sm:px-6">
          <p className="text-[13px] font-semibold text-[var(--foreground)]">
            Locales recomendados (Idealista / mercado)
          </p>
          <p className="mt-2 text-[20px] font-semibold tracking-tight text-[var(--accent)]">
            Próximamente
          </p>
          <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-[var(--muted)]">
            Estamos trabajando para que, en el futuro, OpenSpot pueda sugerirte locales concretos que
            encajen con esta búsqueda —tamaño, renta orientativa y zona— y ayudarte a acotar visitas
            comerciales. Mientras tanto, usa el informe de competencia y afluencia para priorizar
            barrios y negociar con agencias o portales por tu cuenta.
          </p>
        </div>
      </div>

      <div className="os-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <p className="text-[13px] font-semibold">Cuadro de zonas priorizadas</p>
          <p className="text-[11px] text-[var(--muted)]">
            Cifras modelo; validar siempre en terreno.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[var(--muted-bg)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-2">Zona</th>
                <th className="px-4 py-2">Compet. (est.)</th>
                <th className="px-4 py-2">Ing. mediano / mes</th>
                <th className="px-4 py-2">Costes / mes</th>
                <th className="px-4 py-2">Saturación</th>
                <th className="px-4 py-2">Recom.</th>
              </tr>
            </thead>
            <tbody>
              {result.bestAreas.map((z) => (
                <tr key={z.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-medium">{z.name}</td>
                  <td className="px-4 py-3 tabular-nums">
                    ~{Math.round(z.competitorCount ?? 0)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {z.revenue.monthlyMid.toLocaleString("es-ES")} €
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {z.costs.totalMonthly.toLocaleString("es-ES")} €
                  </td>
                  <td className="px-4 py-3 tabular-nums">{z.saturationScore}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {z.recommendationScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`rounded-2xl border px-5 py-6 sm:px-7 ${
          ci?.recommendExploreOtherAreas
            ? "border-amber-500/35 bg-amber-500/[0.07]"
            : "border-[var(--border)] bg-[var(--card)]"
        }`}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Recomendación orientativa
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--foreground)]">
          {ci?.recommendReason ??
            "Contrasta este resultado con visitas locales y, si puedes, repite el estudio en otra ciudad o barrio para comparar relación población / competencia antes de cerrar inversión."}
        </p>
        <div className="mt-5">
          <Link
            href="/analyze"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-6 text-[14px] font-semibold text-[var(--background)] shadow-sm transition-[filter,transform] hover:brightness-110 active:scale-[0.99]"
          >
            Volver a realizar un estudio
          </Link>
          <p className="mt-3 text-[12px] text-[var(--muted)]">
            Prueba otro municipio, otro tipo de negocio o un pin distinto para comparar
            oportunidades.
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  display,
  hint,
}: {
  label: string;
  value: number | null;
  display?: string;
  hint: string;
}) {
  return (
    <div className="os-card p-5">
      <p className="text-[12px] font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums sm:text-3xl">
        {display ?? (value !== null ? value : "—")}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
    </div>
  );
}
