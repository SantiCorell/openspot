import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AnalysesTable } from "@/components/dashboard/AnalysesTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sp = (await searchParams) ?? {};
  const q = sp.q?.trim() ?? "";

  const [analyses, user] = await Promise.all([
    prisma.analysis.findMany({
      where: {
        userId: session.user.id,
        ...(q.length > 0
          ? {
              OR: [
                { city: { contains: q, mode: "insensitive" } },
                { title: { contains: q, mode: "insensitive" } },
                { businessType: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: q.length > 0 ? 60 : 25,
    }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
            Historial de estudios
          </h1>
          <p className="mt-2 text-[15px] text-[var(--muted)]">
            Cada análisis queda guardado en tu cuenta. Usa el buscador si acumulas muchos informes.
          </p>
          {user?.planTier === "enterprise" ? (
            <Link
              href="/producto/comparador"
              className="mt-3 inline-flex text-[14px] font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Abrir comparador municipal (Enterprise)
            </Link>
          ) : null}
        </div>
        <Link
          href="/analyze"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[14px] font-semibold text-white shadow-md shadow-indigo-500/20 transition-[filter,transform] hover:brightness-110 active:scale-[0.99]"
        >
          Nuevo análisis
        </Link>
      </div>

      <form
        action="/dashboard"
        method="get"
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre del estudio, ciudad o tipo…"
          className="os-input min-h-11 flex-1"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] px-6 text-[14px] font-semibold text-[var(--background)]"
          >
            Buscar
          </button>
          {q ? (
            <Link
              href="/dashboard"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] px-5 text-[14px] font-medium"
            >
              Limpiar
            </Link>
          ) : null}
        </div>
      </form>

      <div className="mt-10">
        <AnalysesTable analyses={analyses} />
      </div>
    </main>
  );
}
