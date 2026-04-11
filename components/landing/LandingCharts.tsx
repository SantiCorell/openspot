"use client";

import Link from "next/link";

import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BAR_COLORS = [
  "#4f46e5",
  "#6366f1",
  "#818cf8",
  "#0d9488",
  "#0891b2",
  "#7c3aed",
];

export type ShowdownMunicipio = {
  shortLabel: string;
  population: number;
  densityPerKm2: number;
  angle: string;
};

/** Gráfico compacto de padrón (p. ej. página Enterprise comparador). */
export function LandingPopulationChart({ data }: { data: { name: string; population: number }[] }) {
  return (
    <div className="os-card p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        INE + motor OpenSpot (millones de datos propios)
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">
        Comparativa rápida de población
      </h3>
      <p className="mt-1 text-[13px] text-[var(--muted)]">
        Padrón oficial cruzado con la base analítica que normaliza oportunidad en cada estudio.
      </p>
      <div className="mt-4 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip
              formatter={(value) => [
                typeof value === "number"
                  ? value.toLocaleString("es-ES") + " hab."
                  : String(value),
                "Padrón",
              ]}
            />
            <Bar dataKey="population" fill="#6366f1" radius={[6, 6, 0, 0]} name="habitantes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Bloque marketing: comparativa CV + densidad + narrativa + CTAs. */
export function LandingMunicipioShowdown({
  data,
  landingSimple = false,
}: {
  data: ShowdownMunicipio[];
  /** Home: un solo gráfico y menos ruido. */
  landingSimple?: boolean;
}) {
  const popSorted = [...data].sort((a, b) => b.population - a.population);
  const denSorted = [...data].sort((a, b) => b.densityPerKm2 - a.densityPerKm2);

  const maxPop = popSorted[0];
  const maxDen = denSorted[0];
  const totalPop = data.reduce((s, m) => s + m.population, 0);
  const valencia = data.find((m) => m.shortLabel === "València");
  const valShare = valencia ? Math.round((valencia.population / totalPop) * 1000) / 10 : null;

  const popChartData = popSorted.map((m, i) => ({
    name: m.shortLabel,
    population: m.population,
    color: BAR_COLORS[i % BAR_COLORS.length],
  }));

  const denChartData = denSorted.map((m) => ({
    name: m.shortLabel,
    density: Math.round(m.densityPerKm2),
    color:
      BAR_COLORS[
        popSorted.findIndex((p) => p.shortLabel === m.shortLabel) % BAR_COLORS.length
      ],
  }));

  return (
    <section
      className="os-card flex flex-col p-5 sm:p-6"
      aria-labelledby="showdown-heading"
    >
      <header className="border-b border-[var(--border)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Padrón INE 2025 + datos propios OpenSpot · CV
        </p>
        <h3 id="showdown-heading" className="mt-1 text-lg font-semibold tracking-tight">
          {landingSimple
            ? "¿Dónde hay más gente? (referencia INE + nuestra base)"
            : "València frente a municipios que marcan el ritmo"}
        </h3>
        <p className="mt-1 text-[12px] text-[var(--muted)]">
          Gráficos y lectura visibles al cargar; sin pasos extra en móvil.
        </p>
      </header>

      <div className="mt-4 space-y-5">
        <p className="text-[13px] leading-relaxed text-[var(--muted)]">
          {landingSimple
            ? "Grandes ciudades de la CV: cifras de padrón que el motor combina con millones de registros propios (competencia, afluencia, mercado) para cada informe."
            : "No comparamos con pueblos pequeños: son capitales, costa turística y polos que compiten por el mismo euro. La densidad (hab/km²) explica presión de suelo; el padrón explica masa de demanda — y OpenSpot lo enriquece con capas propias actualizadas."}
        </p>

        <div className="space-y-5">
        <div>
          <p className="text-[12px] font-semibold text-[var(--foreground)]">
            Habitantes (fuente INE, capa OpenSpot)
          </p>
          <div className="mt-2 h-[200px] w-full sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={popChartData}
                margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
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
        </div>

        {!landingSimple ? (
          <div>
            <p className="text-[12px] font-semibold text-[var(--foreground)]">
              Densidad (hab/km², superficie de referencia)
            </p>
            <div className="mt-2 h-[200px] w-full sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={denChartData}
                  margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "density"
                        ? [`${value} hab./km²`, "Densidad"]
                        : [String(value), name]
                    }
                  />
                  <Bar dataKey="density" name="density" radius={[0, 6, 6, 0]}>
                    {denChartData.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null}
        </div>

      {!landingSimple ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <p className="text-[13px] font-semibold text-[var(--foreground)]">
            Perfil comercial por municipio (guía rápida)
          </p>
          <ul className="mt-3 space-y-2.5 border-t border-[var(--border)] pt-3 text-[12px] leading-relaxed text-[var(--muted)]">
            {data.map((m) => (
              <li key={m.shortLabel}>
                <span className="font-semibold text-[var(--foreground)]">{m.shortLabel}: </span>
                {m.angle}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/40 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Quién gana en qué (lectura rápida)
        </p>
        <ul className="space-y-2.5 text-[13px] leading-relaxed text-[var(--foreground)]">
          <li>
            <span className="font-semibold text-indigo-600 dark:text-indigo-300">
              Masa de demanda:{" "}
            </span>
            {maxPop?.shortLabel} con{" "}
            <span className="tabular-nums font-medium">
              {maxPop?.population.toLocaleString("es-ES")} hab.
            </span>
            {valShare !== null ? (
              <>
                {" "}
                — València sola concentra el{" "}
                <span className="font-medium tabular-nums">{valShare}%</span> del padrón
                agregado en esta muestra (el informe completo suma más señales propias).
              </>
            ) : null}
          </li>
          <li>
            <span className="font-semibold text-cyan-700 dark:text-cyan-300">
              Presión territorial:{" "}
            </span>
            {maxDen?.shortLabel} lidera en densidad (
            <span className="tabular-nums font-medium">
              {Math.round(maxDen?.densityPerKm2 ?? 0).toLocaleString("es-ES")} hab./km²
            </span>
            ): menos metros cuadrados por vecino, más competencia por escaparate.
          </li>
          {!landingSimple ? (
            <li>
              <span className="font-semibold text-[var(--foreground)]">Matiz estratégico: </span>
              Elche y Castelló combinan población seria sin la misma focalización turística que
              Benidorm o Torrevieja; Alicante compite en costa con reglas parecidas a
              València ciudad. OpenSpot cruza esto con saturación por sector en tu informe.
            </li>
          ) : (
            <li>
              <span className="font-semibold text-[var(--foreground)]">Siguiente paso: </span>
              En el informe cruzamos esto con tu sector (hostelería, retail, servicios…) y
              te ordenamos zonas con puntuación y texto ejecutivo.
            </li>
          )}
        </ul>
      </div>

      <div className="mt-4 space-y-2 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-3">
        <p className="text-[12px] font-semibold text-[var(--foreground)]">
          Tres clics hasta el informe
        </p>
        <ol className="list-decimal space-y-1 pl-4 text-[12px] text-[var(--muted)]">
          <li>Crear cuenta (Google o email de prueba en dev).</li>
          <li>Elegir municipio (INE) y tipo de negocio; el motor cruza BBDD propias.</li>
          <li>Descargar señales + texto ejecutivo DeepSeek.</li>
        </ol>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/login?callbackUrl=/analyze"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-4 py-2.5 text-[13px] font-semibold text-[var(--background)] shadow-md transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.99] sm:flex-none"
          >
            Registrarse gratis
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[13px] font-semibold text-[var(--foreground)] transition-[border-color] hover:border-[var(--border-strong)] sm:flex-none"
          >
            Ver planes
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}

type AgeRow = {
  name: string;
  a014: number;
  a1529: number;
  a3044: number;
  a4564: number;
  a65: number;
};

export function LandingAgeChart({ data }: { data: AgeRow[] }) {
  return (
    <div className="os-card p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Pirámide por tramos (modelo referencia INE)
      </p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight">
        Perfiles que no se parecen: València · Alacant · Benidorm
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">
        Misma fuente INE, tres historias distintas: capital regional, gran ciudad costera
        y enclave turístico. La edad condiciona ticket, horarios y estacionalidad.
      </p>
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip
              formatter={(v) =>
                typeof v === "number" ? v.toLocaleString("es-ES") : String(v)
              }
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="a014" stackId="a" fill="#a5b4fc" name="0-14" />
            <Bar dataKey="a1529" stackId="a" fill="#818cf8" name="15-29" />
            <Bar dataKey="a3044" stackId="a" fill="#6366f1" name="30-44" />
            <Bar dataKey="a4564" stackId="a" fill="#4f46e5" name="45-64" />
            <Bar dataKey="a65" stackId="a" fill="#312e81" name="65+" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
