"use client";

import { useState } from "react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function openPortal() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.ok || !data.url) {
        setErr(data.error ?? "No se pudo abrir el portal.");
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
    <div>
      <button
        type="button"
        disabled={loading}
        onClick={() => void openPortal()}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-6 text-[14px] font-semibold text-white shadow-sm disabled:opacity-40"
      >
        {loading ? "Abriendo…" : "Gestionar facturación en Stripe"}
      </button>
      {err ? (
        <p className="mt-2 text-[13px] text-red-600 dark:text-red-400">{err}</p>
      ) : null}
    </div>
  );
}
