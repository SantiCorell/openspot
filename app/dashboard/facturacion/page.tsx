import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { PLAN_COPY } from "@/lib/billing/plans";
import type { PlanTier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { BillingPortalButton } from "@/components/dashboard/BillingPortalButton";
import { ExtraCreditsCheckout } from "@/components/billing/ExtraCreditsCheckout";
import { InvoiceRequestForm } from "@/components/billing/InvoiceRequestForm";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ checkout?: string }>;
};

export default async function DashboardBillingPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sub = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const myInvoiceRequests = await prisma.invoiceRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  type InvoiceRow = {
    id: string;
    number: string | null;
    created: number;
    amountPaid: number;
    currency: string;
    status: string | null;
    pdfUrl: string | null;
  };

  let invoices: InvoiceRow[] = [];
  if (stripe && sub?.stripeCustomerId) {
    const list = await stripe.invoices.list({
      customer: sub.stripeCustomerId,
      limit: 20,
    });
    invoices = list.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      created: inv.created,
      amountPaid: inv.amount_paid,
      currency: inv.currency,
      status: inv.status,
      pdfUrl: inv.invoice_pdf ?? null,
    }));
  }

  const hasStripe = Boolean(stripe);
  const hasCustomer = Boolean(sub?.stripeCustomerId);
  const checkoutOk = sp.checkout === "ok";

  const userRow = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { planTier: true },
  });
  const tier = (userRow?.planTier ?? "free") as PlanTier;
  const extraSearchEur =
    tier === "free"
      ? PLAN_COPY.free.extraSearchEur
      : tier === "pro"
        ? PLAN_COPY.pro.extraSearchEur
        : PLAN_COPY.enterprise.extraSearchEur;
  const extraCompEur =
    tier === "free"
      ? PLAN_COPY.free.extraComparisonEur
      : tier === "pro"
        ? PLAN_COPY.pro.extraComparisonEur
        : PLAN_COPY.enterprise.extraComparisonEur;

  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
      <h2 className="text-xl font-semibold tracking-tight">Pagos y facturas</h2>
      <p className="mt-2 max-w-prose text-[14px] text-[var(--muted)]">
        Suscripciones y pagos sueltos con Stripe. Descarga PDFs, actualiza tarjeta o cancela la
        renovación desde el portal seguro. Puedes solicitar factura con datos fiscales cuando la
        necesites.
      </p>

      {checkoutOk ? (
        <div className="mt-6 rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 text-[13px] text-emerald-800 dark:text-emerald-200">
          Pago recibido. Los créditos pueden tardar unos segundos en aplicarse; refresca si no los
          ves aún.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(0,300px)]">
        <div className="os-card overflow-hidden">
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-[13px] font-semibold">Estado de suscripción</p>
          </div>
          <div className="space-y-2 px-4 py-4 text-[13px]">
            <p>
              <span className="text-[var(--muted)]">Estado:</span>{" "}
              <strong>{sub?.status ?? "Sin suscripción activa"}</strong>
            </p>
            {sub?.currentPeriodEnd ? (
              <p>
                <span className="text-[var(--muted)]">Fin de periodo actual:</span>{" "}
                {sub.currentPeriodEnd.toLocaleDateString("es-ES", {
                  dateStyle: "long",
                })}
              </p>
            ) : null}
            {!hasStripe ? (
              <p className="text-[var(--muted)]">
                STRIPE_SECRET_KEY no está activa en este entorno.
              </p>
            ) : null}
            {hasStripe && !hasCustomer ? (
              <p className="text-[var(--muted)]">
                Completa un pago desde{" "}
                <Link href="/pricing" className="font-semibold text-[var(--accent)] underline">
                  Precios
                </Link>{" "}
                o compra créditos abajo para vincular tu cliente Stripe.
              </p>
            ) : null}
            <p className="pt-2 text-[12px] text-[var(--muted)]">
              Para <strong>dar de baja</strong> la renovación automática, abre el portal de Stripe y
              cancela la suscripción (sigues con acceso hasta el fin del periodo pagado).
            </p>
          </div>
        </div>

        <div className="os-card p-5">
          <p className="text-[13px] font-semibold">Portal de cliente Stripe</p>
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">
            Métodos de pago, historial, facturas PDF y cancelación de suscripción.
          </p>
          {hasStripe && hasCustomer ? (
            <div className="mt-4">
              <BillingPortalButton />
            </div>
          ) : (
            <Link
              href="/pricing"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] px-6 text-[14px] font-semibold"
            >
              Ver planes
            </Link>
          )}
        </div>
      </div>

      {hasStripe ? (
        <section className="mt-10 space-y-4">
          <h3 className="text-lg font-semibold tracking-tight">Créditos sueltos</h3>
          <p className="text-[13px] text-[var(--muted)]">
            Con tu plan actual, cada estudio extra cuesta{" "}
            <strong>{extraSearchEur} €</strong> y cada comparación extra{" "}
            <strong>{extraCompEur} €</strong> (aparecen en el catálogo de Stripe como productos de pago
            único).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ExtraCreditsCheckout
              kind="extra_search"
              label="Estudio extra (informe completo)"
              unitLabel="Cada unidad suma un análisis completo al cupo de tu plan."
            />
            <ExtraCreditsCheckout
              kind="extra_comparison"
              label="Comparación multi-zona extra"
              unitLabel="Cada unidad suma una ejecución del comparador."
            />
          </div>
        </section>
      ) : null}

      <section className="mt-12 os-card p-6 sm:p-7">
        <h3 className="text-lg font-semibold tracking-tight">Solicitar factura</h3>
        <p className="mt-2 text-[13px] text-[var(--muted)]">
          Si necesitas factura con datos fiscales distintos a los del recibo automático, envía la
          solicitud. El equipo la revisará y te contactará por correo.
        </p>
        <div className="mt-6 max-w-xl">
          <InvoiceRequestForm />
        </div>
      </section>

      {myInvoiceRequests.length > 0 ? (
        <section className="mt-10">
          <h3 className="text-lg font-semibold tracking-tight">Tus solicitudes de factura</h3>
          <ul className="mt-4 space-y-2 text-[13px]">
            {myInvoiceRequests.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-4 py-3"
              >
                <span>
                  {r.createdAt.toLocaleDateString("es-ES")} ·{" "}
                  <strong className="capitalize">{r.status}</strong>
                  {r.companyName ? ` · ${r.companyName}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-12 os-card overflow-hidden">
        <div className="border-b border-[var(--border)] px-4 py-3">
          <p className="text-[13px] font-semibold">Recibos y facturas (Stripe)</p>
          <p className="text-[11px] text-[var(--muted)]">
            Solo lectura. El PDF oficial lo genera Stripe.
          </p>
        </div>
        {invoices.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">
            No hay facturas que mostrar todavía.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-col gap-1 px-4 py-3 text-[13px] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {inv.number ?? inv.id.slice(0, 12)} ·{" "}
                    {new Date(inv.created * 1000).toLocaleDateString("es-ES")}
                  </p>
                  <p className="text-[12px] text-[var(--muted)]">
                    {(inv.amountPaid / 100).toLocaleString("es-ES", {
                      style: "currency",
                      currency: inv.currency.toUpperCase() === "EUR" ? "EUR" : "USD",
                    })}{" "}
                    · {inv.status}
                  </p>
                </div>
                {inv.pdfUrl ? (
                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    PDF
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
