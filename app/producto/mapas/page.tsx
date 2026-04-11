import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mapas y zonas | Producto OpenSpot",
  description:
    "Cómo leer el mapa de zonas candidatas en OpenSpot: priorización, pins, relación con la tabla y planificación de visitas comerciales.",
  alternates: { canonical: "/producto/mapas" },
};

export default function ProductoMapasPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">Mapas y zonas</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El mapa traduce el ranking numérico en geografía. Su función principal no es sustituir un GIS
        corporativo, sino alinear al equipo sobre “por dónde empezamos a caminar” y reducir discusiones
        abstractas cuando varias personas evalúan el mismo municipio desde sitios distintos.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Zonas candidatas</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Cada marcador corresponde a una fila del modelo económico: tiene nombre, coordenadas aproximadas
        y métricas asociadas (ingresos, costes, saturación) visibles en la tabla bajo el mapa. La zona
        que encabeza el ranking debería ser tu primera parada comercial salvo que el mapa revele
        barreras no modeladas (obras, accesos, percepción de seguridad, cambios recientes de tráfico).
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Cómo combinar mapa y tabla</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        Usa la tabla para ordenar por números y el mapa para detectar proximidad: dos zonas con
        puntuaciones parecidas pueden estar a distinta distancia de tu cadena logística o de la
        captación peatonal real. El mapa también ayuda a explicar el informe a alguien que no está
        habituado a leer hojas de cálculo.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Radio de captación real</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
        El modelo usa reglas de agregación por zona; tu negocio puede depender de un radio menor o
        mayor (delivery, destino fin de semana, oficinas cercanas). Cuando visites el pin, dibuja
        mentalmente tu isócrona real y vuelve a contar competidores dentro de ese radio.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Errores comunes</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--muted)]">
        <li>Confundir “zona con mejor puntuación” con “calle concreta disponible hoy”.</li>
        <li>Ignorar estacionalidad visible solo en campo (turismo, eventos, obras).</li>
        <li>Descartar una zona por estética sin contrastar coste fijo de la tabla.</li>
      </ul>

      <Link
        href="/producto/resultados"
        className="mt-10 inline-block text-[14px] font-semibold text-[var(--accent)] hover:underline"
      >
        Volver a definiciones de métricas →
      </Link>
    </main>
  );
}
