import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Motor de puntuación | Producto OpenSpot",
  description:
    "Cómo OpenSpot calcula rentabilidad, competencia, saturación, inversión orientativa y puntuación de recomendación por zona. Transparencia sin jerga innecesaria.",
};

export default function ProductoMotorPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">Motor de puntuación</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El motor toma tu municipio, tipo de negocio y presupuesto, enriquece zonas con señales de
        mercado y competidores, estima ingresos y costes, y convierte esas magnitudes en puntuaciones de
        0 a 100 que permiten ordenar candidatas. Lo importante no es el número en sí, sino la
        consistencia relativa entre zonas del mismo estudio.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Costes e ingresos modelo</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Para cada zona se calcula un desglose de costes mensuales (incluye alquiler estimado por metro
        cuadrado y otros componentes según la vertical) y un rango de ingresos con punto medio
        publicado en la tabla como “Rec. mid”. El margen mensual es la diferencia entre ingreso medio y
        coste total mensual.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Puntuación de rentabilidad</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Se deriva del margen mensual estimado mediante una función que lo lleva a escala 0–100. Zonas
        con más margen modelado reciben puntuaciones más altas. Si el margen es negativo en el modelo,
        la puntuación reflejará debilidad relativa frente al resto de candidatas.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Puntuación de competencia</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Parte del recuento de competidores en la zona. Más competidores reducen la puntuación según una
        fórmula lineal con suelo mínimo: la idea es penalizar presión rival manteniendo variación entre
        zonas. Es una proxy, no un censo exhaustivo.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Saturación por zona</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Escala la densidad de competidores en la micromanzana (crece con el recuento y se capa en un
        máximo). Sirve para comparar filas de la tabla. La saturación agregada del sector en el
        resultado global usa lógica análoga a escala ciudad.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Puntuación de recomendación</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Compuesto ponderado: aproximadamente 45 % rentabilidad, 35 % competencia (como alivio de
        presión) y 20 % inverso de saturación de zona. Ordena el ranking final: la primera fila es la
        que mejor equilibra, según el modelo, margen frente a presión competitiva.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Inversión orientativa</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Combina una fracción del presupuesto declarado con múltiplos de los costes fijos mensuales de la
        zona para aproximar inversión inicial más colchón. Es deliberadamente simple para ser estable
        entre ejecuciones comparables.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Nivel de competencia municipal</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Agrega señales del municipio completo y devuelve baja, media o alta para contextualizar el
        informe en texto natural. Es coherente con el agregador, no con cada celda de la tabla.
      </p>

      <p className="mt-10 text-[15px] leading-relaxed text-[var(--muted)]">
        Para lectura no técnica de cada campo en pantalla, usa{" "}
        <Link href="/producto/resultados" className="font-semibold text-[var(--accent)] hover:underline">
          Entender resultados
        </Link>
        .
      </p>

      <Link
        href="/login?callbackUrl=/analyze"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
      >
        Ejecutar el motor con mis datos
      </Link>
    </main>
  );
}
