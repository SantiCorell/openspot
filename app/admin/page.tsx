import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AnalysesTable } from "@/components/dashboard/AnalysesTable";
import { MarkInvoiceButton } from "@/components/admin/MarkInvoiceButton";
import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";
import { isAdminEmail } from "@/lib/admin/isAdmin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PLAN_ORDER = ["free", "pro", "enterprise"] as const;

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }

  const [
    userTotal,
    analysisTotal,
    byPlan,
    recentUsers,
    myAnalyses,
    userRecord,
    invoiceRequests,
    contactSubmissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.analysis.count(),
    prisma.user.groupBy({
      by: ["planTier"],
      _count: { id: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        email: true,
        name: true,
        planTier: true,
        createdAt: true,
        monthlySearchCount: true,
      },
    }),
    prisma.analysis.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        title: true,
        city: true,
        businessType: true,
        budget: true,
        createdAt: true,
      },
    }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.invoiceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 60,
      include: {
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 80,
      include: {
        user: { select: { email: true } },
      },
    }),
  ]);

  const countByPlan = Object.fromEntries(
    byPlan.map((r) => [r.planTier, r._count.id]),
  ) as Record<string, number>;

  const maxPlanBar = Math.max(1, ...PLAN_ORDER.map((p) => countByPlan[p] ?? 0));

  return (
    <main className="mx-auto max-w-5xl flex-1 space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
            Administración
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Resumen de la plataforma
          </h1>
          <p className="mt-2 max-w-xl text-[14px] text-[var(--muted)]">
            Métricas globales y accesos rápidos al mismo panel que cualquier usuario.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/analyze"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-[14px] font-semibold text-white shadow-md shadow-indigo-500/20"
          >
            Nuevo análisis
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-5 text-[14px] font-semibold"
          >
            Solo mi historial
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Usuarios registrados" value={userTotal} />
        <StatCard label="Análisis totales" value={analysisTotal} />
        <StatCard
          label="Tu plan"
          value={userRecord?.planTier ?? "—"}
          sub="Cuenta con la que has entrado"
        />
        <StatCard
          label="Sesión"
          value={session.user.email?.split("@")[0] ?? "Usuario"}
          sub={session.user.email ?? ""}
        />
      </section>

      <section className="os-card p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight">
          Usuarios por plan
        </h2>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          Distribución actual de <code className="text-[12px]">planTier</code> en base de datos.
        </p>
        <div className="mt-6 space-y-4">
          {PLAN_ORDER.map((plan) => {
            const n = countByPlan[plan] ?? 0;
            const pct = Math.round((n / maxPlanBar) * 100);
            return (
              <div key={plan}>
                <div className="flex justify-between text-[13px] font-medium capitalize">
                  <span>{plan}</span>
                  <span className="tabular-nums text-[var(--muted)]">{n}</span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--muted-bg)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-[width] duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="os-card overflow-x-auto p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight">
          Solicitudes de factura
        </h2>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          Pendientes y recientes. Marca como enviada cuando hayas emitido la factura.
        </p>
        {invoiceRequests.length === 0 ? (
          <p className="mt-6 text-[13px] text-[var(--muted)]">Ninguna solicitud todavía.</p>
        ) : (
          <table className="mt-6 w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="pb-2 pr-4">Fecha</th>
                <th className="pb-2 pr-4">Usuario</th>
                <th className="pb-2 pr-4">Estado</th>
                <th className="pb-2 pr-4">Empresa / NIF</th>
                <th className="pb-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {invoiceRequests.map((r) => (
                <tr key={r.id} className="border-t border-[var(--border)]">
                  <td className="py-3 pr-4 text-[var(--muted)]">
                    {r.createdAt.toLocaleString("es-ES")}
                  </td>
                  <td className="max-w-[200px] truncate py-3 pr-4 font-mono text-[12px]">
                    {r.user.email ?? "—"}
                  </td>
                  <td className="py-3 pr-4 capitalize">{r.status}</td>
                  <td className="max-w-[220px] truncate py-3 pr-4 text-[12px]">
                    {[r.companyName, r.taxId].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="py-3">
                    {r.status === "pending" ? <MarkInvoiceButton id={r.id} /> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="os-card overflow-x-auto p-6 sm:p-7">
        <h2 className="text-lg font-semibold tracking-tight">Contactos</h2>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          Mensajes desde la página de contacto (no se envía email automático: revisa aquí).
        </p>
        {contactSubmissions.length === 0 ? (
          <p className="mt-6 text-[13px] text-[var(--muted)]">Ningún mensaje todavía.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {contactSubmissions.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/30 p-4 text-[13px]"
              >
                <p className="font-semibold text-[var(--foreground)]">{c.subject}</p>
                <p className="mt-1 text-[12px] text-[var(--muted)]">
                  {c.name} ·{" "}
                  <a href={`mailto:${c.email}`} className="text-[var(--accent)] underline">
                    {c.email}
                  </a>{" "}
                  · {c.createdAt.toLocaleString("es-ES")}
                  {c.user?.email ? ` · cuenta: ${c.user.email}` : ""}
                </p>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--foreground)]">
                  {c.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          Últimos registros
        </h2>
        <p className="mt-1 text-[13px] text-[var(--muted)]">
          Hasta 40 cuentas más recientes (email parcial en móvil).
        </p>
        <div className="os-card mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-[var(--muted-bg)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Plan</th>
                <th className="px-4 py-2">Búsquedas mes</th>
                <th className="px-4 py-2">Alta</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-t border-[var(--border)]">
                  <td className="max-w-[200px] truncate px-4 py-2.5 font-mono text-[12px]">
                    {u.email ?? "—"}
                  </td>
                  <td className="px-4 py-2.5">{u.name ?? "—"}</td>
                  <td className="px-4 py-2.5 capitalize">{u.planTier}</td>
                  <td className="px-4 py-2.5 tabular-nums">{u.monthlySearchCount}</td>
                  <td className="px-4 py-2.5 text-[var(--muted)]">
                    {u.createdAt.toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Tus análisis (como usuario)
            </h2>
            <p className="mt-1 text-[13px] text-[var(--muted)]">
              Mismo historial que en{" "}
              <Link href="/dashboard" className="font-medium text-indigo-600 underline dark:text-indigo-400">
                /dashboard
              </Link>
              .
            </p>
          </div>
          {userRecord?.planTier === "enterprise" ? (
            <Link
              href="/producto/comparador"
              className="text-[13px] font-semibold text-indigo-600 underline dark:text-indigo-400"
            >
              Comparador Enterprise
            </Link>
          ) : null}
        </div>
        <AnalysesTable analyses={myAnalyses} />
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <p className="text-[12px] font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight capitalize">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 truncate text-[11px] text-[var(--muted)]">{sub}</p>
      ) : null}
    </div>
  );
}
