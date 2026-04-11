import type { PlanTier } from "@prisma/client";

import { isAdminEmail } from "@/lib/admin/isAdmin";
import { prisma } from "@/lib/prisma";

import {
  PLAN_COPY,
  includedComparisonsMonthlyForTier,
} from "@/lib/billing/plans";

function startOfUtcMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function needsMonthReset(anchor: Date, now: Date): boolean {
  const a = startOfUtcMonth(anchor);
  const n = startOfUtcMonth(now);
  return n.getTime() > a.getTime();
}

export type ComparisonQuotaResult =
  | { ok: true }
  | {
      ok: false;
      code: "UNAUTHORIZED" | "COMPARISON_EXHAUSTED";
      message: string;
    };

export async function assertCanRunComparison(
  userId: string,
): Promise<ComparisonQuotaResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creditWallet: true },
  });
  if (!user || !user.creditWallet) {
    return { ok: false, code: "UNAUTHORIZED", message: "Usuario no encontrado." };
  }

  if (isAdminEmail(user.email)) {
    return { ok: true };
  }

  const now = new Date();
  const tier = user.planTier as PlanTier;

  if (tier === "free") {
    const cap = PLAN_COPY.free.includedComparisonsLifetime;
    if (user.freeComparisonUsed < cap) return { ok: true };
    if (user.extraComparisonCredits > 0) return { ok: true };
    return {
      ok: false,
      code: "COMPARISON_EXHAUSTED",
      message: `Has usado las ${cap} comparaciones incluidas en Free. Crédito extra: ${PLAN_COPY.free.extraComparisonEur} € (contacta ventas) o pásate a Pro.`,
    };
  }

  let anchor = user.billingMonthAnchor;
  let compUsed = user.monthlyComparisonCount;

  if (needsMonthReset(anchor, now)) {
    anchor = startOfUtcMonth(now);
    compUsed = 0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        billingMonthAnchor: anchor,
        monthlySearchCount: 0,
        monthlyComparisonCount: 0,
      },
    });
  }

  const included = includedComparisonsMonthlyForTier(tier);
  if (compUsed < included) return { ok: true };
  if (user.extraComparisonCredits > 0) return { ok: true };

  const extraEur =
    tier === "pro"
      ? PLAN_COPY.pro.extraComparisonEur
      : PLAN_COPY.enterprise.extraComparisonEur;
  return {
    ok: false,
    code: "COMPARISON_EXHAUSTED",
    message: `Has agotado las ${included} comparaciones de este mes. Crédito extra: ${extraEur} € o espera al siguiente ciclo.`,
  };
}

export async function getComparisonQuotaSnapshotForUser(userId: string): Promise<{
  headline: string;
  planTier: PlanTier;
  freeUsed: number;
  freeCap: number;
  monthlyUsed: number;
  monthlyIncluded: number;
  extraComparisonCredits: number;
  adminUnlimited?: boolean;
} | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creditWallet: true },
  });
  if (!user?.creditWallet) return null;

  if (isAdminEmail(user.email)) {
    return {
      headline: "Administrador: comparaciones ilimitadas",
      planTier: user.planTier as PlanTier,
      freeUsed: user.freeComparisonUsed,
      freeCap: PLAN_COPY.free.includedComparisonsLifetime,
      monthlyUsed: user.monthlyComparisonCount,
      monthlyIncluded: includedComparisonsMonthlyForTier(user.planTier as PlanTier),
      extraComparisonCredits: user.extraComparisonCredits,
      adminUnlimited: true,
    };
  }

  const now = new Date();
  const tier = user.planTier as PlanTier;
  let anchor = user.billingMonthAnchor;
  let compUsed = user.monthlyComparisonCount;

  if (tier !== "free" && needsMonthReset(anchor, now)) {
    anchor = startOfUtcMonth(now);
    compUsed = 0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        billingMonthAnchor: anchor,
        monthlySearchCount: 0,
        monthlyComparisonCount: 0,
      },
    });
  }

  const freeCap = PLAN_COPY.free.includedComparisonsLifetime;
  const monthlyIncluded = includedComparisonsMonthlyForTier(tier);
  const extra = user.extraComparisonCredits;

  let headline: string;
  if (tier === "free") {
    const left = Math.max(0, freeCap - user.freeComparisonUsed);
    const extraStr =
      extra > 0 ? ` · ${extra} comparación(es) extra` : "";
    headline = `${left} de ${freeCap} comparaciones gratuitas (total)${extraStr}`;
  } else {
    const left = Math.max(0, monthlyIncluded - compUsed);
    const extraStr = extra > 0 ? ` · ${extra} comparación(es) extra` : "";
    headline = `${left} de ${monthlyIncluded} comparaciones del mes${extraStr}`;
  }

  return {
    headline,
    planTier: tier,
    freeUsed: user.freeComparisonUsed,
    freeCap,
    monthlyUsed: compUsed,
    monthlyIncluded,
    extraComparisonCredits: extra,
  };
}

export async function consumeComparisonCredit(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creditWallet: true },
  });
  if (!user || !user.creditWallet) return;

  if (isAdminEmail(user.email)) {
    return;
  }

  const now = new Date();
  const tier = user.planTier as PlanTier;

  if (tier === "free") {
    const cap = PLAN_COPY.free.includedComparisonsLifetime;
    if (user.freeComparisonUsed < cap) {
      await prisma.user.update({
        where: { id: userId },
        data: { freeComparisonUsed: { increment: 1 } },
      });
      return;
    }
    if (user.extraComparisonCredits > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { extraComparisonCredits: { decrement: 1 } },
      });
    }
    return;
  }

  let anchor = user.billingMonthAnchor;
  let compUsed = user.monthlyComparisonCount;
  let billingMonthRolled = false;

  if (needsMonthReset(anchor, now)) {
    anchor = startOfUtcMonth(now);
    compUsed = 0;
    billingMonthRolled = true;
  }

  const included = includedComparisonsMonthlyForTier(tier);

  if (compUsed < included) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyComparisonCount: compUsed + 1,
        billingMonthAnchor: anchor,
        ...(billingMonthRolled ? { monthlySearchCount: 0 } : {}),
      },
    });
    return;
  }

  if (user.extraComparisonCredits > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        extraComparisonCredits: { decrement: 1 },
        monthlyComparisonCount: compUsed + 1,
        billingMonthAnchor: anchor,
        ...(billingMonthRolled ? { monthlySearchCount: 0 } : {}),
      },
    });
  }
}
