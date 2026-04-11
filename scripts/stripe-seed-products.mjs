/**
 * Crea o reutiliza en Stripe:
 * - Suscripciones: OpenSpot Pro (49 €/mes), Enterprise (150 €/mes).
 * - Pago único (catálogo): estudio/informe extra y comparación extra, con tarifa según plan (Free / Pro / Enterprise).
 *
 * Idempotente: metadata app=openspot en productos.
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

/** Céntimos EUR — debe coincidir con lib/billing/plans.ts (PLAN_COPY.*.extraSearchEur / extraComparisonEur). */
const EXTRA_SEARCH_CENTS = { free: 5000, pro: 3000, enterprise: 1000 };
const EXTRA_COMPARISON_CENTS = { free: 1800, pro: 1200, enterprise: 600 };

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

async function findOneTimeEurPrice(productId, unitAmount, planTier) {
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
        pr.recurring == null &&
        pr.metadata?.planTier === planTier
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

async function ensureSubscriptionProduct({ name, description, plan }) {
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

async function ensureExtraProduct({ name, description, plan }) {
  let product = await findProductByPlan(plan);
  if (!product) {
    product = await stripe.products.create({
      name,
      description,
      metadata: { app: "openspot", plan },
    });
    console.log(`Producto catálogo creado: ${name} (${product.id})`);
  } else {
    console.log(`Producto catálogo existente: ${name} (${product.id})`);
  }
  return product;
}

async function ensureOneTimeTierPrice(product, unitAmount, planTier, nickname) {
  let price = await findOneTimeEurPrice(product.id, unitAmount, planTier);
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: unitAmount,
      currency: "eur",
      nickname,
      metadata: { planTier, app: "openspot" },
    });
    console.log(`  Precio único creado: ${price.id} (${nickname})`);
  } else {
    console.log(`  Precio único existente: ${price.id} (${nickname})`);
  }
  return price;
}

async function main() {
  const proProduct = await ensureSubscriptionProduct({
    name: "OpenSpot Pro",
    description:
      "Suscripción mensual Pro: búsquedas y comparaciones según plan.",
    plan: "pro",
  });
  const proPrice = await ensureMonthlyPrice(proProduct, 4900, "pro");

  const entProduct = await ensureSubscriptionProduct({
    name: "OpenSpot Enterprise",
    description:
      "Suscripción mensual Enterprise: alto volumen de estudios y comparaciones.",
    plan: "enterprise",
  });
  const entPrice = await ensureMonthlyPrice(entProduct, 15000, "enterprise");

  const searchProduct = await ensureExtraProduct({
    name: "OpenSpot — Estudio extra (informe completo)",
    description:
      "Un crédito de análisis de ubicación con informe completo. El precio unitario depende del plan contratado (Free, Pro o Enterprise) al momento del pago.",
    plan: "extra_search",
  });

  const pSearchFree = await ensureOneTimeTierPrice(
    searchProduct,
    EXTRA_SEARCH_CENTS.free,
    "free",
    `Plan Free — ${EXTRA_SEARCH_CENTS.free / 100} € / estudio`,
  );
  const pSearchPro = await ensureOneTimeTierPrice(
    searchProduct,
    EXTRA_SEARCH_CENTS.pro,
    "pro",
    `Plan Pro — ${EXTRA_SEARCH_CENTS.pro / 100} € / estudio`,
  );
  const pSearchEnt = await ensureOneTimeTierPrice(
    searchProduct,
    EXTRA_SEARCH_CENTS.enterprise,
    "enterprise",
    `Plan Enterprise — ${EXTRA_SEARCH_CENTS.enterprise / 100} € / estudio`,
  );

  const compProduct = await ensureExtraProduct({
    name: "OpenSpot — Comparación multi-zona extra",
    description:
      "Una ejecución del comparador de municipios. El precio unitario depende del plan (Free, Pro o Enterprise) al pagar.",
    plan: "extra_comparison",
  });

  const pCompFree = await ensureOneTimeTierPrice(
    compProduct,
    EXTRA_COMPARISON_CENTS.free,
    "free",
    `Plan Free — ${EXTRA_COMPARISON_CENTS.free / 100} € / comparación`,
  );
  const pCompPro = await ensureOneTimeTierPrice(
    compProduct,
    EXTRA_COMPARISON_CENTS.pro,
    "pro",
    `Plan Pro — ${EXTRA_COMPARISON_CENTS.pro / 100} € / comparación`,
  );
  const pCompEnt = await ensureOneTimeTierPrice(
    compProduct,
    EXTRA_COMPARISON_CENTS.enterprise,
    "enterprise",
    `Plan Enterprise — ${EXTRA_COMPARISON_CENTS.enterprise / 100} € / comparación`,
  );

  console.log("\n--- Variables para .env y Vercel ---\n");
  console.log(`STRIPE_PRICE_PRO_MONTHLY=${proPrice.id}`);
  console.log(`STRIPE_PRICE_ENTERPRISE_MONTHLY=${entPrice.id}`);
  console.log(`STRIPE_PRICE_EXTRA_SEARCH_FREE=${pSearchFree.id}`);
  console.log(`STRIPE_PRICE_EXTRA_SEARCH_PRO=${pSearchPro.id}`);
  console.log(`STRIPE_PRICE_EXTRA_SEARCH_ENTERPRISE=${pSearchEnt.id}`);
  console.log(`STRIPE_PRICE_EXTRA_COMPARISON_FREE=${pCompFree.id}`);
  console.log(`STRIPE_PRICE_EXTRA_COMPARISON_PRO=${pCompPro.id}`);
  console.log(`STRIPE_PRICE_EXTRA_COMPARISON_ENTERPRISE=${pCompEnt.id}`);
  console.log(
    "\nClave publicable → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Dashboard → API keys).",
  );
  console.log(
    "Webhook → /api/webhooks/stripe (checkout.session.completed + customer.subscription.*).",
  );
  console.log(
    "Customer portal → Billing → URL de retorno a /dashboard/facturacion.\n",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
