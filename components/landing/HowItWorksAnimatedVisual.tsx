"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ArrowRightIcon } from "@/components/brand/ArrowRightIcon";

const STEPS = [
  {
    n: "1",
    title: "Crea tu cuenta",
    body: "Google o email. Sin tarjeta para probar.",
  },
  {
    n: "2",
    title: "Elige municipio y negocio",
    body: "Todo el territorio con cobertura INE más nuestras BBDD analíticas actualizadas.",
  },
  {
    n: "3",
    title: "Recibe mapa + informe",
    body: "Zonas puntuadas, costes orientativos y texto ejecutivo listo para decidir.",
  },
] as const;

const STEP_MS = 2800;

export function HowItWorksAnimatedVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2 lg:gap-3">
        {STEPS.flatMap((s, i) => {
          const isActive = active === i;
          const card = (
            <div
              key={s.n}
              className={`relative flex min-h-0 flex-1 flex-col rounded-2xl border p-5 transition-all duration-500 ease-out sm:p-6 ${
                isActive
                  ? "scale-[1.01] border-indigo-500/60 bg-gradient-to-br from-indigo-500/[0.08] to-cyan-500/[0.06] shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/25 md:scale-[1.02]"
                  : "border-[var(--border)] bg-[var(--muted-bg)]/30 opacity-[0.75]"
              }`}
            >
              {isActive ? (
                <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <span
                    className="how-it-works-shine absolute -inset-full rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent dark:via-white/10"
                    aria-hidden
                  />
                </span>
              ) : null}
              <div className="relative flex items-start gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[16px] font-bold transition-colors duration-500 ${
                    isActive
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "bg-[var(--muted-bg)] text-[var(--muted)]"
                  }`}
                >
                  {s.n}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-[16px] font-semibold leading-snug text-[var(--foreground)]">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--muted)]">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          );

          if (i >= STEPS.length - 1) {
            return [card];
          }

          const arrow = (
            <div
              key={`sep-${i}`}
              className="hidden shrink-0 items-center justify-center self-center px-1 md:flex md:px-0"
              aria-hidden
            >
              <span
                className={`text-xl font-light transition-colors duration-500 ${
                  active > i ? "text-indigo-500" : "text-[var(--border-strong)]"
                }`}
              >
                →
              </span>
            </div>
          );

          return [card, arrow];
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
        <div className="flex items-center gap-2" role="tablist" aria-label="Progreso del flujo">
          {STEPS.map((s, i) => (
            <button
              key={s.n}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Paso ${s.n}: ${s.title}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                active === i
                  ? "w-9 bg-indigo-600 dark:bg-indigo-400"
                  : "w-2 bg-[var(--border-strong)] hover:bg-[var(--muted)]"
              }`}
            />
          ))}
        </div>
        <Link
          href="/login?callbackUrl=/analyze"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-2.5 text-[14px] font-semibold text-[var(--background)] shadow-md transition-[transform,box-shadow] hover:shadow-lg active:scale-[0.99]"
        >
          Probar el flujo
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
