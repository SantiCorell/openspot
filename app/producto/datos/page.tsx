import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datos y fuentes | Producto OpenSpot",
  description:
    "Padrón INE, agregados OpenSpot, competencia modelada y referencias inmobiliarias: qué es dato oficial, qué es estimación y cómo validar en campo.",
};

export default function ProductoDatosPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">Datos y fuentes</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        OpenSpot mezcla datos públicos estructurados, agregaciones propias y modelos económicos por
        vertical. Esta página aclara qué tratar como hecho administrativo, qué como proxy de mercado y
        qué como hipótesis generada para ordenar decisiones, no para sustituir el criterio profesional.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Padrón municipal (INE)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El análisis referencia población empadronada por municipio según la serie que incorporamos en el
        producto. Es la base demográfica oficial para contextualizar tamaño de mercado. No distingue por
        barrio dentro del municipio en todos los casos: para decisiones de micromanzana combina con
        capas de zonas y señales del modelo.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Zonas y mercado inmobiliario</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Las zonas candidatas incorporan señales de mercado (por ejemplo referencias de alquiler por
        identificador de zona cuando están disponibles en nuestro agregador). Los valores se usan para
        estimar costes fijos mensuales y comparar escenarios. Pueden quedar desactualizados respecto al
        día de tu búsqueda en portales: úsalos como orden de magnitud.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Competencia y saturación</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El recuento de competidores y los índices asociados provienen de capas geográficas y reglas del
        motor económico (ver{" "}
        <Link href="/producto/motor" className="font-semibold text-[var(--accent)] hover:underline">
          Motor de puntuación
        </Link>
        ). No es un scrape completo de todos los negocios abiertos en tiempo real: es una aproximación
        para comparar zonas entre sí dentro del mismo estudio.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Afluencia y variables “blandas”</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Cuando el pipeline usa índices de afluencia o analogías sectoriales, actúan como multiplicadores
        suaves sobre ingresos estimados. Su función es separar municipios o zonas con dinámicas
        distintas, no predecir colas en caja en una hora concreta.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Nivel de competencia (municipio)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        La etiqueta agregada baja / media / alta resume presión competitiva a escala municipal dentro
        del modelo. Aparece en narrativa y ayuda a explicar el contexto; no reemplaza un estudio de
        competencia específico para tu marca.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Buenas prácticas de validación</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
        <li>Cruza alquiler modelo con tres anuncios reales del barrio objetivo.</li>
        <li>Cuenta competidores directos caminando el radio de captación que usarás.</li>
        <li>Revisa licencias y usos del suelo con asesoría local antes de firmar.</li>
      </ul>

      <Link
        href="/producto/resultados"
        className="mt-10 inline-block text-[14px] font-semibold text-[var(--accent)] hover:underline"
      >
        Siguiente: entender cada métrica del informe →
      </Link>
    </main>
  );
}
