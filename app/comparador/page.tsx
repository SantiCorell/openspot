import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getComparisonQuotaSnapshotForUser } from "@/lib/billing/comparisonQuota";
import { prisma } from "@/lib/prisma";

import { ZoneComparatorExperience } from "@/components/comparador/ZoneComparatorExperience";

export const metadata: Metadata = {
  title: "Comparador de zonas | OpenSpot",
  description:
    "Compara hasta 6 municipios españoles por sector: población INE, competidores modelados y lectura ejecutiva. Enlaza al análisis completo.",
};

export default async function ComparadorPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/comparador");
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
  }

  const snap = await getComparisonQuotaSnapshotForUser(session.user.id);
  if (!snap) {
    redirect("/login");
  }

  return (
    <main className="flex-1">
      <ZoneComparatorExperience
        initialQuota={{
          headline: snap.headline,
          planTier: snap.planTier,
        }}
      />
    </main>
  );
}
