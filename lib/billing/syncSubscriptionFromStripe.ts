import type { PlanTier, SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";

import { stripePriceEnterpriseMonthly, stripePriceProMonthly } from "@/lib/billing/stripeEnv";

function mapStripeStatus(s: Stripe.Subscription.Status): SubscriptionStatus {
  switch (s) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "canceled";
    case "paused":
      return "incomplete";
    default:
      return "incomplete";
  }
}

function tierFromPriceId(priceId: string | undefined): PlanTier | null {
  if (!priceId) return null;
  if (priceId === stripePriceEnterpriseMonthly()) return "enterprise";
  if (priceId === stripePriceProMonthly()) return "pro";
  return null;
}

function resolveTier(sub: Stripe.Subscription, priceId: string | undefined): PlanTier {
  const meta = sub.metadata?.planTier;
  if (meta === "pro" || meta === "enterprise") return meta;
  return tierFromPriceId(priceId) ?? "free";
}

/**
 * Tras checkout o webhooks de suscripción: persiste Subscription y planTier del usuario.
 */
export async function upsertSubscriptionFromStripeSubscription(args: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscription: Stripe.Subscription;
}): Promise<void> {
  const { userId, stripeCustomerId, stripeSubscription } = args;
  const firstItem = stripeSubscription.items.data[0];
  const rawPrice = firstItem?.price;
  const priceId = typeof rawPrice === "string" ? rawPrice : rawPrice?.id;
  const status = mapStripeStatus(stripeSubscription.status);
  const periodEndTs = firstItem?.current_period_end;
  const periodEnd =
    typeof periodEndTs === "number" ? new Date(periodEndTs * 1000) : null;
  const tier = resolveTier(stripeSubscription, priceId);

  const userPlan: PlanTier =
    status === "active" || status === "trialing" ? tier : "free";

  await prisma.$transaction([
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeCustomerId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId ?? null,
        status,
        currentPeriodEnd: periodEnd,
      },
      update: {
        stripeCustomerId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId ?? null,
        status,
        currentPeriodEnd: periodEnd,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { planTier: userPlan },
    }),
  ]);
}

/** Suscripción cancelada o eliminada: baja a Free. */
export async function handleSubscriptionEnded(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.subscription.updateMany({
      where: { userId },
      data: {
        status: "canceled",
        stripeSubscriptionId: null,
        stripePriceId: null,
        currentPeriodEnd: null,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { planTier: "free" },
    }),
  ]);
}
