"use client";

import type { ScoredZone } from "@/lib/types/analysis";

interface ZonesMapProps {
  zones: ScoredZone[];
  highlightTop?: number;
}

export function ZonesMap({ zones, highlightTop = 3 }: ZonesMapProps) {
  const topIds = new Set(zones.slice(0, highlightTop).map((z) => z.id));

  return (
    <div className="os-card relative overflow-hidden bg-[var(--muted-bg)]/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(14,165,233,0.1),transparent_40%)]" />
      <div className="relative grid min-h-[220px] grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        {zones.map((z) => {
          const hot = topIds.has(z.id);
          return (
            <div
              key={z.id}
              className={`flex flex-col justify-between rounded-xl border px-3 py-2 text-xs ${
                hot
                  ? "border-indigo-500/40 bg-white/80 shadow-sm dark:bg-zinc-900/80"
                  : "border-[var(--border)] bg-white/50 dark:bg-zinc-950/50"
              }`}
            >
              <div>
                <p className="font-medium text-[var(--foreground)]">{z.name}</p>
                <p className="mt-1 text-[var(--muted)]">
                  Score {z.recommendationScore}
                </p>
              </div>
              <p className="mt-2 font-mono text-[10px] text-[var(--muted)]">
                {z.lat.toFixed(2)}, {z.lng.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
      <p className="border-t border-[var(--border)] px-4 py-2 text-[11px] text-[var(--muted)]">
        Vista de zonas (MVP). Sustituir por mapa interactivo con capas de
        competencia cuando conectes Google Maps.
      </p>
    </div>
  );
}
