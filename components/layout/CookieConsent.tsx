"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "openspot_cookie_consent_v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-4 z-[100] max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl sm:left-auto sm:right-6 sm:mx-0"
    >
      <p className="text-[13px] leading-relaxed text-[var(--foreground)]">
        Usamos cookies técnicas para la sesión y para recordar esta decisión.{" "}
        <Link href="/legal/cookies" className="font-semibold text-[var(--accent)] underline">
          Política de cookies
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => accept()}
          className="inline-flex h-10 items-center rounded-full bg-[var(--foreground)] px-5 text-[13px] font-semibold text-[var(--background)]"
        >
          Aceptar
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="inline-flex h-10 items-center rounded-full border border-[var(--border)] px-5 text-[13px] font-semibold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
