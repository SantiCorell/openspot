import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Entender resultados del análisis | Producto OpenSpot",
  description:
    "Significado de rentabilidad, competencia, saturación, inversión orientativa, tabla de zonas, resumen IA y listados referencia. Guía completa para leer el informe OpenSpot.",
  alternates: { canonical: "/producto/resultados" },
};

export default function ProductoResultadosPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
        Entender todos los resultados
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Cada bloque del informe responde a una pregunta distinta. Aquí tienes la definición operativa
        (qué mide el software) y la interpretación recomendada (qué decisión apoya y qué no debes
        deducir). Si algo no cuadra con tu experiencia local, prioriza el dato de campo y usa OpenSpot
        para reordenar hipótesis, no para invalidar la realidad del barrio.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Capa de datos OpenSpot (lista de señales)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Viñetas cortas que describen el contexto numérico y administrativo del estudio: municipio,
        población de referencia, año de los datos INE cuando aplica, y otras pistas del agregador. Son
        el ancla de trazabilidad entre lo que ves en pantalla y las fuentes descritas en{" "}
        <Link href="/producto/datos" className="font-semibold text-[var(--accent)] hover:underline">
          Datos y fuentes
        </Link>
        .
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Resumen con IA</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Texto generado a partir del resultado estructurado. Resume hallazgos y puede mencionar la zona
        prioritaria con su puntuación de recomendación. Es útil para comunicación externa; no es una
        auditoría financiera. Revisa siempre las cifras de la tabla y las tarjetas.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Rentabilidad (zona top)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Puntuación derivada del margen mensual estimado (ingresos medios modelados menos costes
        mensuales modelo) para la zona mejor clasificada. Valores altos indican más espacio entre ventas
        hipotéticas y gasto fijo bajo los supuestos del motor. No es beneficio neto contable ni EBITDA
        auditado.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Competencia</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Puntuación construida a partir del número de competidores modelados en la zona: más competidores
        implican más presión y suelen reducir la puntuación mostrada (el eje mental es “menos presión →
        número más alto en la escala que ves”). Compárala entre zonas del mismo informe, no como
        verdad absoluta del mercado.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Saturación del sector (índice)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Índice agregado a nivel ciudad/sector en el resultado completo del análisis.
        Captura densidad relativa de establecimientos del tipo analizado frente a la estructura de
        zonas. Un valor alto sugiere mercado maduro o competencia intensa; combínalo con rentabilidad
        por zona para ver si quedan micromercados saneados.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Inversión orientativa</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Aproximación a CAPEX más colchón de tesorería inicial, calibrada con tu presupuesto declarado y
        los costes fijos mensuales de la zona top. Es una guía de magnitud para planificar reunión con
        banco o inversor, no un presupuesto de implantación detallado.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Mapa de zonas</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Visualiza candidatas georreferenciadas. Úsalo para planificar ruta de visitas y contrastar con
        cómo se siente el entorno en horario de operación. Detalles en{" "}
        <Link href="/producto/mapas" className="font-semibold text-[var(--accent)] hover:underline">
          Mapas y zonas
        </Link>
        .
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Locales referencia (Idealista)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Listado de ejemplos con título, metros cuadrados, alquiler mensual, etiqueta de zona y nota de
        fuente. Objetivo: calibrar expectativas de cash-fixing; no sustituye contrato ni avalúo.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Tabla: Zona · Rec. mid · Costes/mes · Saturación</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
        <li>
          <strong className="text-[var(--foreground)]">Zona</strong>: nombre de la micromanzana
          candidata.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">Rec. mid</strong>: ingreso mensual medio
          estimado para la vertical y la zona bajo el modelo.
        </li>
        <li>
          <strong className="text-[var(--foreground)]">Costes / mes</strong>: suma aproximada de costes
          recurrentes modelo (incluye alquiler estimado y otros componentes definidos en el motor).
        </li>
        <li>
          <strong className="text-[var(--foreground)]">Saturación</strong>: índice de saturación por
          fila/zona, relacionado con la densidad competitiva local en el modelo.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Nivel de competencia (baja / media / alta)</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Clasificación municipal usada en narrativa y contexto. Resume agregados del pipeline; no
        reemplaza el mapa de rivales directos de tu marca.
      </p>

      <div className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--muted-bg)] p-6">
        <p className="text-[14px] font-semibold text-[var(--foreground)]">Regla de oro</p>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">
          Si dos métricas contradicen la intuición (por ejemplo saturación alta pero rentabilidad alta en
          una zona concreta), anota la hipótesis y comprueba en calle: a veces el modelo detecta un
          micromercado con tráfico excepcional o alquiler residual; a veces hay un sesgo de datos que
          solo corrige la visita física.
        </p>
      </div>

      <Link
        href="/login?callbackUrl=/analyze"
        className="mt-10 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
      >
        Ver resultados con mi proyecto
      </Link>
    </main>
  );
}
