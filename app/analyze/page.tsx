import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getQuotaSnapshotForUser } from "@/lib/billing/searchQuota";
import { prisma } from "@/lib/prisma";

import { AnalyzeExperience } from "@/components/analyze/AnalyzeExperience";

export const metadata: Metadata = {
  title: "Analizar ubicación | OpenSpot",
  description:
    "Análisis de ubicación con INE, mapas de afluencia y scoring para todo el territorio español.",
  robots: { index: false, follow: false },
};

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams?: Promise<{ city?: string; business?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/analyze");
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { creditWallet: true },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.creditWallet) {
    await prisma.creditWallet.create({
      data: { userId: user.id, balance: 3 },
    });
    user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      include: { creditWallet: true },
    });
  }

  const wallet = user.creditWallet;
  if (!wallet) {
    redirect("/login");
  }

  const snap = await getQuotaSnapshotForUser(session.user.id);
  if (!snap) {
    redirect("/login");
  }

  return (
    <AnalyzeExperience
      initialQuota={{
        headline: snap.headline,
        adminUnlimited: snap.adminUnlimited,
        balance: snap.balance,
        planTier: snap.planTier,
        monthlyUsed: snap.monthlyUsed,
        monthlyIncluded: snap.monthlyIncluded,
        extraCredits: snap.extraCredits,
      }}
      initialCity={sp.city}
      initialBusinessType={sp.business}
    />
  );
}
