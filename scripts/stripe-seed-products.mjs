/**
 * Crea o reutiliza productos y precios recurrentes en Stripe (Pro 49 €/mes, Enterprise 150 €/mes).
 * Idempotente: si ya existen productos con metadata app=openspot y plan=pro|enterprise, reutiliza y solo crea precios mensuales faltantes.
 * Ejecutar: npm run stripe:seed
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

async function findProductByPlan(plan) {
  let startingAfter;
  for (;;) {
    const page = await stripe.products.list({
      active: true,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    for (const p of page.data) {
      if (p.metadata?.app === "openspot" && p.metadata?.plan === plan) {
        return p;
      }
    }
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) break;
  }
  return null;
}

async function findMonthlyEurPrice(productId, unitAmount) {
  let startingAfter;
  for (;;) {
    const page = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    for (const pr of page.data) {
      if (
        pr.currency === "eur" &&
        pr.unit_amount === unitAmount &&
        pr.recurring?.interval === "month"
      ) {
        return pr;
      }
    }
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) break;
  }
  return null;
}

async function ensureProduct({ name, description, plan }) {
  let product = await findProductByPlan(plan);
  if (!product) {
    product = await stripe.products.create({
      name,
      description,
      metadata: { app: "openspot", plan },
    });
    console.log(`Producto creado: ${name} (${product.id})`);
  } else {
    console.log(`Producto existente: ${name} (${product.id})`);
  }
  return product;
}

async function ensureMonthlyPrice(product, unitAmount, planTier) {
  let price = await findMonthlyEurPrice(product.id, unitAmount);
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount,
      currency: "eur",
      recurring: { interval: "month" },
      metadata: { planTier },
    });
    console.log(`  Precio mensual creado: ${price.id} (${unitAmount / 100} €)`);
  } else {
    console.log(`  Precio mensual existente: ${price.id} (${unitAmount / 100} €)`);
  }
  return price;
}

async function main() {
  const proProduct = await ensureProduct({
    name: "OpenSpot Pro",
    description:
      "Suscripción mensual Pro: búsquedas y comparaciones según plan.",
    plan: "pro",
  });
  const proPrice = await ensureMonthlyPrice(proProduct, 4900, "pro");

  const entProduct = await ensureProduct({
    name: "OpenSpot Enterprise",
    description:
      "Suscripción mensual Enterprise: alto volumen de estudios y comparaciones.",
    plan: "enterprise",
  });
  const entPrice = await ensureMonthlyPrice(entProduct, 15000, "enterprise");

  console.log("\nVariables para .env y Vercel/hosting:\n");
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${proPrice.id}`);
  console.log(`STRIPE_PRICE_ENTERPRISE_MONTHLY=${entPrice.id}`);
  console.log(
    "\nClaves públicas (Dashboard → Developers → API keys): copia la Publishable key a NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
  );
  console.log(
    "\nWebhook: https://TU_DOMINIO/api/webhooks/stripe — eventos checkout.session.completed, customer.subscription.*",
  );
  console.log(
    "\nCustomer portal: Stripe Dashboard → Billing → Customer portal (URL de retorno a facturación).\n",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
