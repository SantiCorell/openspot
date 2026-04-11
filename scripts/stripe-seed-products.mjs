/**
 * Crea productos y precios recurrentes en Stripe (Pro 49 €/mes, Enterprise 150 €/mes).
 * Ejecutar: node scripts/stripe-seed-products.mjs
 * Requiere STRIPE_SECRET_KEY en .env (no subas la clave a git).
 */
import "dotenv/config";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY?.trim();
if (!key) {
  console.error("Define STRIPE_SECRET_KEY en .env");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });

async function main() {
  const proProduct = await stripe.products.create({
    name: "OpenSpot Pro",
    description: "Suscripción mensual Pro: búsquedas y comparaciones según plan.",
    metadata: { app: "openspot", plan: "pro" },
  });
  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 4900,
    currency: "eur",
    recurring: { interval: "month" },
    metadata: { planTier: "pro" },
  });

  const entProduct = await stripe.products.create({
    name: "OpenSpot Enterprise",
    description: "Suscripción mensual Enterprise: alto volumen de estudios y comparaciones.",
    metadata: { app: "openspot", plan: "enterprise" },
  });
  const entPrice = await stripe.prices.create({
    product: entProduct.id,
    unit_amount: 15000,
    currency: "eur",
    recurring: { interval: "month" },
    metadata: { planTier: "enterprise" },
  });

  console.log("\nAñade estas variables a tu .env y a Vercel/hosting:\n");
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${proPrice.id}`);
  console.log(`STRIPE_PRICE_ENTERPRISE_MONTHLY=${entPrice.id}`);
  console.log(
    "\nConfigura el webhook en Stripe apuntando a: https://TU_DOMINIO/api/webhooks/stripe",
  );
  console.log(
    "Eventos: checkout.session.completed, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted",
  );
  console.log(
    "\nActiva el Customer portal en Stripe Dashboard → Billing → Customer portal (return URL facturación).\n",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
