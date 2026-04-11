import { headers } from "next/headers";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import {
  handleSubscriptionEnded,
  upsertSubscriptionFromStripeSubscription,
} from "@/lib/billing/syncSubscriptionFromStripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function fulfillCheckout(session: Stripe.Checkout.Session) {
  if (!stripe) return;
  const userId =
    session.metadata?.userId ?? session.client_reference_id ?? undefined;
  if (!userId) {
    console.warn("stripe webhook: checkout sin userId");
    return;
  }

  if (session.mode === "subscription") {
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    const subId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    if (!customerId || !subId) return;
    const sub = await stripe.subscriptions.retrieve(subId);
    await upsertSubscriptionFromStripeSubscription({
      userId,
      stripeCustomerId: customerId,
      stripeSubscription: sub,
    });
    return;
  }

  if (session.mode === "payment") {
    const kind = session.metadata?.kind;
    const qty = Math.min(20, Math.max(1, parseInt(session.metadata?.qty ?? "1", 10) || 1));
    if (kind === "extra_search") {
      const u = await prisma.user.findUnique({ where: { id: userId } });
      if (!u) return;
      if (u.planTier === "free") {
        const wallet = await prisma.creditWallet.findUnique({ where: { userId } });
        if (wallet) {
          await prisma.$transaction([
            prisma.creditWallet.update({
              where: { userId },
              data: { balance: { increment: qty } },
            }),
            prisma.creditTransaction.create({
              data: {
                walletId: wallet.id,
                amount: qty,
                reason: "stripe_extra_search",
                stripeRef:
                  typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : session.payment_intent?.id,
              },
            }),
          ]);
        }
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { extraSearchCredits: { increment: qty } },
        });
      }
    } else if (kind === "extra_comparison") {
      await prisma.user.update({
        where: { id: userId },
        data: { extraComparisonCredits: { increment: qty } },
      });
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    if (customerId) {
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          stripeCustomerId: customerId,
          status: "incomplete",
        },
        update: { stripeCustomerId: customerId },
      });
    }
  }
}

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
  }

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!whSecret) {
    console.error("STRIPE_WEBHOOK_SECRET no definido");
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }

  const raw = Buffer.from(await req.arrayBuffer());
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Sin firma" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (e) {
    console.error("stripe signature", e);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await fulfillCheckout(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        let uid: string | undefined = sub.metadata?.userId ?? undefined;
        if (!uid) {
          const dbSub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });
          uid = dbSub?.userId ?? undefined;
        }
        if (!uid) break;
        await upsertSubscriptionFromStripeSubscription({
          userId: uid,
          stripeCustomerId: customerId,
          stripeSubscription: sub,
        });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        let uid: string | undefined = sub.metadata?.userId ?? undefined;
        if (!uid) {
          const dbSub = await prisma.subscription.findFirst({
            where: { stripeCustomerId: customerId },
          });
          uid = dbSub?.userId ?? undefined;
        }
        if (uid) await handleSubscriptionEnded(uid);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("stripe webhook handler", e);
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
