/** IDs de precio recurrente creados en Stripe (ver scripts/stripe-seed-products.mjs). */
export function stripePriceProMonthly(): string | undefined {
  return process.env.STRIPE_PRICE_PRO_MONTHLY?.trim() || undefined;
}

export function stripePriceEnterpriseMonthly(): string | undefined {
  return process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY?.trim() || undefined;
}

export function stripeSubscriptionsReady(): boolean {
  return Boolean(stripePriceProMonthly() && stripePriceEnterpriseMonthly());
}
