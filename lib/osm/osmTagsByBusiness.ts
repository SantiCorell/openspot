import type { BusinessType } from "@/lib/types/analysis";

/** Pares [clave OSM, valor] para Overpass (nodos). */
export type OsmTag = readonly [string, string];

/**
 * Mapeo vertical OpenSpot → etiquetas OSM más probables (nodos).
 * Cobertura incompleta por naturaleza de OSM; el recuento es orientativo.
 */
export const OSM_TAGS_BY_BUSINESS: Record<BusinessType, OsmTag[]> = {
  bar: [
    ["amenity", "bar"],
    ["amenity", "pub"],
  ],
  pub: [
    ["amenity", "pub"],
    ["amenity", "bar"],
  ],
  cafe: [["amenity", "cafe"]],
  restaurant: [
    ["amenity", "restaurant"],
    ["amenity", "fast_food"],
  ],
  fast_food: [["amenity", "fast_food"]],
  bakery: [["shop", "bakery"]],
  ice_cream: [
    ["amenity", "ice_cream"],
    ["shop", "ice_cream"],
  ],
  nightclub: [
    ["amenity", "nightclub"],
    ["amenity", "bar"],
  ],
  gym: [["leisure", "fitness_centre"]],
  yoga_pilates: [["leisure", "fitness_centre"]],
  crossfit_box: [["leisure", "fitness_centre"]],
  retail_fashion: [["shop", "clothes"]],
  retail_shoes: [["shop", "shoes"]],
  retail_electronics: [["shop", "electronics"]],
  supermarket: [["shop", "supermarket"]],
  convenience: [
    ["shop", "convenience"],
    ["shop", "general"],
  ],
  pharmacy: [["amenity", "pharmacy"]],
  optician: [["shop", "optician"]],
  perfumery: [["shop", "perfumery"]],
  gift_shop: [["shop", "gift"]],
  bookstore: [["shop", "books"]],
  pet_shop: [["shop", "pet"]],
  florist: [["shop", "florist"]],
  hardware: [["shop", "hardware"]],
  furniture: [["shop", "furniture"]],
  jewelry: [["shop", "jewelry"]],
  beauty_salon: [["shop", "beauty"]],
  barbershop: [["shop", "hairdresser"]],
  nail_salon: [["shop", "beauty"]],
  spa: [["leisure", "spa"]],
  tattoo: [["shop", "tattoo"]],
  dental_clinic: [["amenity", "dentist"]],
  physiotherapy: [["healthcare", "physiotherapist"]],
  veterinary: [["amenity", "veterinary"]],
  laundry: [["shop", "laundry"]],
  coworking: [["amenity", "coworking"]],
  real_estate: [["office", "estate_agent"]],
  travel_agency: [["shop", "travel_agency"]],
  academy_sport: [["leisure", "sports_centre"]],
  driving_school: [["amenity", "driving_school"]],
  nursery: [["amenity", "kindergarten"]],
  tutoring: [
    ["amenity", "language_school"],
    ["amenity", "prep_school"],
  ],
  hotel: [["tourism", "hotel"]],
  hostel: [
    ["tourism", "hostel"],
    ["tourism", "guest_house"],
  ],
  garage: [["shop", "car_repair"]],
  car_wash: [["amenity", "car_wash"]],
  gas_station: [["amenity", "fuel"]],
  photography: [["shop", "photo"]],
  newsagent: [["shop", "kiosk"]],
  phone_repair: [["shop", "mobile_phone"]],
};

export function osmTagsForBusiness(bt: BusinessType): OsmTag[] {
  return OSM_TAGS_BY_BUSINESS[bt] ?? [["amenity", "restaurant"]];
}
