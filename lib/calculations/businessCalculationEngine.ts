import type {
  BusinessType,
  CostBreakdown,
  RevenueEstimate,
  ZoneInsight,
} from "@/lib/types/analysis";

interface BusinessModelConfig {
  label: string;
  sqm: number;
  avgTicket: number;
  /** Coberturas diarias estimadas por unidad de densidad de zona (0–1) */
  dailyCoversPerDensityUnit: number;
  staffMonthlyBase: number;
  staffPerCompetitorSensitivity: number;
  licensesMonthly: number;
  defaultRentM2Fallback: number;
}

const ARCHETYPES = {
  hosteleria_rapida: {
    label: "Hostelería rápida / cafetería",
    sqm: 105,
    avgTicket: 13,
    dailyCoversPerDensityUnit: 88,
    staffMonthlyBase: 5_200,
    staffPerCompetitorSensitivity: 115,
    licensesMonthly: 420,
    defaultRentM2Fallback: 26,
  },
  restaurante: {
    label: "Restauración a la carta",
    sqm: 175,
    avgTicket: 28,
    dailyCoversPerDensityUnit: 48,
    staffMonthlyBase: 7_800,
    staffPerCompetitorSensitivity: 130,
    licensesMonthly: 520,
    defaultRentM2Fallback: 24,
  },
  ocio_nocturno: {
    label: "Ocio nocturno",
    sqm: 420,
    avgTicket: 18,
    dailyCoversPerDensityUnit: 42,
    staffMonthlyBase: 9_600,
    staffPerCompetitorSensitivity: 95,
    licensesMonthly: 890,
    defaultRentM2Fallback: 16,
  },
  gym: {
    label: "Gimnasio / box",
    sqm: 380,
    avgTicket: 42,
    dailyCoversPerDensityUnit: 28,
    staffMonthlyBase: 6_800,
    staffPerCompetitorSensitivity: 80,
    licensesMonthly: 620,
    defaultRentM2Fallback: 18,
  },
  boutique_fitness: {
    label: "Estudio fitness / yoga",
    sqm: 210,
    avgTicket: 19,
    dailyCoversPerDensityUnit: 35,
    staffMonthlyBase: 4_800,
    staffPerCompetitorSensitivity: 70,
    licensesMonthly: 380,
    defaultRentM2Fallback: 20,
  },
  academia_deporte: {
    label: "Academia deportiva",
    sqm: 320,
    avgTicket: 15,
    dailyCoversPerDensityUnit: 45,
    staffMonthlyBase: 5_600,
    staffPerCompetitorSensitivity: 75,
    licensesMonthly: 450,
    defaultRentM2Fallback: 17,
  },
  retail_medio: {
    label: "Comercio detalle",
    sqm: 125,
    avgTicket: 42,
    dailyCoversPerDensityUnit: 38,
    staffMonthlyBase: 4_200,
    staffPerCompetitorSensitivity: 90,
    licensesMonthly: 280,
    defaultRentM2Fallback: 22,
  },
  retail_grande: {
    label: "Comercio especializado / muebles",
    sqm: 220,
    avgTicket: 95,
    dailyCoversPerDensityUnit: 18,
    staffMonthlyBase: 5_400,
    staffPerCompetitorSensitivity: 85,
    licensesMonthly: 320,
    defaultRentM2Fallback: 15,
  },
  hiper: {
    label: "Supermercado",
    sqm: 480,
    avgTicket: 22,
    dailyCoversPerDensityUnit: 120,
    staffMonthlyBase: 12_000,
    staffPerCompetitorSensitivity: 40,
    licensesMonthly: 400,
    defaultRentM2Fallback: 12,
  },
  tienda_barrio: {
    label: "Tienda de proximidad",
    sqm: 75,
    avgTicket: 9,
    dailyCoversPerDensityUnit: 130,
    staffMonthlyBase: 3_200,
    staffPerCompetitorSensitivity: 100,
    licensesMonthly: 180,
    defaultRentM2Fallback: 24,
  },
  farmacia: {
    label: "Farmacia",
    sqm: 115,
    avgTicket: 17,
    dailyCoversPerDensityUnit: 72,
    staffMonthlyBase: 5_100,
    staffPerCompetitorSensitivity: 70,
    licensesMonthly: 260,
    defaultRentM2Fallback: 22,
  },
  belleza: {
    label: "Belleza / imagen",
    sqm: 95,
    avgTicket: 38,
    dailyCoversPerDensityUnit: 30,
    staffMonthlyBase: 4_500,
    staffPerCompetitorSensitivity: 95,
    licensesMonthly: 240,
    defaultRentM2Fallback: 21,
  },
  salud: {
    label: "Clínica / salud",
    sqm: 130,
    avgTicket: 65,
    dailyCoversPerDensityUnit: 20,
    staffMonthlyBase: 8_200,
    staffPerCompetitorSensitivity: 55,
    licensesMonthly: 480,
    defaultRentM2Fallback: 19,
  },
  vet: {
    label: "Veterinaria",
    sqm: 135,
    avgTicket: 48,
    dailyCoversPerDensityUnit: 24,
    staffMonthlyBase: 6_200,
    staffPerCompetitorSensitivity: 65,
    licensesMonthly: 350,
    defaultRentM2Fallback: 18,
  },
  servicios_personales: {
    label: "Servicios (lavandería, etc.)",
    sqm: 85,
    avgTicket: 18,
    dailyCoversPerDensityUnit: 45,
    staffMonthlyBase: 3_600,
    staffPerCompetitorSensitivity: 75,
    licensesMonthly: 200,
    defaultRentM2Fallback: 20,
  },
  coworking: {
    label: "Coworking",
    sqm: 520,
    avgTicket: 22,
    dailyCoversPerDensityUnit: 25,
    staffMonthlyBase: 9_500,
    staffPerCompetitorSensitivity: 60,
    licensesMonthly: 520,
    defaultRentM2Fallback: 14,
  },
  oficina_servicio: {
    label: "Servicios profesionales / agencia",
    sqm: 95,
    avgTicket: 45,
    dailyCoversPerDensityUnit: 12,
    staffMonthlyBase: 4_800,
    staffPerCompetitorSensitivity: 50,
    licensesMonthly: 220,
    defaultRentM2Fallback: 16,
  },
  formacion: {
    label: "Formación / autoescuela",
    sqm: 160,
    avgTicket: 35,
    dailyCoversPerDensityUnit: 28,
    staffMonthlyBase: 5_500,
    staffPerCompetitorSensitivity: 55,
    licensesMonthly: 380,
    defaultRentM2Fallback: 17,
  },
  infantil: {
    label: "Educación infantil",
    sqm: 280,
    avgTicket: 28,
    dailyCoversPerDensityUnit: 22,
    staffMonthlyBase: 8_900,
    staffPerCompetitorSensitivity: 50,
    licensesMonthly: 620,
    defaultRentM2Fallback: 13,
  },
  alojamiento: {
    label: "Alojamiento",
    sqm: 650,
    avgTicket: 75,
    dailyCoversPerDensityUnit: 15,
    staffMonthlyBase: 11_000,
    staffPerCompetitorSensitivity: 45,
    licensesMonthly: 720,
    defaultRentM2Fallback: 11,
  },
  motor: {
    label: "Motor / taller / estación",
    sqm: 400,
    avgTicket: 85,
    dailyCoversPerDensityUnit: 12,
    staffMonthlyBase: 7_200,
    staffPerCompetitorSensitivity: 45,
    licensesMonthly: 380,
    defaultRentM2Fallback: 9,
  },
  phone_repair: {
    label: "Reparación electrónica",
    sqm: 55,
    avgTicket: 45,
    dailyCoversPerDensityUnit: 28,
    staffMonthlyBase: 3_800,
    staffPerCompetitorSensitivity: 110,
    licensesMonthly: 160,
    defaultRentM2Fallback: 26,
  },
} as const satisfies Record<string, BusinessModelConfig>;

