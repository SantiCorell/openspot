"use client";

import Link from "next/link";

import type { MarketSaturationBrief } from "@/lib/types/analysis";

export function MarketSaturationPanel({ brief }: { brief: MarketSaturationBrief }) {
  const border =
    brief.severity === "extreme"
      ? "border-amber-500/35 bg-gradient-to-br from-amber-500/[0.09] to-orange-500/[0.05]"
      : "border-[var(--border)] bg-[var(--muted-bg)]/40";

  return (
    <div className={`os-card overflow-hidden border-2 ${border}`}>
      <div className="border-b border-[var(--border)] px-4 py-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800 dark:text-amber-200">
          Estrategia de expansión
        </p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-[var(--foreground)]">
          {brief.title}
        </h3>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">{brief.body}</p>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <p className="text-[12px] font-semibold text-[var(--foreground)]">
          Municipios sugeridos para un nuevo estudio OpenSpot
        </p>
        <p className="mt-1 text-[11px] text-[var(--muted)]">
          Cada fila enlaza al analizador: inicia sesión y busca el nombre exacto INE.
        </p>
        <ul className="mt-4 space-y-3">
          {brief.alternatives.map((a) => (
            <li
              key={a.ineCode}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[14px] font-semibold text-[var(--foreground)]">{a.ineName}</p>
                <p className="text-[11px] tabular-nums text-[var(--muted)]">
                  INE {a.ineCode} · {a.population.toLocaleString("es-ES")} hab.
                </p>
              </div>
              <p className="mt-1 text-[12px] font-medium text-indigo-700 dark:text-indigo-300">
                {a.headline}
              </p>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">{a.expectedEdge}</p>
              <Link
                href="/login?callbackUrl=/analyze"
                className="mt-3 inline-flex text-[12px] font-semibold text-[var(--accent)] hover:underline"
              >
                Analizar {a.ineName} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
