"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("loading");
    setErr(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setPhase("err");
        setErr(data.error ?? "No se pudo enviar.");
        return;
      }
      setPhase("ok");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setPhase("err");
      setErr("Error de red.");
    }
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="os-card space-y-5 p-6 sm:p-8">
      <p className="text-[14px] leading-relaxed text-[var(--muted)]">
        Tu mensaje llega al equipo de OpenSpot. Respondemos por correo lo antes posible.
      </p>
      <div>
        <label className="block text-[13px] font-medium">Nombre</label>
        <input
          className="os-input mt-1.5 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          autoComplete="name"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium">Correo</label>
        <input
          type="email"
          className="os-input mt-1.5 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium">Motivo</label>
        <input
          className="os-input mt-1.5 w-full"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          minLength={2}
          placeholder="Ej. Plan Enterprise, integración API, prensa…"
        />
      </div>
      <div>
        <label className="block text-[13px] font-medium">Mensaje</label>
        <textarea
          className="os-input mt-1.5 min-h-[160px] w-full resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
        />
      </div>
      <button
        type="submit"
        disabled={phase === "loading"}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-8 text-[14px] font-semibold text-[var(--background)] disabled:opacity-40"
      >
        {phase === "loading" ? "Enviando…" : "Enviar mensaje"}
      </button>
      {phase === "ok" ? (
        <p className="text-[14px] font-medium text-emerald-700 dark:text-emerald-400">
          Gracias. Hemos recibido tu mensaje.
        </p>
      ) : null}
      {err ? <p className="text-[14px] text-red-600 dark:text-red-400">{err}</p> : null}
    </form>
  );
}
