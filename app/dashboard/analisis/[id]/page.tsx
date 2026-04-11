import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { AnalysisDetailClient } from "@/components/dashboard/AnalysisDetailClient";
import { prisma } from "@/lib/prisma";
import type { AnalysisResult } from "@/lib/types/analysis";

export const dynamic = "force-dynamic";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const row = await prisma.analysis.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!row?.resultPayload || typeof row.resultPayload !== "object") {
    notFound();
  }

  const result = row.resultPayload as unknown as AnalysisResult;
  const createdAtLabel = row.createdAt.toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-[13px] font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          ← Volver al historial
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {row.title?.trim() || `Informe — ${row.city}`}
        </h1>
        <p className="mt-2 text-[15px] text-[var(--muted)]">
          {row.city} · {row.businessType} ·{" "}
          {Math.round(row.budget).toLocaleString("es-ES")} €
        </p>
      </div>

      <AnalysisDetailClient
        analysisId={row.id}
        initialTitle={row.title}
        createdAtLabel={createdAtLabel}
        result={result}
      />
    </main>
  );
}
