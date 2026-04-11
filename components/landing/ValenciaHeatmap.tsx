"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";

const ValenciaMapCanvas = dynamic(() => import("./ValenciaMapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(42vh,340px)] min-h-[260px] w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] text-[13px] text-[var(--muted)]">
      Cargando mapa…
    </div>
  ),
});

/** Bloque siempre visible (sin acordeón) para que mapa y texto se vean al cargar en móvil y desktop. */
export function ValenciaHeatmap() {
  return (
    <section
      className="os-card flex flex-col overflow-hidden p-5 sm:p-6"
      aria-labelledby="valencia-map-heading"
    >
      <header className="border-b border-[var(--border)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Mapa real · ejemplo València
        </p>
        <h3 id="valencia-map-heading" className="mt-1 text-lg font-semibold tracking-tight">
          Mismo tipo de vista que usarás en el informe
        </h3>
        <p className="mt-1 text-[12px] text-[var(--muted)]">
          Mapa interactivo listo abajo; en el informe se adapta a tu municipio.
        </p>
      </header>

      <div className="mt-4 space-y-4">
        <p className="text-[13px] leading-relaxed text-[var(--muted)]">
          Calles y barrios de verdad. Los círculos muestran la{" "}
          <strong className="text-[var(--foreground)]">intensidad modelada</strong> por zona
          (afluencia / oportunidad relativa). Toca un círculo para leer el contexto.
        </p>

        <ValenciaMapCanvas />

        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--muted)]">
            En tu análisis eliges municipio y negocio; el mapa se adapta al territorio.
          </p>
          <Link
            href="/login?callbackUrl=/analyze"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-4 py-2.5 text-[13px] font-semibold text-[var(--background)] shadow-md transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.99]"
          >
            Probar con mi zona
            <ArrowRightIcon className="h-4 w-4 opacity-90" />
          </Link>
        </div>
      </div>
    </section>
  );
}
