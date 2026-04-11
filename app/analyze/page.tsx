import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { includedMonthlyForTier } from "@/lib/billing/plans";
import { prisma } from "@/lib/prisma";

import { AnalyzeExperience } from "@/components/analyze/AnalyzeExperience";

export const metadata: Metadata = {
  title: "Analizar ubicación | OpenSpot",
  description:
    "Análisis de ubicación con INE, mapas de afluencia y scoring para todo el territorio español.",
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

  const monthlyIncluded = includedMonthlyForTier(user.planTier);
  const wallet = user.creditWallet;
  if (!wallet) {
    redirect("/login");
  }

  return (
    <AnalyzeExperience
      initialQuota={{
        balance: wallet.balance,
        planTier: user.planTier,
        monthlyUsed: user.monthlySearchCount,
        monthlyIncluded,
        extraCredits: user.extraSearchCredits,
      }}
      initialCity={sp.city}
      initialBusinessType={sp.business}
    />
  );
}
