import type { PlanTier } from "@prisma/client";

export const PLAN_COPY = {
  free: {
    label: "Free",
    includedSearches: 3,
    lifetime: true as const,
    extraSearchEur: 50,
    includedComparisonsLifetime: 3,
    extraComparisonEur: 18,
    blurb:
      "3 búsquedas de análisis de ubicación y 3 comparaciones multi-zona (total). Búsqueda extra: 50 €. Comparación extra: 18 €.",
  },
  pro: {
    label: "Pro",
    includedSearchesPerMonth: 2,
    extraSearchEur: 30,
    includedComparisonsPerMonth: 10,
    extraComparisonEur: 12,
    blurb:
      "2 búsquedas mensuales y 10 comparaciones multi-zona / mes. Búsqueda extra: 30 €. Comparación extra: 12 €.",
  },
  enterprise: {
    label: "Enterprise",
    includedSearchesPerMonth: 25,
    extraSearchEur: 10,
    monthlyEur: 150,
    includedComparisonsPerMonth: 50,
    extraComparisonEur: 6,
    blurb:
      "150 €/mes. Hasta 25 búsquedas y 50 comparaciones multi-zona al mes. Búsqueda extra: 10 €. Comparación extra: 6 €.",
  },
} as const;

export function includedMonthlyForTier(tier: PlanTier): number {
  if (tier === "pro") return PLAN_COPY.pro.includedSearchesPerMonth;
  if (tier === "enterprise") return PLAN_COPY.enterprise.includedSearchesPerMonth;
  return 0;
}

/** Cupo mensual de comparaciones (Pro/Enterprise). Free usa cupo vitalicio aparte. */
export function includedComparisonsMonthlyForTier(tier: PlanTier): number {
  if (tier === "pro") return PLAN_COPY.pro.includedComparisonsPerMonth;
  if (tier === "enterprise") return PLAN_COPY.enterprise.includedComparisonsPerMonth;
  return 0;
}
