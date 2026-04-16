import { auth } from "@/auth";
import { extraComparisonUnitAmountCents, extraSearchUnitAmountCents } from "@/lib/billing/extraCreditCents";
import {
  stripePriceEnterpriseMonthly,
  stripePriceExtraComparisonForTier,
  stripePriceExtraSearchForTier,
  stripePriceProMonthly,
} from "@/lib/billing/stripeEnv";
import { prisma } from "@/lib/prisma";
import { siteBaseUrl } from "@/lib/seo/siteBaseUrl";
import { stripe } from "@/lib/stripe";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const bodySchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("subscribe_pro") }),
  z.object({ kind: z.literal("subscribe_enterprise") }),
  z.object({
    kind: z.literal("extra_search"),
    quantity: z.number().int().min(1).max(20).optional(),
  }),
  z.object({
    kind: z.literal("extra_comparison"),
    quantity: z.number().int().min(1).max(20).optional(),
  }),
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ ok: false, error: "Debes iniciar sesión." }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { ok: false, error: "Pagos no configurados (STRIPE_SECRET_KEY)." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Solicitud no válida" }, { status: 422 });
  }

  const userId = session.user.id;
  const email = session.user.email;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  }

  const base = siteBaseUrl();
  const successUrl = `${base}/dashboard/facturacion?checkout=ok`;
  const cancelUrl = `${base}/pricing`;

  const existingCustomerId = user.subscription?.stripeCustomerId ?? undefined;

  const input = parsed.data;

  try {
    if (input.kind === "subscribe_pro") {
      const price = stripePriceProMonthly();
      if (!price) {
        return NextResponse.json(
          { ok: false, error: "Falta STRIPE_PRICE_PRO_MONTHLY en el servidor." },
          { status: 503 },
        );
      }
      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: existingCustomerId,
        customer_email: existingCustomerId ? undefined : email,
        client_reference_id: userId,
        metadata: { userId, planTier: "pro" },
        subscription_data: {
          metadata: { userId, planTier: "pro" },
        },
        line_items: [{ price, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: "required",
        tax_id_collection: { enabled: true },
      });
      return NextResponse.json({ ok: true, url: checkout.url });
    }

    if (input.kind === "subscribe_enterprise") {
      const price = stripePriceEnterpriseMonthly();
      if (!price) {
        return NextResponse.json(
          { ok: false, error: "Falta STRIPE_PRICE_ENTERPRISE_MONTHLY en el servidor." },
          { status: 503 },
        );
      }
      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: existingCustomerId,
        customer_email: existingCustomerId ? undefined : email,
        client_reference_id: userId,
        metadata: { userId, planTier: "enterprise" },
        subscription_data: {
          metadata: { userId, planTier: "enterprise" },
        },
        line_items: [{ price, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: "required",
        tax_id_collection: { enabled: true },
      });
      return NextResponse.json({ ok: true, url: checkout.url });
    }

    const qty = "quantity" in input && input.quantity != null ? input.quantity : 1;

    if (input.kind === "extra_search") {
      const catalogPriceId = stripePriceExtraSearchForTier(user.planTier);
      const unit = extraSearchUnitAmountCents(user.planTier);
      const lineItems = catalogPriceId
        ? [{ price: catalogPriceId, quantity: qty }]
        : [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "OpenSpot — estudio extra (informe completo)",
                  description: `${qty} crédito(s) de informe según tu plan.`,
                },
                unit_amount: unit,
              },
              quantity: qty,
            },
          ];
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: existingCustomerId,
        customer_email: existingCustomerId ? undefined : email,
        client_reference_id: userId,
        metadata: {
          userId,
          kind: "extra_search",
          qty: String(qty),
        },
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: `${base}/dashboard/facturacion`,
        billing_address_collection: "auto",
      });
      return NextResponse.json({ ok: true, url: checkout.url });
    }

    const catalogCompId = stripePriceExtraComparisonForTier(user.planTier);
    const unitComp = extraComparisonUnitAmountCents(user.planTier);
    const compLineItems = catalogCompId
      ? [{ price: catalogCompId, quantity: qty }]
      : [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "OpenSpot — comparación multi-zona extra",
                description: `${qty} comparación(es) extra según tu plan.`,
              },
              unit_amount: unitComp,
            },
            quantity: qty,
          },
        ];
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: existingCustomerId,
      customer_email: existingCustomerId ? undefined : email,
      client_reference_id: userId,
      metadata: {
        userId,
        kind: "extra_comparison",
        qty: String(qty),
      },
      line_items: compLineItems,
      success_url: successUrl,
      cancel_url: `${base}/dashboard/facturacion`,
      billing_address_collection: "auto",
    });
    return NextResponse.json({ ok: true, url: checkout.url });
  } catch (e) {
    console.error("stripe checkout", e);
    return NextResponse.json(
      { ok: false, error: "No se pudo iniciar el pago. Inténtalo de nuevo." },
      { status: 500 },
    );
  }
}
