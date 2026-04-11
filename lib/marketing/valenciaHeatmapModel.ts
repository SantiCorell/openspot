/**
 * Distritos de València ciudad: coordenadas WGS84 aproximadas (centroides orientativos)
 * + intensidad v ∈ [0,1] del modelo producto (no es dato catastral).
 */
export const VALENCIA_DISTRICTS = [
  {
    id: "ciutat-vella",
    label: "Ciutat Vella",
    v: 0.94,
    lat: 39.4768,
    lng: -0.3795,
    blurb: "Núcleo histórico: turismo + hostelería de alta rotación.",
  },
  {
    id: "eixample",
    label: "l'Eixample",
    v: 0.89,
    lat: 39.4678,
    lng: -0.3705,
    blurb: "Eje comercial y residencial; ticket medio alto en restauración.",
  },
  {
    id: "ruzafa",
    label: "Russafa",
    v: 0.86,
    lat: 39.4608,
    lng: -0.3758,
    blurb: "Zona trendy; competencia fuerte pero afluencia sostenida.",
  },
  {
    id: "benimaclet",
    label: "Benimaclet",
    v: 0.68,
    lat: 39.4865,
    lng: -0.3605,
    blurb: "Barrio universitario; picos en franja tarde/noche.",
  },
  {
    id: "poblats-maritims",
    label: "Poblats Marítims",
    v: 0.76,
    lat: 39.4648,
    lng: -0.328,
    blurb: "Costa y ocio; estacionalidad marina a considerar.",
  },
  {
    id: "campanar",
    label: "Campanar",
    v: 0.56,
    lat: 39.4825,
    lng: -0.396,
    blurb: "Más residencial; oportunidad en servicios de proximidad.",
  },
  {
    id: "algiros",
    label: "Algirós",
    v: 0.61,
    lat: 39.479,
    lng: -0.351,
    blurb: "Campus y vivienda; flujo estable entre semana.",
  },
  {
    id: "quatre-carreres",
    label: "Quatre Carreres",
    v: 0.66,
    lat: 39.451,
    lng: -0.365,
    blurb: "Ciudad de las Artes; eventos y visitantes puntuales.",
  },
  {
    id: "olivereta",
    label: "L'Olivereta",
    v: 0.58,
    lat: 39.475,
    lng: -0.394,
    blurb: "Precio de local más asumible; densidad vecinal sólida.",
  },
] as const;

export type ValenciaDistrict = (typeof VALENCIA_DISTRICTS)[number];

export const VALENCIA_MAP_CENTER = { lat: 39.4699, lng: -0.3763 };

/** Color según intensidad (indigo → índigo profundo), hex para Google Maps. */
export function districtHeatColor(v: number): string {
  const t = Math.min(1, Math.max(0, v));
  const r = Math.round(199 + (79 - 199) * t);
  const g = Math.round(210 + (70 - 210) * t);
  const b = Math.round(254 + (229 - 254) * t);
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}
