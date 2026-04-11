import type { BusinessType, IdealistaStyleListing, ScoredZone } from "@/lib/types/analysis";

type ListingKind =
  | "hospitality"
  | "retail"
  | "fitness"
  | "services"
  | "health"
  | "beauty"
  | "motor"
  | "hotel"
  | "cowork";

const HOSPITALITY = new Set<BusinessType>([
  "bar",
  "pub",
  "cafe",
  "restaurant",
  "fast_food",
  "bakery",
  "ice_cream",
  "nightclub",
]);
const FITNESS = new Set<BusinessType>([
  "gym",
  "yoga_pilates",
  "crossfit_box",
  "academy_sport",
]);
const RETAIL = new Set<BusinessType>([
  "retail_fashion",
  "retail_shoes",
  "retail_electronics",
  "supermarket",
  "convenience",
  "pharmacy",
  "optician",
  "perfumery",
  "gift_shop",
  "bookstore",
  "pet_shop",
  "florist",
  "hardware",
  "furniture",
  "jewelry",
  "newsagent",
  "phone_repair",
]);
const HEALTH = new Set<BusinessType>([
  "dental_clinic",
  "physiotherapy",
  "veterinary",
]);
const BEAUTY = new Set<BusinessType>([
  "beauty_salon",
  "barbershop",
  "nail_salon",
  "spa",
  "tattoo",
  "photography",
]);
const MOTOR = new Set<BusinessType>(["garage", "car_wash", "gas_station"]);
const HOTEL = new Set<BusinessType>(["hotel", "hostel"]);
const COWORK = new Set<BusinessType>(["coworking"]);

function listingKindFor(businessType: BusinessType): ListingKind {
  if (HOSPITALITY.has(businessType)) return "hospitality";
  if (FITNESS.has(businessType)) return "fitness";
  if (RETAIL.has(businessType)) return "retail";
  if (HEALTH.has(businessType)) return "health";
  if (BEAUTY.has(businessType)) return "beauty";
  if (MOTOR.has(businessType)) return "motor";
  if (HOTEL.has(businessType)) return "hotel";
  if (COWORK.has(businessType)) return "cowork";
  return "services";
}

function baseM2(kind: ListingKind, zoneRent: number): number {
  const r = zoneRent;
  switch (kind) {
    case "hospitality":
      return 95 + Math.round(r * 0.4);
    case "fitness":
      return 300 + Math.round(r * 0.35);
    case "retail":
      return 110 + Math.round(r * 0.45);
    case "health":
      return 120 + Math.round(r * 0.3);
    case "beauty":
      return 88 + Math.round(r * 0.35);
    case "motor":
      return 280 + Math.round(r * 0.25);
    case "hotel":
      return 420 + Math.round(r * 0.5);
    case "cowork":
      return 380 + Math.round(r * 0.3);
    default:
      return 90 + Math.round(r * 0.35);
  }
}

function pairTitles(
  kind: ListingKind,
  zoneName: string,
): [string, string] {
  switch (kind) {
    case "hospitality":
      return [
        `Local comercial · escaparate · ${zoneName}`,
        `Traspaso / equipamiento hostelería · ${zoneName}`,
      ];
    case "fitness":
      return [
        `Sala / nave acondicionable fitness · ${zoneName}`,
        `Local planta baja · acceso amplio · ${zoneName}`,
      ];
    case "retail":
      return [
        `Local comercial en calle · ${zoneName}`,
        `Esquina / alto tránsito · ${zoneName}`,
      ];
    case "health":
      return [
        `Local clínica / consultas · ${zoneName}`,
        `Planta baja accesible · ${zoneName}`,
      ];
    case "beauty":
      return [
        `Local peluquería / estética · ${zoneName}`,
        `Escaparate comercial · ${zoneName}`,
      ];
    case "motor":
      return [
        `Nave / parcela servicios · ${zoneName}`,
        `Taller / box mecánico · ${zoneName}`,
      ];
    case "hotel":
      return [
        `Edificio / uso hotelero · ${zoneName}`,
        `Inmueble reformable alojamiento · ${zoneName}`,
      ];
    case "cowork":
      return [
        `Planta oficinas / coworking · ${zoneName}`,
        `Espacio diáfano techos altos · ${zoneName}`,
      ];
    default:
      return [
        `Oficina / local servicios · ${zoneName}`,
        `Planta baja a pie de calle · ${zoneName}`,
      ];
  }
}

/**
 * Ejemplos orientativos de locales (estructura tipo portal inmobiliario).
 * No sustituye feed legal de Idealista; sirve para UX y valor percibido.
 */
export function buildIdealistaStyleSamples(
  _city: string,
  businessType: BusinessType,
  zones: ScoredZone[],
): IdealistaStyleListing[] {
  const top = zones.slice(0, 3);
  const kind = listingKindFor(businessType);
  return top.flatMap((z, i) => {
    const rentFallback = z.rentPerM2 ?? 24;
    const m2 = baseM2(kind, rentFallback) + i * 22;
    const rentMonthly = Math.round(
      m2 * rentFallback * (0.92 + i * 0.02),
    );
    const [t1, t2] = pairTitles(kind, z.name);
    return [
      {
        title: t1,
        m2,
        rentMonthly,
        zoneLabel: z.name,
        sourceNote:
          "Ejemplo agregado OpenSpot (no es listado real). Conectará con agregación Idealista/Fotocasa.",
      },
      {
        title: t2,
        m2: m2 + 40,
        rentMonthly: rentMonthly + Math.round(rentMonthly * 0.12),
        zoneLabel: z.name,
        sourceNote:
          "Referencia de mercado sintética para priorizar visitas comerciales.",
      },
    ];
  });
}
