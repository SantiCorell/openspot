/**
 * Superficie aproximada (km²) para densidad de referencia en landing.
 * Población siempre desde INE en runtime; áreas fijas de dominio público típico.
 */
export const SHOWDOWN_AREA_KM2: Record<string, number> = {
  València: 134.6,
  "Alacant/Alicante": 201.3,
  "Elx/Elche": 326.1,
  "Castelló de la Plana/Castellón de la Plana": 57.9,
  Benidorm: 38.5,
  Torrevieja: 15.0,
};

/** Orden de lectura en la narrativa (grandes + perfiles distintos). */
export const SHOWDOWN_INE_NAMES = [
  "València",
  "Alacant/Alicante",
  "Elx/Elche",
  "Castelló de la Plana/Castellón de la Plana",
  "Benidorm",
  "Torrevieja",
] as const;

export type ShowdownIneName = (typeof SHOWDOWN_INE_NAMES)[number];

export const SHOWDOWN_SHORT_LABEL: Record<ShowdownIneName, string> = {
  València: "València",
  "Alacant/Alicante": "Alacant",
  "Elx/Elche": "Elx",
  "Castelló de la Plana/Castellón de la Plana": "Castelló",
  Benidorm: "Benidorm",
  Torrevieja: "Torrevieja",
};

/** Ángulo comercial fijo para copy (no implica datos económicos reales). */
export const SHOWDOWN_ANGLE: Record<ShowdownIneName, string> = {
  València:
    "Máxima masa crítica: más vecinos y viajeros dentro de radio útil para un mismo local.",
  "Alacant/Alicante":
    "Segundo polo: costa + administración; muy competido en hostelería frente al mar.",
  "Elx/Elche":
    "Interior densificado: menos presión turística que la costa, más parcela y logística.",
  "Castelló de la Plana/Castellón de la Plana":
    "Capital provincial compacta: alta densidad en poco radio — ideal para retail de proximidad.",
  Benidorm:
    "Icono turístico: estacionalidad extrema; ticket medio alto en temporada.",
  Torrevieja:
    "Residencial costero muy concentrado: pocos km², mucha demanda estacional y extranjero.",
};
