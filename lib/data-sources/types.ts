/** Salida normalizada común para todas las fuentes externas */

export interface NormalizedIneBlock {
  source: "ine";
  city: string;
  population?: number;
  incomeIndex?: number;
  densityIndex?: number;
  year?: number;
  raw?: Record<string, unknown>;
}

export interface NormalizedPlacesBlock {
  source: "google_maps";
  city: string;
  competitorCountByZone: Record<string, number>;
  footTrafficIndex?: number;
  raw?: Record<string, unknown>;
}

export interface NormalizedRentBlock {
  source: "idealista" | "fotocasa";
  city: string;
  rentPerM2ByZone: Record<string, number>;
  currency: "EUR";
  raw?: Record<string, unknown>;
}

export interface NormalizedWallapopBlock {
  source: "wallapop";
  city: string;
  secondaryDemandIndex?: number;
  listingsSample?: number;
  raw?: Record<string, unknown>;
}

export type NormalizedDataBlock =
  | NormalizedIneBlock
  | NormalizedPlacesBlock
  | NormalizedRentBlock
  | NormalizedWallapopBlock;
