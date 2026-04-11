"use client";

import { useState } from "react";

import { markInvoiceRequestFulfilled } from "@/app/admin/actions";

export function MarkInvoiceButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-[12px] font-semibold hover:bg-[var(--muted-bg)] disabled:opacity-40"
      onClick={() => {
        setLoading(true);
        void (async () => {
          await markInvoiceRequestFulfilled(id);
          setLoading(false);
        })();
      }}
    >
      {loading ? "…" : "Marcar enviada"}
    </button>
  );
}
