import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Producto | OpenSpot",
  description:
    "Qué es OpenSpot: análisis de ubicación con datos municipales, zonas, informe con IA y métricas de rentabilidad y competencia para abrir negocio en España.",
};

const sections = [
  {
    href: "/producto/informes",
    title: "Informes ejecutivos",
    body: "Resumen redactado, señales de datos y tablas listas para compartir con socios, franquiciadores o banca. No sustituye visita comercial ni asesoría legal.",
  },
  {
    href: "/producto/datos",
    title: "Datos y fuentes",
    body: "Padrón INE, agregados propios, referencias de mercado inmobiliario y competencia modelada. Transparencia sobre qué es oficial, qué es estimación y qué debes contrastar in situ.",
  },
  {
    href: "/producto/resultados",
    title: "Entender cada resultado",
    body: "Rentabilidad por zona, competencia, saturación del sector, inversión orientativa, tabla de zonas, nivel de competencia municipal y listados tipo Idealista: definición de cada campo.",
  },
  {
    href: "/producto/mapas",
    title: "Mapas y zonas",
    body: "Cómo leer el mapa de candidatas, qué representa cada pin y cómo priorizar visitas a inmobiliarias según el ranking.",
  },
  {
    href: "/producto/motor",
    title: "Motor de puntuación",
    body: "Fórmulas simplificadas que ordenan zonas: margen mensual estimado, competidores, índice de saturación y puntuación de recomendación ponderada.",
  },
  {
    href: "/comparador",
    title: "Comparador de zonas",
    body: "Hasta 6 municipios, mismo sector: población INE, competidores modelados, ranking y texto ejecutivo. Cupos por plan; enlaza al análisis completo en los dos ganadores.",
  },
  {
    href: "/producto/comparador",
    title: "Demo gráficos (Enterprise)",
    body: "Vista de ejemplo con pirámides y población para usuarios Enterprise; el comparador operativo para todos los planes está en /comparador.",
  },
] as const;

export default function ProductoIndexPage() {
  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          OpenSpot
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-[2rem]">
          Producto: análisis de ubicación con datos
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          Centro de documentación en varias páginas: informes, fuentes, lectura de métricas, mapas y
          cómo calculamos las puntuaciones. Pensado para equipos que necesitan explicar el informe a
          terceros y posicionar búsquedas long-tail en Google.
        </p>
      </header>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Qué resuelve OpenSpot</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          Elegir municipio y microzona para un local físico implica demasiadas variables para hacerlo
          solo a intuición. OpenSpot acopla datos públicos y modelos económicos por tipo de negocio para
          producir un informe ordenado: dónde mirar primero, qué costes e ingresos son razonables como
          hipótesis de trabajo y qué presión competitiva sugiere el modelo.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
          El producto está pensado para founders, franquiciados y equipos de expansión que necesitan
          muchas URLs de contexto (blog + producto) y, sobre todo, un lenguaje común antes de firmar
          alquiler o inversión.
        </p>
      </section>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group block h-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm transition-[border-color,box-shadow] hover:border-[var(--border-strong)] hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--muted)]">{s.body}</p>
              <span className="mt-4 inline-block text-[13px] font-semibold text-[var(--accent)]">
                Leer sección →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/[0.06] to-violet-500/[0.04] p-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Siguiente paso</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
          Cuando entiendas las métricas en{" "}
          <Link href="/producto/resultados" className="font-semibold text-[var(--accent)] hover:underline">
            Entender resultados
          </Link>
          , genera tu primer caso en el analizador.
        </p>
        <Link
          href="/login?callbackUrl=/analyze"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
        >
          Analizar un municipio
        </Link>
      </div>
    </main>
  );
}
