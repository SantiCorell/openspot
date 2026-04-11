"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { TrafficHeatmapPanel } from "@/components/analyze/TrafficHeatmapPanel";
import { buildFootTrafficHeatmap } from "@/lib/services/footTrafficModel";
import type { BusinessType } from "@/lib/types/analysis";
import { BUSINESS_LABELS } from "@/lib/types/analysis";

import type { ShowdownMunicipio } from "@/components/landing/LandingCharts";

const BAR_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#0d9488", "#0891b2", "#7c3aed"];

function sortShowdown(m: ShowdownMunicipio[]) {
  return [...m].sort((a, b) => b.population - a.population);
}

type Props = {
  municipalities: ShowdownMunicipio[];
};

export function LandingPopulationTrafficExplorer({ municipalities }: Props) {
  const sorted = useMemo(() => sortShowdown(municipalities), [municipalities]);
  const [idx, setIdx] = useState(() => {
    const s = sortShowdown(municipalities);
    const i = s.findIndex((m) => m.shortLabel === "València");
    return i >= 0 ? i : 0;
  });
  const [businessType, setBusinessType] = useState<BusinessType>("gym");
  const [tab, setTab] = useState<"population" | "traffic">("traffic");

  const selected = sorted[idx] ?? sorted[0];
  const popChartData = sorted.map((m, i) => ({
    name: m.shortLabel,
    population: m.population,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  const heatmap = useMemo(() => {
    if (!selected) return null;
    const dens = Math.min(0.94, Math.log10(selected.population + 10) / 6.25);
    return buildFootTrafficHeatmap(
      {
        id: `landing-${selected.shortLabel}`,
        name: `${selected.shortLabel} · corazón comercial`,
        populationDensity: dens,
        medianIncomeIndex: 0.7 + (idx % 3) * 0.06,
      },
      businessType,
      selected.population,
    );
  }, [selected, businessType, idx]);

  if (!selected || !heatmap) return null;

  return (
    <div className="os-card flex flex-col overflow-hidden p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Vista previa del informe
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">
        Población INE y tráfico peatonal por horas
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
        Misma lógica que en el estudio: compara padrón y cambia a tráfico con calendario lunes–domingo.
        Prueba gimnasio vs bar para ver cómo cambia el perfil horario.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block flex-1 min-w-[140px]">
          <span className="text-[11px] font-medium text-[var(--muted)]">Municipio demo</span>
          <select
            className="os-select mt-1 w-full text-[13px]"
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
          >
            {sorted.map((m, i) => (
              <option key={m.shortLabel} value={i}>
                {m.shortLabel} ({m.population.toLocaleString("es-ES")} hab.)
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 min-w-[160px]">
          <span className="text-[11px] font-medium text-[var(--muted)]">Vertical</span>
          <select
            className="os-select mt-1 w-full text-[13px]"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value as BusinessType)}
          >
            <option value="gym">{BUSINESS_LABELS.gym}</option>
            <option value="bar">{BUSINESS_LABELS.bar}</option>
            <option value="restaurant">{BUSINESS_LABELS.restaurant}</option>
            <option value="cafe">{BUSINESS_LABELS.cafe}</option>
          </select>
        </label>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--muted-bg)] p-1">
        <button
          type="button"
          onClick={() => setTab("population")}
          className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
            tab === "population"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Población
        </button>
        <button
          type="button"
          onClick={() => setTab("traffic")}
          className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${
            tab === "traffic"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Tráfico Lun–Dom
        </button>
      </div>

      <div className="mt-5 border-t border-[var(--border)] pt-5">
        {tab === "population" ? (
          <div className="h-64 w-full sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={popChartData}
                margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? `${value.toLocaleString("es-ES")} hab.`
                      : String(value)
                  }
                />
                <Bar dataKey="population" name="habitantes" radius={[0, 6, 6, 0]}>
                  {popChartData.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <TrafficHeatmapPanel
            heatmap={heatmap}
            sectorLabel={BUSINESS_LABELS[businessType].toLowerCase()}
          />
        )}
      </div>
    </div>
  );
}
