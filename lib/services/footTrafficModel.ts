import type {
  BusinessType,
  FootTrafficHeatmap,
  ScoredZone,
} from "@/lib/types/analysis";
import { WEEKDAY_LABELS_ES_SHORT } from "@/lib/types/analysis";

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const LATE_VERTICALS: ReadonlySet<BusinessType> = new Set([
  "bar",
  "pub",
  "restaurant",
  "fast_food",
  "nightclub",
  "ice_cream",
]);

const GYM_VERTICALS: ReadonlySet<BusinessType> = new Set([
  "gym",
  "yoga_pilates",
  "crossfit_box",
  "academy_sport",
]);

/** Multiplicadores relativos 0–23h para un día laborable vs fin de semana. */
function hourShape(
  businessType: BusinessType,
  dayIndex: number,
): number[] {
  const weekend = dayIndex >= 5;
  const late = LATE_VERTICALS.has(businessType);
  const gym = GYM_VERTICALS.has(businessType);

  return Array.from({ length: 24 }, (_, h) => {
    if (gym) {
      if (!weekend) {
        if (h >= 6 && h < 9) return 0.75 + h * 0.04;
        if (h >= 9 && h < 12) return 0.55;
        if (h >= 12 && h < 15) return 0.72;
        if (h >= 15 && h < 17) return 0.45;
        if (h >= 17 && h < 21) return 1.15;
        if (h >= 21 && h < 23) return 0.62;
        return 0.25;
      }
      if (h >= 9 && h < 14) return 1.05;
      if (h >= 17 && h < 21) return 0.95;
      if (h >= 10 && h < 12) return 0.5;
      return 0.35;
    }

    if (late) {
      if (!weekend) {
        if (h >= 8 && h < 12) return 0.55;
        if (h >= 12 && h < 16) return 0.72;
        if (h >= 16 && h < 19) return 0.88;
        if (h >= 19 && h < 24) return 1.18;
        if (h >= 0 && h < 3) return 0.65;
        return 0.28;
      }
      if (h >= 11 && h < 17) return 1.05;
      if (h >= 19 && h < 24) return 1.22;
      if (h >= 0 && h < 3) return 0.82;
      return 0.42;
    }

    if (!weekend) {
      if (h >= 8 && h < 11) return 0.92;
      if (h >= 11 && h < 14) return 1.05;
      if (h >= 14 && h < 17) return 0.78;
      if (h >= 17 && h < 20) return 1.12;
      if (h >= 20 && h < 22) return 0.68;
      return 0.32;
    }
    if (h >= 10 && h < 14) return 1.08;
    if (h >= 17 && h < 21) return 0.98;
    return 0.48;
  });
}

export function buildFootTrafficHeatmap(
  zone: Pick<
    ScoredZone,
    "id" | "name" | "populationDensity" | "medianIncomeIndex"
  >,
  businessType: BusinessType,
  cityPopulation: number,
): FootTrafficHeatmap {
  const seed = hashString(`${zone.id}|${businessType}`);
  const dens = zone.populationDensity ?? 0.65;
  const inc = zone.medianIncomeIndex ?? 0.65;
  const popK = Math.min(1200, Math.max(120, Math.sqrt(cityPopulation + 1) * 1.4));

  const baseHourly = Math.round(
    35 + dens * popK * 0.45 + inc * 95 + (seed % 55),
  );

  const cells: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const shape = hourShape(businessType, d);
    const row: number[] = [];
    for (let h = 0; h < 24; h++) {
      const jitter = 0.88 + ((seed + d * 17 + h * 3) % 25) / 100;
      row.push(Math.max(8, Math.round(baseHourly * shape[h] * jitter)));
    }
    cells.push(row);
  }

  let maxCell = 0;
  for (const r of cells) for (const v of r) if (v > maxCell) maxCell = v;

  const weekdayCells = cells.slice(0, 5).flat();
  const weekdayAvgPerHour = Math.round(
    weekdayCells.reduce((a, b) => a + b, 0) / weekdayCells.length,
  );

  const satCells = cells[5] ?? [];
  const sunCells = cells[6] ?? [];
  const saturdayAvgPerHour = Math.round(
    satCells.reduce((a, b) => a + b, 0) / Math.max(1, satCells.length),
  );
  const sundayAvgPerHour = Math.round(
    sunCells.reduce((a, b) => a + b, 0) / Math.max(1, sunCells.length),
  );

  let peak = 0;
  let peakD = 0;
  let peakH = 0;
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const v = cells[d][h];
      if (v > peak) {
        peak = v;
        peakD = d;
        peakH = h;
      }
    }
  }

  const peakWindowLabel = `${WEEKDAY_LABELS_ES_SHORT[peakD]} ${String(peakH).padStart(2, "0")}:00–${String(Math.min(23, peakH + 1)).padStart(2, "0")}:00`;

  const narrative = buildNarrative({
    zoneName: zone.name,
    weekdayAvgPerHour,
    saturdayAvgPerHour,
    sundayAvgPerHour,
    peakWindowLabel,
    businessType,
  });

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    businessType,
    cells,
    maxCell,
    weekdayAvgPerHour,
    saturdayAvgPerHour,
    sundayAvgPerHour,
    peakWindowLabel,
    narrative,
  };
}

function buildNarrative(args: {
  zoneName: string;
  weekdayAvgPerHour: number;
  saturdayAvgPerHour: number;
  sundayAvgPerHour: number;
  peakWindowLabel: string;
  businessType: BusinessType;
}): string {
  const { zoneName, weekdayAvgPerHour, saturdayAvgPerHour, sundayAvgPerHour, peakWindowLabel } =
    args;
  return (
    `Zona «${zoneName}»: de lunes a viernes el modelo estima un tráfico peatonal medio de ` +
    `${weekdayAvgPerHour.toLocaleString("es-ES")} personas/h en ventana 0:00–23:00 (promedio de todas las franjas laborables). ` +
    `El sábado la media sube a ${saturdayAvgPerHour.toLocaleString("es-ES")} pers./h y el domingo a ${sundayAvgPerHour.toLocaleString("es-ES")} pers./h, ` +
    `coherente con el patrón del sector en el calendario español. ` +
    `Pico modelado: ${peakWindowLabel}. Úsalo para decidir franjas de staff y apertura; valida con conteo manual en tu calle.`
  );
}
