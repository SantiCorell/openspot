/**
 * Tramos de edad como proporción de referencia (España, padrón reciente).
 * Se escala al total municipal INE para visualización comparativa.
 * No sustituye tabulado municipal por edad del INE cuando se incorpore vía API.
 */
const SHARES = {
  "0-14": 0.14,
  "15-29": 0.15,
  "30-44": 0.19,
  "45-64": 0.27,
  "65+": 0.25,
} as const;

export type AgeTramo = keyof typeof SHARES;

export function modelAgePyramid(totalPopulation: number): Record<AgeTramo, number> {
  const out = {} as Record<AgeTramo, number>;
  (Object.keys(SHARES) as AgeTramo[]).forEach((k) => {
    out[k] = Math.round(totalPopulation * SHARES[k]);
  });
  return out;
}
