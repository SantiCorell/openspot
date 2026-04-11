"use client";

import { useState } from "react";

export function InvoiceRequestForm() {
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      const res = await fetch("/api/invoice-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim() || undefined,
          taxId: taxId.trim() || undefined,
          address: address.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("err");
        setMsg(data.error ?? "No se pudo enviar.");
        return;
      }
      setStatus("ok");
      setMsg("Solicitud registrada. Te enviaremos la factura cuando esté lista.");
      setCompanyName("");
      setTaxId("");
      setAddress("");
      setNotes("");
    } catch {
      setStatus("err");
      setMsg("Error de red.");
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <div>
        <label className="block text-[13px] font-medium">Razón social / nombre fiscal</label>
        <input
          className="os-input mt-1.5 w-full"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Ej. Mi empresa SL"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium">NIF / CIF / VAT</label>
        <input
          className="os-input mt-1.5 w-full"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          placeholder="Opcional"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium">Dirección de facturación</label>
        <textarea
          className="os-input mt-1.5 min-h-[88px] w-full resize-y"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Calle, CP, ciudad, país"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium">Notas</label>
        <textarea
          className="os-input mt-1.5 min-h-[72px] w-full resize-y"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Periodo a facturar, email alternativo, etc."
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] px-6 text-[14px] font-semibold disabled:opacity-40"
      >
        {status === "loading" ? "Enviando…" : "Solicitar factura"}
      </button>
      {msg ? (
        <p
          className={`text-[13px] ${status === "ok" ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
        >
          {msg}
        </p>
      ) : null}
    </form>
  );
}
