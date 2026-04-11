"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { FootTrafficHeatmap } from "@/lib/types/analysis";

import { TrafficHeatmapPanel } from "@/components/analyze/TrafficHeatmapPanel";

type Tab = "population" | "traffic";

type Props = {
  city: string;
  ineYear: number;
  ineCode: string;
  padronPopulation: number;
  heatmap: FootTrafficHeatmap;
  sectorLabel: string;
  /** Vista inicial: en el informe priorizamos afluencia. */
  defaultTab?: Tab;
};

export function PopulationTrafficSection({
  city,
  ineYear,
  ineCode,
  padronPopulation,
  heatmap,
  sectorLabel,
  defaultTab = "traffic",
}: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  const popData = [{ name: "Padrón municipal", hab: padronPopulation }];

  return (
    <div className="os-card overflow-hidden">
      <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6 sm:py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Demanda y afluencia
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Población INE y tráfico peatonal modelado (7×24)
        </h3>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--muted)]">
          Cambia entre masa de demanda censal y el calendario horario de paso para decidir días y franjas
          de apertura.
        </p>
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
      </div>

      <div className="p-4 sm:p-6">
        {tab === "population" ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/40 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Municipio
                </p>
                <p className="mt-1 text-xl font-semibold text-[var(--foreground)]">{city}</p>
                <p className="mt-2 text-[12px] text-[var(--muted)]">
                  Código INE {ineCode} · año padrón {ineYear}
                </p>
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Habitantes (referencia)
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                  {padronPopulation.toLocaleString("es-ES")}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">
                  Base oficial INE integrada en el motor; el tráfico por hora se modela aparte cruzando
                  densidad, vertical y calendario español.
                </p>
              </div>
            </div>
            <div className="h-52 w-full sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip
                    formatter={(v) =>
                      typeof v === "number"
                        ? [`${v.toLocaleString("es-ES")} hab.`, "Padrón"]
                        : [String(v), ""]
                    }
                  />
                  <Bar dataKey="hab" fill="#4f46e5" radius={[6, 6, 0, 0]} name="habitantes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <TrafficHeatmapPanel heatmap={heatmap} sectorLabel={sectorLabel} />
        )}
      </div>
    </div>
  );
}
