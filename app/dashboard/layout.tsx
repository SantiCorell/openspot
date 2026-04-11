import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin/isAdmin";

export const dynamic = "force-dynamic";

const subNavLink =
  "inline-flex items-center rounded-full border border-transparent px-4 py-2 text-[13px] font-medium text-[var(--muted)] transition-colors hover:border-[var(--border)] hover:bg-[var(--card)] hover:text-[var(--foreground)]";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const isAdmin = isAdminEmail(session.user.email);
  const firstName =
    session.user.name?.split(/\s+/)[0] ??
    session.user.email?.split("@")[0] ??
    "Usuario";

  return (
    <div className="min-h-0 flex-1">
      <div className="border-b border-[var(--border)] bg-[var(--muted-bg)]/40">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            Área de cuenta
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-[1.65rem]">
            Hola, {firstName}
          </h1>
          <p className="mt-1 text-[14px] text-[var(--muted)]">
            Plan <strong className="text-[var(--foreground)]">{session.user.planLabel ?? "Free"}</strong>
            {session.user.quotaHeadline ? (
              <>
                {" "}
                · <span>{session.user.quotaHeadline}</span>
              </>
            ) : null}
          </p>
          <nav className="mt-5 flex flex-wrap gap-2" aria-label="Secciones del panel">
            <Link href="/dashboard" className={subNavLink}>
              Resumen e historial
            </Link>
            <Link href="/dashboard/perfil" className={subNavLink}>
              Perfil
            </Link>
            <Link href="/dashboard/facturacion" className={subNavLink}>
              Pagos y facturas
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-[13px] font-semibold text-indigo-800 dark:text-indigo-200"
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
