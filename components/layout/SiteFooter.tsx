import Link from "next/link";

import { OpenSpotLogo } from "@/components/brand/OpenSpotLogo";
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  FOOTER_FAQS,
} from "@/lib/marketing/footerFaqs";
import { TRUST_STATS } from "@/lib/marketing/trustStats";

export function SiteFooter() {
  const faqJson = buildFaqJsonLd();
  const orgJson = buildOrganizationJsonLd();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--muted-bg)]/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
          Confianza respaldada por datos
        </p>
        <p className="mx-auto mt-2 max-w-xl text-center text-[13px] text-[var(--muted)]">
          Cifras de referencia de la actividad consolidada en la red OpenSpot.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatBlock
            value={TRUST_STATS.studies}
            label={TRUST_STATS.studiesLabel}
          />
          <StatBlock
            value={TRUST_STATS.investmentVolume}
            label={TRUST_STATS.investmentLabel}
          />
          <StatBlock value={TRUST_STATS.users} label={TRUST_STATS.usersLabel} />
          <StatBlock
            value={TRUST_STATS.dataPoints}
            label={TRUST_STATS.dataLabel}
          />
        </div>

        <div className="mt-16 border-t border-[var(--border)] pt-14">
          <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
            Preguntas frecuentes
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-[14px] text-[var(--muted)]">
            Lo que suelen preguntar emprendedores, franquicias y equipos de
            expansión antes de decidir.
          </p>
          <div className="mx-auto mt-10 max-w-2xl divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-1 shadow-sm">
            {FOOTER_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group faq-item px-4 py-1 first:pt-3 last:pb-3"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-left text-[15px] font-semibold text-[var(--foreground)] marker:hidden [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180">
                    <ChevronIcon />
                  </span>
                </summary>
                <p className="pb-4 text-[14px] leading-relaxed text-[var(--muted)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-8 border-t border-[var(--border)] pt-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-center sm:items-start">
            <OpenSpotLogo iconSize={28} />
            <p className="mt-3 max-w-xs text-center text-[13px] leading-relaxed text-[var(--muted)] sm:text-left">
              La capa de decisión para abrir negocio en España: histórico masivo,
              modelos económicos y IA aplicada a tu municipio.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[13px] sm:justify-end">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Producto
              </span>
              <Link
                href="/analyze"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Analizar
              </Link>
              <Link
                href="/pricing"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Precios
              </Link>
              <Link
                href="/blog"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Blog
              </Link>
              <Link
                href="/comparador"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Comparar zonas
              </Link>
              <Link
                href="/contacto"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Contacto
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Legal
              </span>
              <Link
                href="/legal/cookies"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Cookies
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Cuenta
              </span>
              <Link
                href="/login"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Entrar
              </Link>
              <Link
                href="/dashboard"
                className="text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Panel
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[12px] text-[var(--muted)]">
          © {new Date().getFullYear()} OpenSpot. España.
        </p>
        <p className="mt-4 text-center text-[10px] leading-relaxed text-[var(--muted)]">
          Web creada por{" "}
          <a
            href="https://metrio.es/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline"
          >
            https://metrio.es/
          </a>
        </p>
      </div>
    </footer>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-5 text-center shadow-sm">
      <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[1.65rem]">
        {value}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-[var(--muted)]">{label}</p>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
