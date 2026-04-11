import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { modelAgePyramid } from "@/lib/ine/ageModel";
import { prisma } from "@/lib/prisma";

import { LandingAgeChart, LandingPopulationChart } from "@/components/landing/LandingCharts";

import padron from "@/lib/data/ine-municipios-padron.json";

export const metadata: Metadata = {
  title: "Comparador municipal (Enterprise) | OpenSpot",
  description:
    "Solo Enterprise: compara municipios con padrón INE, datos propios OpenSpot y estructura por edades.",
  alternates: { canonical: "/producto/comparador" },
};

type Row = { n: string; c: string; p: number; y: number };

export const dynamic = "force-dynamic";

export default async function EnterpriseComparatorPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/producto/comparador");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user || user.planTier !== "enterprise") {
    redirect("/pricing?motivo=enterprise");
  }

  const rows = padron as Row[];
  const pick = (n: string) => rows.find((m) => m.n === n);
  const val = pick("València");
  const mas = pick("Massamagrell");
  const roc = pick("Rocafort");

  const trio = [val, mas, roc].filter(Boolean) as Row[];

  const popChart = trio.map((m) => ({ name: m.n, population: m.p }));

  const ageChart = trio.map((m) => {
    const py = modelAgePyramid(m.p);
    return {
      name: m.n,
      a014: py["0-14"],
      a1529: py["15-29"],
      a3044: py["30-44"],
      a4564: py["45-64"],
      a65: py["65+"],
    };
  });

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
          Enterprise
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Comparador municipal
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
          Ejemplo con padrón INE y capas del motor OpenSpot:{" "}
          <strong>València</strong> frente a municipios periféricos con menor
          densidad de competencia relativa (<strong>Massamagrell</strong>,{" "}
          <strong>Rocafort</strong>). La pirámide por edades usa tramos de
          referencia nacionales escalados al total municipal (visualización
          analítica OpenSpot).
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-[14px] font-semibold">
          <Link
            href="/comparador"
            className="text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Comparador multi-municipio (todos los planes)
          </Link>
          <Link href="/analyze" className="text-[var(--accent)] underline-offset-4 hover:underline">
            Lanzar análisis completo
          </Link>
        </div>
      </div>

      <LandingPopulationChart data={popChart} />
      <LandingAgeChart data={ageChart} />

      <div className="os-card p-6 text-[14px] leading-relaxed text-[var(--muted)]">
        <p>
          Este comparador es exclusivo del plan Enterprise e ilustra cómo
          contrastar núcleos saturados vs. corredores con más hueco de mercado.
          Las cifras de población son las publicadas por el INE en el dataset integrado;
          el producto añade millones de señales propias para contextualizar oportunidad.
        </p>
      </div>
    </main>
  );
}
