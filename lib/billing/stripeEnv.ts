import type { PlanTier } from "@prisma/client";

/** IDs de precio recurrente creados en Stripe (ver scripts/stripe-seed-products.mjs). */
export function stripePriceProMonthly(): string | undefined {
  return process.env.STRIPE_PRICE_PRO_MONTHLY?.trim() || undefined;
}

export function stripePriceEnterpriseMonthly(): string | undefined {
  return process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY?.trim() || undefined;
}

/** Precios de catálogo: estudio / informe extra (pago único), según plan del usuario al pagar. */
export function stripePriceExtraSearchForTier(tier: PlanTier): string | undefined {
  if (tier === "free") {
    return process.env.STRIPE_PRICE_EXTRA_SEARCH_FREE?.trim() || undefined;
  }
  if (tier === "pro") {
    return process.env.STRIPE_PRICE_EXTRA_SEARCH_PRO?.trim() || undefined;
  }
  return process.env.STRIPE_PRICE_EXTRA_SEARCH_ENTERPRISE?.trim() || undefined;
}

/** Precios de catálogo: comparación multi-zona extra (pago único). */
export function stripePriceExtraComparisonForTier(tier: PlanTier): string | undefined {
  if (tier === "free") {
    return process.env.STRIPE_PRICE_EXTRA_COMPARISON_FREE?.trim() || undefined;
  }
  if (tier === "pro") {
    return process.env.STRIPE_PRICE_EXTRA_COMPARISON_PRO?.trim() || undefined;
  }
  return process.env.STRIPE_PRICE_EXTRA_COMPARISON_ENTERPRISE?.trim() || undefined;
}

export function stripeSubscriptionsReady(): boolean {
  return Boolean(stripePriceProMonthly() && stripePriceEnterpriseMonthly());
}