type ArchKey = keyof typeof ARCHETYPES;

const TYPE_ARCH: Record<BusinessType, ArchKey> = {
  bar: "hosteleria_rapida",
  pub: "hosteleria_rapida",
  cafe: "hosteleria_rapida",
  restaurant: "restaurante",
  fast_food: "hosteleria_rapida",
  bakery: "hosteleria_rapida",
  ice_cream: "hosteleria_rapida",
  nightclub: "ocio_nocturno",
  gym: "gym",
  yoga_pilates: "boutique_fitness",
  crossfit_box: "gym",
  retail_fashion: "retail_medio",
  retail_shoes: "retail_medio",
  retail_electronics: "retail_grande",
  supermarket: "hiper",
  convenience: "tienda_barrio",
  pharmacy: "farmacia",
  optician: "retail_medio",
  perfumery: "retail_medio",
  gift_shop: "retail_medio",
  bookstore: "retail_medio",
  pet_shop: "retail_medio",
  florist: "retail_medio",
  hardware: "retail_grande",
  furniture: "retail_grande",
  jewelry: "retail_grande",
  beauty_salon: "belleza",
  barbershop: "belleza",
  nail_salon: "belleza",
  spa: "belleza",
  tattoo: "belleza",
  dental_clinic: "salud",
  physiotherapy: "salud",
  veterinary: "vet",
  laundry: "servicios_personales",
  coworking: "coworking",
  real_estate: "oficina_servicio",
  travel_agency: "oficina_servicio",
  academy_sport: "academia_deporte",
  driving_school: "formacion",
  nursery: "infantil",
  tutoring: "formacion",
  hotel: "alojamiento",
  hostel: "alojamiento",
  garage: "motor",
  car_wash: "motor",
  gas_station: "motor",
  photography: "belleza",
  newsagent: "tienda_barrio",
  phone_repair: "phone_repair",
};

