import type { PlanTier } from "@prisma/client";

import { PLAN_COPY } from "@/lib/billing/plans";

function tierKey(tier: PlanTier): "free" | "pro" | "enterprise" {
  if (tier === "pro") return "pro";
  if (tier === "enterprise") return "enterprise";
  return "free";
}

/** Importe en céntimos (EUR) para una búsqueda extra según plan. */
export function extraSearchUnitAmountCents(tier: PlanTier): number {
  const eur =
    tierKey(tier) === "free"
      ? PLAN_COPY.free.extraSearchEur
      : tierKey(tier) === "pro"
        ? PLAN_COPY.pro.extraSearchEur
        : PLAN_COPY.enterprise.extraSearchEur;
  return Math.round(eur * 100);
}

/** Importe en céntimos (EUR) para una comparación extra según plan. */
export function extraComparisonUnitAmountCents(tier: PlanTier): number {
  const eur =
    tierKey(tier) === "free"
      ? PLAN_COPY.free.extraComparisonEur
      : tierKey(tier) === "pro"
        ? PLAN_COPY.pro.extraComparisonEur
        : PLAN_COPY.enterprise.extraComparisonEur;
  return Math.round(eur * 100);
}
