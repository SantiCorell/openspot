import type { MarketSaturationBrief } from "@/lib/types/analysis";

/**
 * Brief comercial cuando el estudio detecta presión extrema de fitness en València capital.
 * Los datos de población/INE son reales; el copy orienta a nuevos estudios en municipios colindantes.
 */
export const VALENCIA_GYM_SATURATION_BRIEF: MarketSaturationBrief = {
  severity: "extreme",
  title: "Punto muy saturado para gimnasio en València ciudad",
  body:
    "El modelo agrega una densidad muy alta de salas de fitness, boutique training y cadenas low-cost " +
    "en las zonas con más afluencia residencial y comercial. Eso comprime márgenes en captación de socio, " +
    "sube el CAC en digital y encarece el alquiler por competencia de usos terciarios. " +
    "No imposibilita el proyecto, pero el ROI suele ser más predecible en municipios con padrón consolidado, " +
    "renta de locales más elástica y menor competencia directa por kilómetro cuadrado. " +
    "Te recomendamos lanzar un segundo estudio en uno de los destinos siguientes antes de firmar local en la capital.",
  alternatives: [
    {
      ineName: "Torrent",
      ineCode: "46244",
      population: 90_928,
      headline: "Gran dormitorio con consumo local fuerte",
      expectedEdge:
        "Masa crítica sin la misma saturación de low-cost premium que el centro de València; buen encaje para modelo membership + clases dirigidas.",
    },
    {
      ineName: "Paterna",
      ineCode: "46190",
      population: 76_019,
      headline: "Parque empresarial + población joven",
      expectedEdge:
        "Picos de tráfico en franja laboral y after-work; encaja gimnasio con horario extendido y corporate B2B.",
    },
    {
      ineName: "Gandia",
      ineCode: "46131",
      population: 83_135,
      headline: "Escala costera con estacionalidad controlable",
      expectedEdge:
        "Turismo y población fija permiten mix verano/invierno si segmentas producto; competencia más dispersa geográficamente.",
    },
    {
      ineName: "Mislata",
      ineCode: "46169",
      population: 47_079,
      headline: "Continuidad urbana con alquiler relativamente más ajustado",
      expectedEdge:
        "Captación del área metropolitana inmediata con menor ticket de entrada inmobiliaria que en núcleos céntricos.",
    },
    {
      ineName: "Burjassot",
      ineCode: "46078",
      population: 41_299,
      headline: "Universidad y tejido residencial compacto",
      expectedEdge:
        "Perfil 18–35 elevado; oportunidad en packs estudiante/off-peak si el producto lo permite.",
    },
    {
      ineName: "Sagunt/Sagunto",
      ineCode: "46220",
      population: 73_031,
      headline: "Corredor norte con crecimiento industrial y logístico",
      expectedEdge:
        "Menor densidad de cadenas premium; encaja box funcional o modelo 24/7 con costes contenidos.",
    },
  ],
};