function modelFor(businessType: BusinessType): BusinessModelConfig {
  return ARCHETYPES[TYPE_ARCH[businessType]];
}

function estimateFootTrafficDaily(
  zone: ZoneInsight,
  footTrafficIndex: number,
): number {
  const density = zone.populationDensity ?? 0.75;
  return Math.round(400 + density * 2200 * footTrafficIndex);
}

export function estimateCosts(
  businessType: BusinessType,
  zone: ZoneInsight,
  rentPerM2: number,
  competitorCount: number,
): CostBreakdown {
  const m = modelFor(businessType);
  const rentMonthly = Math.round(rentPerM2 * m.sqm);
  const staffMonthly = Math.round(
    m.staffMonthlyBase +
      competitorCount * m.staffPerCompetitorSensitivity * 0.15,
  );
  const licensesMonthly = m.licensesMonthly;
  return {
    rentMonthly,
    staffMonthly,
    licensesMonthly,
    totalMonthly: rentMonthly + staffMonthly + licensesMonthly,
  };
}

export function estimateRevenue(
  businessType: BusinessType,
  zone: ZoneInsight,
  competitorCount: number,
  footTrafficIndex: number,
): RevenueEstimate {
  const m = modelFor(businessType);
  const foot = estimateFootTrafficDaily(zone, footTrafficIndex);
  const competitionPenalty = Math.min(0.45, competitorCount * 0.012);
  const captureRate = Math.max(0.08, 0.22 - competitionPenalty);
  const dailyRevenue = foot * captureRate * m.avgTicket;
  const monthlyMid = Math.round(dailyRevenue * 30);
  const monthlyLow = Math.round(monthlyMid * 0.72);
  const monthlyHigh = Math.round(monthlyMid * 1.28);

  return {
    monthlyLow,
    monthlyMid,
    monthlyHigh,
    assumptions: [
      `Tráfico pie estimado: ~${foot} visitas/día en la zona.`,
      `Ticket medio modelo: ${m.avgTicket} €.`,
      `Penalización por competencia (${competitorCount} competidores cercanos).`,
    ],
  };
}

export function resolveRentPerM2(
  zone: ZoneInsight,
  mergedMarketM2?: number,
): number {
  const candidates = [zone.rentPerM2, mergedMarketM2].filter(
    (n): n is number => typeof n === "number" && !Number.isNaN(n),
  );
  if (candidates.length === 0) {
    return ARCHETYPES.hosteleria_rapida.defaultRentM2Fallback;
  }
  return (
    Math.round((candidates.reduce((a, b) => a + b, 0) / candidates.length) * 10) /
    10
  );
}
