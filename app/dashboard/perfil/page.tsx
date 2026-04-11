import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { prisma } from "@/lib/prisma";

import { PLAN_COPY } from "@/lib/billing/plans";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) redirect("/login");

  const planKey = user.planTier;
  const planBlurb =
    planKey === "free"
      ? PLAN_COPY.free.blurb
      : planKey === "pro"
        ? PLAN_COPY.pro.blurb
        : PLAN_COPY.enterprise.blurb;

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <h2 className="text-xl font-semibold tracking-tight">Tu perfil</h2>
      <p className="mt-2 text-[14px] text-[var(--muted)]">
        Completa tus datos para que el equipo te reconozca mejor en soporte y futuras funciones
        (facturación, alertas).
      </p>

      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/40 px-4 py-3 text-[13px] text-[var(--muted)]">
        <p>
          <strong className="text-[var(--foreground)]">Plan actual:</strong>{" "}
          {planKey === "free"
            ? PLAN_COPY.free.label
            : planKey === "pro"
              ? PLAN_COPY.pro.label
              : PLAN_COPY.enterprise.label}
        </p>
        <p className="mt-1">{planBlurb}</p>
      </div>

      <div className="mt-8 os-card p-6 sm:p-7">
        <ProfileForm
          user={{
            name: user.name,
            email: user.email,
            phone: user.phone,
            company: user.company,
            bio: user.bio,
          }}
        />
      </div>
    </main>
  );
}
