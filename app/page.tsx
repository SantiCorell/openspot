import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";
import { OpenSpotMark } from "@/components/brand/OpenSpotMark";
import { HomeDemoSectionLoader } from "@/components/landing/HomeDemoSectionLoader";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import {
  SHOWDOWN_ANGLE,
  SHOWDOWN_AREA_KM2,
  SHOWDOWN_INE_NAMES,
  SHOWDOWN_SHORT_LABEL,
} from "@/lib/marketing/cvMunicipioShowdown";

import padron from "@/lib/data/ine-municipios-padron.json";
import { withCanonical } from "@/lib/seo/canonical";

export const metadata: Metadata = {
  ...withCanonical("/"),
};

type Row = { n: string; c: string; p: number; y: number };

function buildShowdown(rows: Row[]) {
  const out: {
    shortLabel: string;
    population: number;
    densityPerKm2: number;
    angle: string;
  }[] = [];

  for (const n of SHOWDOWN_INE_NAMES) {
    const row = rows.find((m) => m.n === n);
    if (!row) continue;
    const area = SHOWDOWN_AREA_KM2[n];
    out.push({
      shortLabel: SHOWDOWN_SHORT_LABEL[n],
      population: row.p,
      densityPerKm2: row.p / area,
      angle: SHOWDOWN_ANGLE[n],
    });
  }
  return out;
}

export default function HomePage() {
  const rows = padron as Row[];
  const showdown = buildShowdown(rows);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-15%,rgba(79,70,229,0.11),transparent),radial-gradient(ellipse_50%_45%_at_100%_10%,rgba(6,182,212,0.09),transparent),radial-gradient(ellipse_40%_35%_at_0%_80%,rgba(79,70,229,0.06),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-14 sm:gap-14 sm:px-6 sm:py-20 lg:max-w-5xl">
        {/* Hero + prueba social */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="space-y-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--card)]/80 py-1.5 pl-2 pr-4 shadow-sm backdrop-blur-sm">
              <OpenSpotMark size={36} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground)]/80">
                Dónde abrir, con datos
              </span>
            </div>
            <h1 className="text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.65rem] sm:leading-[1.06]">
              Oportunidades de negocio o la mejor ubicación para el tuyo.
            </h1>
            <p className="mx-auto max-w-xl text-[16px] leading-relaxed text-[var(--muted)] sm:mx-0 sm:max-w-lg">
              Tú eliges municipio y tipo de local. Nosotros cruzamos{" "}
              <strong className="text-[var(--foreground)]">padrón INE</strong> con{" "}
              <strong className="text-[var(--foreground)]">millones de datos propios</strong> en
              bases actualizadas, y te devolvemos{" "}
              <strong className="text-[var(--foreground)]">mapa</strong>,{" "}
              <strong className="text-[var(--foreground)]">competencia</strong> e{" "}
              <strong className="text-[var(--foreground)]">informe listo para decidir</strong>.
              Gratis para empezar.
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/login?callbackUrl=/analyze"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-7 text-[15px] font-semibold text-[var(--background)] shadow-md transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.99]"
              >
                Crear cuenta gratis
                <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-7 text-[15px] font-semibold text-[var(--foreground)] shadow-sm transition-[border-color] hover:border-[var(--border-strong)]"
              >
                Ver precios
              </Link>
              <Link
                href="/#como-funciona"
                className="inline-flex h-12 items-center justify-center text-[15px] font-semibold text-indigo-600 underline decoration-indigo-600/30 underline-offset-4 hover:decoration-indigo-600 sm:px-2 dark:text-indigo-400"
              >
                Ver cómo funciona
              </Link>
            </div>
            <p className="text-[13px] text-[var(--muted)]">
              1) Registro · 2) Municipio + negocio · 3) Informe. Sin llamadas.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-transparent to-cyan-500/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Por qué convierte
              </p>
              <ul className="mt-4 space-y-4 text-[14px] leading-relaxed text-[var(--foreground)]">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    ✓
                  </span>
                  <span>
                    <strong>Mapa real</strong> con calles y barrios — no un dibujo abstracto.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-700 dark:text-indigo-300">
                    ✓
                  </span>
                  <span>
                    <strong>INE + base OpenSpot</strong>: padrón oficial y millones de registros
                    propios en BBDD vivas (afluencia, competencia, mercado).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-800 dark:text-cyan-200">
                    ✓
                  </span>
                  <span>
                    <strong>Informe en lenguaje claro</strong> para socios, inversor o banco.
                  </span>
                </li>
              </ul>
              <Link
                href="/login?callbackUrl=/analyze"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-[14px] font-semibold text-white shadow-md"
              >
                Probar ahora — gratis
              </Link>
            </div>
          </div>
        </section>

        <LandingHowItWorks />

        {/* Demo visual: carga diferida para mejor TBT / JS inicial en móvil */}
        <section
          className="flex flex-col gap-8 [content-visibility:auto] [contain-intrinsic-size:auto_900px]"
          aria-label="Demostración de mapa y datos"
        >
          <HomeDemoSectionLoader showdown={showdown} />
        </section>

        {/* Cierre conversión */}
        <section className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-500/[0.08] to-cyan-500/[0.05] px-6 py-8 text-center sm:text-left">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            ¿Listo para tu municipio?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-[var(--muted)] sm:mx-0">
            Mismo flujo en toda España: municipios con referencia INE y capas propias con
            millones de puntos de datos que alimentan cada informe.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/login?callbackUrl=/analyze"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-7 text-[15px] font-semibold text-[var(--background)] shadow-md hover:shadow-lg"
            >
              Empezar ahora
              <ArrowRightIcon />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-7 text-[15px] font-semibold text-[var(--foreground)]"
            >
              Planes Pro y Enterprise
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
