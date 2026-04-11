import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { PLAN_COPY } from "@/lib/billing/plans";
import { stripeSubscriptionsReady } from "@/lib/billing/stripeEnv";
import { stripe } from "@/lib/stripe";

import {
  SubscribeCheckoutButtonEnterprise,
  SubscribeCheckoutButtonPro,
} from "@/components/billing/SubscribeCheckoutButton";

export const metadata: Metadata = {
  title: "Precios | OpenSpot",
  description:
    "Free, Pro y Enterprise. Búsquedas de análisis, comparador multi-zona y pagos seguros con Stripe.",
  alternates: { canonical: "/pricing" },
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const session = await auth();
  const isLoggedIn = Boolean(session?.user);
  const stripeConfigured = Boolean(stripe) && stripeSubscriptionsReady();

  return (
    <main className="relative mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 sm:py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 max-w-3xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(79,70,229,0.1),transparent_70%)]"
        aria-hidden
      />
      <div className="relative max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
          Precios
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
          Cada <strong>análisis completo</strong> cuenta como una búsqueda. Pagos con{" "}
          <strong>Stripe</strong> (suscripción mensual o créditos sueltos desde tu panel de
          facturación).
        </p>
      </div>

      <div className="relative mt-12 grid gap-5 lg:grid-cols-3">
        <div className="os-card flex flex-col p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {PLAN_COPY.free.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">0 €</p>
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            {PLAN_COPY.free.blurb}
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-[14px] leading-relaxed text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">·</span>
              {PLAN_COPY.free.includedSearches} búsquedas incluidas (total)
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">·</span>
              Búsqueda adicional: {PLAN_COPY.free.extraSearchEur} €
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">·</span>
              {PLAN_COPY.free.includedComparisonsLifetime} comparaciones multi-zona (total); extra:{" "}
              {PLAN_COPY.free.extraComparisonEur} €
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--accent)]">·</span>
              INE + millones de datos propios + mapas + DeepSeek
            </li>
          </ul>
          <Link
            href="/login?callbackUrl=/analyze"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[14px] font-semibold shadow-sm transition-transform active:scale-[0.99]"
          >
            Empezar gratis
          </Link>
        </div>

        <div className="os-card flex flex-col border-indigo-500/25 bg-gradient-to-br from-indigo-500/[0.07] to-transparent p-7 dark:from-indigo-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-300">
            {PLAN_COPY.pro.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            Desde 49 € / mes
          </p>
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            {PLAN_COPY.pro.blurb}
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-[14px] leading-relaxed text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="text-indigo-500">·</span>
              {PLAN_COPY.pro.includedSearchesPerMonth} búsquedas / mes incluidas
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">·</span>
              Extra: {PLAN_COPY.pro.extraSearchEur} € / búsqueda
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">·</span>
              {PLAN_COPY.pro.includedComparisonsPerMonth} comparaciones multi-zona / mes; extra:{" "}
              {PLAN_COPY.pro.extraComparisonEur} €
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-500">·</span>
              Facturación y recibos en tu panel (Stripe)
            </li>
          </ul>
          <SubscribeCheckoutButtonPro
            stripeConfigured={stripeConfigured}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <div className="os-card flex flex-col p-7 ring-1 ring-indigo-500/20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            {PLAN_COPY.enterprise.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {PLAN_COPY.enterprise.monthlyEur} € / mes
          </p>
          <p className="mt-2 text-[13px] text-[var(--muted)]">
            {PLAN_COPY.enterprise.blurb}
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-[14px] leading-relaxed text-[var(--muted)]">
            <li className="flex gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">·</span>
              Hasta {PLAN_COPY.enterprise.includedSearchesPerMonth} búsquedas / mes
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">·</span>
              Extra: {PLAN_COPY.enterprise.extraSearchEur} € / búsqueda
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">·</span>
              {PLAN_COPY.enterprise.includedComparisonsPerMonth} comparaciones multi-zona / mes; extra:{" "}
              {PLAN_COPY.enterprise.extraComparisonEur} €
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-600 dark:text-cyan-400">·</span>
              <Link
                href="/comparador"
                className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Comparador de zonas
              </Link>
              {" · "}
              <Link
                href="/producto/comparador"
                className="text-[var(--accent)] underline-offset-2 hover:underline"
              >
                demo gráficos
              </Link>
            </li>
          </ul>
          <SubscribeCheckoutButtonEnterprise
            stripeConfigured={stripeConfigured}
            isLoggedIn={isLoggedIn}
          />
          <Link
            href="/contacto"
            className="mt-3 text-center text-[12px] font-medium text-[var(--muted)] underline-offset-2 hover:underline"
          >
            ¿Contrato personalizado? Escríbenos
          </Link>
        </div>
      </div>

      <p className="relative mt-10 text-center text-[12px] text-[var(--muted)]">
        IVA según corresponda. Cancela la renovación cuando quieras desde el{" "}
        <strong>portal de cliente Stripe</strong> en Pagos y facturas.
      </p>
    </main>
  );
}
