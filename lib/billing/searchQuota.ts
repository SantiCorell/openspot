import type { PlanTier } from "@prisma/client";

import { isAdminEmail } from "@/lib/admin/isAdmin";
import { prisma } from "@/lib/prisma";

import { includedMonthlyForTier } from "@/lib/billing/plans";

function startOfUtcMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function needsMonthReset(anchor: Date, now: Date): boolean {
  const a = startOfUtcMonth(anchor);
  const n = startOfUtcMonth(now);
  return n.getTime() > a.getTime();
}

export type QuotaResult =
  | { ok: true }
  | {
      ok: false;
      code: "UNAUTHORIZED" | "FREE_EXHAUSTED" | "QUOTA_EXHAUSTED";
      message: string;
    };

export async function assertCanRunSearch(userId: string): Promise<QuotaResult> {
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

  if (user.planTier === "free") {
    if (user.creditWallet.balance > 0) return { ok: true };
    return {
      ok: false,
      code: "FREE_EXHAUSTED",
      message:
        "Has agotado las 3 búsquedas gratuitas. Compra una búsqueda extra (50 €) o pásate a Pro.",
    };
  }

  let anchor = user.billingMonthAnchor;
  let used = user.monthlySearchCount;
  const extra = user.extraSearchCredits;

  if (needsMonthReset(anchor, now)) {
    anchor = startOfUtcMonth(now);
    used = 0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        billingMonthAnchor: anchor,
        monthlySearchCount: 0,
        monthlyComparisonCount: 0,
      },
    });
  }

  const included = includedMonthlyForTier(user.planTier as PlanTier);
  if (used < included) return { ok: true };
  if (extra > 0) return { ok: true };

  const msg =
    user.planTier === "pro"
      ? "Has usado las 2 búsquedas Pro de este mes. Compra créditos extra (30 €/búsqueda) o espera al siguiente ciclo."
      : "Has agotado el cupo Enterprise del mes. Compra búsquedas extra (10 €) o contacta con ventas.";

  return { ok: false, code: "QUOTA_EXHAUSTED", message: msg };
}

/** Texto de cuota para cabecera / panel (resetea mes de facturación en BD si aplica). */
export async function getQuotaSnapshotForUser(userId: string): Promise<{
  headline: string;
  planTier: PlanTier;
  balance: number;
  monthlyUsed: number;
  monthlyIncluded: number;
  extraCredits: number;
  adminUnlimited?: boolean;
} | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creditWallet: true },
  });
  if (!user?.creditWallet) return null;

  if (isAdminEmail(user.email)) {
    return {
      headline: "Administrador: análisis ilimitados",
      planTier: user.planTier as PlanTier,
      balance: user.creditWallet.balance,
      monthlyUsed: user.monthlySearchCount,
      monthlyIncluded: includedMonthlyForTier(user.planTier as PlanTier),
      extraCredits: user.extraSearchCredits,
      adminUnlimited: true,
    };
  }

  const now = new Date();
  let anchor = user.billingMonthAnchor;
  let used = user.monthlySearchCount;

  if (user.planTier !== "free" && needsMonthReset(anchor, now)) {
    anchor = startOfUtcMonth(now);
    used = 0;
    await prisma.user.update({
      where: { id: userId },
      data: {
        billingMonthAnchor: anchor,
        monthlySearchCount: 0,
        monthlyComparisonCount: 0,
      },
    });
  }

  const monthlyIncluded = includedMonthlyForTier(user.planTier as PlanTier);
  const balance = user.creditWallet.balance;
  const extra = user.extraSearchCredits;

  let headline: string;
  if (user.planTier === "free") {
    headline = `${balance} búsqueda${balance === 1 ? "" : "s"} gratuita${balance === 1 ? "" : "s"} restantes`;
  } else {
    const left = Math.max(0, monthlyIncluded - used);
    const extraStr = extra > 0 ? ` · ${extra} crédito(s) extra` : "";
    headline = `${left} de ${monthlyIncluded} búsquedas del mes${extraStr}`;
  }

  return {
    headline,
    planTier: user.planTier as PlanTier,
    balance,
    monthlyUsed: used,
    monthlyIncluded,
    extraCredits: extra,
  };
}

export async function consumeSearchCredit(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { creditWallet: true },
  });
  if (!user || !user.creditWallet) return;

  if (isAdminEmail(user.email)) {
    return;
  }

  const now = new Date();
  let anchor = user.billingMonthAnchor;
  let used = user.monthlySearchCount;
  const extra = user.extraSearchCredits;
  let billingMonthRolled = false;

  if (user.planTier !== "free" && needsMonthReset(anchor, now)) {
    anchor = startOfUtcMonth(now);
    used = 0;
    billingMonthRolled = true;
  }

  if (user.planTier === "free") {
    await prisma.$transaction([
      prisma.creditWallet.update({
        where: { userId },
        data: { balance: { decrement: 1 } },
      }),
      prisma.creditTransaction.create({
        data: {
          walletId: user.creditWallet.id,
          amount: -1,
          reason: "analysis_free_tier",
        },
      }),
    ]);
    return;
  }

  const included = includedMonthlyForTier(user.planTier as PlanTier);
  if (used < included) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlySearchCount: used + 1,
        billingMonthAnchor: anchor,
        ...(billingMonthRolled ? { monthlyComparisonCount: 0 } : {}),
      },
    });
    return;
  }

  if (extra > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        extraSearchCredits: { decrement: 1 },
        monthlySearchCount: used + 1,
        billingMonthAnchor: anchor,
        ...(billingMonthRolled ? { monthlyComparisonCount: 0 } : {}),
      },
    });
  }
}
