"use client";

import { useState } from "react";

type Kind = "extra_search" | "extra_comparison";

export function ExtraCreditsCheckout({
  kind,
  label,
  unitLabel,
}: {
  kind: Kind;
  label: string;
  unitLabel: string;
}) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pay() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, quantity: qty }),
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

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/40 p-4">
      <p className="text-[13px] font-semibold text-[var(--foreground)]">{label}</p>
      <p className="mt-1 text-[12px] text-[var(--muted)]">{unitLabel}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-[13px]">
          <span className="text-[var(--muted)]">Cantidad</span>
          <input
            type="number"
            min={1}
            max={20}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            className="os-input w-20 tabular-nums"
          />
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void pay()}
          className="inline-flex h-10 items-center rounded-full bg-[var(--foreground)] px-5 text-[13px] font-semibold text-[var(--background)] disabled:opacity-40"
        >
          {loading ? "Stripe…" : "Pagar con Stripe"}
        </button>
      </div>
      {err ? <p className="mt-2 text-[12px] text-red-600 dark:text-red-400">{err}</p> : null}
    </div>
  );
}
