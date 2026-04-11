"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";

type Plan = "pro" | "enterprise";

export function SubscribeCheckoutButton({
  plan,
  stripeConfigured,
  isLoggedIn,
  className,
  children,
}: {
  plan: Plan;
  stripeConfigured: boolean;
  isLoggedIn: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function startCheckout() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: plan === "pro" ? "subscribe_pro" : "subscribe_enterprise",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setErr(data.error ?? "No se pudo iniciar el pago.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErr("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent("/pricing")}`}
        className={className}
      >
        {children}
      </Link>
    );
  }

  if (!stripeConfigured) {
    return (
      <div className="space-y-2">
        <button type="button" disabled className={`${className} opacity-50`}>
          Pago en configuración
        </button>
        <p className="text-[11px] text-[var(--muted)]">
          El administrador debe definir precios Stripe y webhook. Mientras tanto:{" "}
          <Link href="/contacto" className="font-semibold text-[var(--accent)] underline">
            contacto
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={() => void startCheckout()}
        className={className}
      >
        {loading ? "Redirigiendo a Stripe…" : children}
      </button>
      {err ? <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{err}</p> : null}
    </div>
  );
}

export function SubscribeCheckoutButtonPro(props: {
  stripeConfigured: boolean;
  isLoggedIn: boolean;
}) {
  return (
    <SubscribeCheckoutButton
      plan="pro"
      stripeConfigured={props.stripeConfigured}
      isLoggedIn={props.isLoggedIn}
      className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 text-[14px] font-semibold text-[var(--background)] shadow-md transition-[opacity,transform] hover:opacity-92 active:scale-[0.99]"
    >
      Pasar a Pro
      <ArrowRightIcon />
    </SubscribeCheckoutButton>
  );
}

export function SubscribeCheckoutButtonEnterprise(props: {
  stripeConfigured: boolean;
  isLoggedIn: boolean;
}) {
  return (
    <SubscribeCheckoutButton
      plan="enterprise"
      stripeConfigured={props.stripeConfigured}
      isLoggedIn={props.isLoggedIn}
      className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--accent)] text-[14px] font-semibold text-white shadow-md shadow-indigo-500/25 transition-[filter,transform] hover:brightness-110 active:scale-[0.99]"
    >
      Contratar Enterprise
      <ArrowRightIcon />
    </SubscribeCheckoutButton>
  );
}
