import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Informes de ubicación | Producto OpenSpot",
  description:
    "Qué incluye el informe OpenSpot: resumen con IA, señales de datos, mapa de zonas, tabla económica y referencias de locales. Uso en due diligence y expansión.",
  alternates: { canonical: "/producto/informes" },
};

export default function ProductoInformesPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">Informes de ubicación</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El informe es la salida principal del flujo de análisis. No es un PDF estático generado en
        plantillas vacías: combina texto narrativo (resumen asistido por modelo de lenguaje), bloques
        de señales de datos y componentes visuales (mapa, tarjetas de puntuación, tabla de zonas y
        ejemplos de referencia de mercado). El objetivo es que en una sola lectura entiendas qué zona
        conviene visitar primero y con qué hipótesis económicas comparar ofertas reales de alquiler.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Capa de datos y señales</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Antes del resumen narrativo verás una lista de “señales” derivadas del pipeline: población de
        referencia según padrón INE, año de los datos, indicios de mercado y otras pistas que anclan el
        informe en fuentes verificables. Sirven para dos cosas: dar contexto a quien no conoce el
        municipio y recordarte que el modelo opera sobre agregados, no sobre microcensos de tu calle
        exacta.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Resumen ejecutivo (IA)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El párrafo largo resume el resultado en lenguaje natural: municipio, tipo de negocio,
        presupuesto declarado y zona destacada cuando aplica. Es útil para pegar en un email o
        presentación, pero debe leerse junto con las métricas numéricas: la IA puede suavizar matices o
        omitir limitaciones que sí están descritas en{" "}
        <Link href="/producto/resultados" className="font-semibold text-[var(--accent)] hover:underline">
          Entender resultados
        </Link>
        .
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Tarjetas y tabla</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Las tarjetas resumen la zona mejor clasificada en cuanto a rentabilidad modelada, competencia,
        saturación sectorial e inversión orientativa. La tabla lista varias zonas candidatas con
        ingresos medios estimados, costes mensuales modelo y saturación por fila. Juntas permiten
        detectar si el ranking depende de un solo factor (por ejemplo alquiler muy bajo) o de un
        equilibrio más robusto.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Locales referencia (estilo Idealista)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El bloque de ejemplos agregados orienta magnitudes de alquiler y tamaño en metros cuadrados por
        zona. No son ofertas replicables tal cual: son referencias sintéticas para calibrar expectativas
        antes de entrar en portales. Siempre contrasta con anuncios vigentes y negociación con el
        propietario.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Limitaciones explícitas</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
        <li>No sustituye tasación, proyecto de obra ni licencias urbanísticas.</li>
        <li>No valida tráfico peatonal real en franja horaria concreta sin trabajo de campo.</li>
        <li>Los importes son estimaciones; el mercado puede desviarse por activo singular.</li>
      </ul>

      <p className="mt-10 text-[15px] leading-relaxed text-[var(--muted)]">
        Profundiza en el origen de cada número en{" "}
        <Link href="/producto/datos" className="font-semibold text-[var(--accent)] hover:underline">
          Datos y fuentes
        </Link>{" "}
        y en las definiciones en{" "}
        <Link href="/producto/motor" className="font-semibold text-[var(--accent)] hover:underline">
          Motor de puntuación
        </Link>
        .
      </p>

      <Link
        href="/login?callbackUrl=/analyze"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
      >
        Generar un informe
      </Link>
    </main>
  );
}
