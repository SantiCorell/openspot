import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();

/**
 * Cliente Stripe singleton. Requiere STRIPE_SECRET_KEY no vacía en runtime.
 * (Evita instanciar Stripe en build con cadena vacía.)
 */
export const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    })
  : null;
