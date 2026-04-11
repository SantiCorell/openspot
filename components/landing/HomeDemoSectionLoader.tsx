"use client";

import dynamic from "next/dynamic";

import type { ShowdownMunicipio } from "@/components/landing/LandingCharts";

const HomeBelowFoldDemo = dynamic(
  () => import("@/components/landing/HomeBelowFoldDemo").then((m) => m.HomeBelowFoldDemo),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-[920px] flex-col gap-8"
        aria-busy="true"
        role="status"
        aria-label="Cargando demostración interactiva"
      >
        {[1, 2, 3].map((k) => (
          <div
            key={k}
            className="min-h-72 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--muted-bg)]/50"
          />
        ))}
      </div>
    ),
  },
);

export function HomeDemoSectionLoader({ showdown }: { showdown: ShowdownMunicipio[] }) {
  return <HomeBelowFoldDemo showdown={showdown} />;
}
