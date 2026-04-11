"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FootTrafficHeatmap } from "@/lib/types/analysis";
import { WEEKDAY_LABELS_ES_SHORT } from "@/lib/types/analysis";

type Props = {
  heatmap: FootTrafficHeatmap;
  /** Etiqueta breve del sector para microcopy */
  sectorLabel: string;
};

export function TrafficHeatmapPanel({ heatmap, sectorLabel }: Props) {
  const [selectedDay, setSelectedDay] = useState(0);
  const { cells, maxCell } = heatmap;

  const dayProfileData = useMemo(() => {
    const row = cells[selectedDay] ?? [];
    return row.map((value, hour) => ({
      hour: `${String(hour).padStart(2, "0")}:00`,
      personas: value,
    }));
  }, [cells, selectedDay]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/30 p-4">
        <p className="text-[13px] leading-relaxed text-[var(--foreground)]">{heatmap.narrative}</p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Lun–Vie (media)
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--foreground)]">
              {heatmap.weekdayAvgPerHour.toLocaleString("es-ES")}{" "}
              <span className="text-[12px] font-medium text-[var(--muted)]">pers./h</span>
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Sábado (media)
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--foreground)]">
              {heatmap.saturdayAvgPerHour.toLocaleString("es-ES")}{" "}
              <span className="text-[12px] font-medium text-[var(--muted)]">pers./h</span>
            </dd>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
              Domingo (media)
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--foreground)]">
              {heatmap.sundayAvgPerHour.toLocaleString("es-ES")}{" "}
              <span className="text-[12px] font-medium text-[var(--muted)]">pers./h</span>
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold text-[var(--foreground)]">
              Mapa de calor semanal (personas/h estimadas)
            </p>
            <p className="text-[11px] text-[var(--muted)]">
              Eje Y: días · Eje X: hora del día · Intensidad = paso peatonal modelado para {sectorLabel}
            </p>
          </div>
          <p className="text-[10px] text-[var(--muted)]">
            Pico global: <span className="font-semibold text-[var(--foreground)]">{heatmap.peakWindowLabel}</span>
          </p>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 sm:p-3">
          <table className="w-max min-w-full border-separate border-spacing-px text-[9px] sm:text-[10px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-[var(--card)] px-1 py-1 text-left font-semibold text-[var(--muted)]">
                  Día \ H
                </th>
                {Array.from({ length: 24 }, (_, h) => (
                  <th
                    key={h}
                    className="w-5 min-w-[14px] px-0 py-1 text-center font-medium text-[var(--muted)] sm:w-6"
                    title={`${h}:00`}
                  >
                    <span className="hidden sm:inline">{h % 2 === 0 ? h : "·"}</span>
                    <span className="sm:hidden">{h % 4 === 0 ? h : ""}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEEKDAY_LABELS_ES_SHORT.map((dayLabel, d) => (
                <tr key={dayLabel}>
                  <th className="sticky left-0 z-10 whitespace-nowrap bg-[var(--card)] px-1.5 py-0.5 text-left text-[10px] font-semibold text-[var(--foreground)] sm:text-[11px]">
                    {dayLabel}
                  </th>
                  {(cells[d] ?? []).map((v, h) => {
                    const t = maxCell > 0 ? v / maxCell : 0;
                    const alpha = 0.06 + t * 0.88;
                    return (
                      <td
                        key={h}
                        title={`${dayLabel} ${h}:00 — ~${v.toLocaleString("es-ES")} pers./h`}
                        className="h-6 w-5 min-w-[14px] rounded-sm border border-[var(--border)]/40 p-0 sm:h-7 sm:w-6"
                        style={{
                          backgroundColor: `rgba(79, 70, 229, ${alpha})`,
                        }}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[var(--muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded-sm bg-[rgba(79,70,229,0.12)] ring-1 ring-[var(--border)]" />
            Bajo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded-sm bg-[rgba(79,70,229,0.45)] ring-1 ring-[var(--border)]" />
            Medio
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-6 rounded-sm bg-[rgba(79,70,229,0.88)] ring-1 ring-[var(--border)]" />
            Alto
          </span>
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-[var(--foreground)]">
          Perfil horario del día seleccionado
        </label>
        <p className="text-[11px] text-[var(--muted)]">
          Elige el día para ver barras por hora (útil para plantear apertura, turnos y clases).
        </p>
        <select
          className="os-select mt-2 w-full max-w-xs text-[13px]"
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
        >
          {WEEKDAY_LABELS_ES_SHORT.map((label, i) => (
            <option key={label} value={i}>
              {label}
            </option>
          ))}
        </select>
        <div className="mt-4 h-56 min-h-56 w-full min-w-0 sm:h-64 sm:min-h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayProfileData} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} interval={2} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(v) =>
                  typeof v === "number"
                    ? [`~${v.toLocaleString("es-ES")} pers./h`, "Paso modelado"]
                    : [String(v), ""]
                }
              />
              <Bar dataKey="personas" fill="#6366f1" radius={[4, 4, 0, 0]} name="personas/h" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
