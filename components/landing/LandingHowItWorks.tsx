import { HowItWorksAnimatedVisual } from "@/components/landing/HowItWorksAnimatedVisual";

export function LandingHowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-[calc(3.75rem+1rem)] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Cómo funciona
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.65rem]">
        Tres pasos. Cero fricción.
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--muted)]">
        Detrás hay padrón INE y millones de registros propios en bases que alimentamos de forma
        continua. El paso activo se resalta solo; también puedes elegir uno tocando los puntos.
      </p>

      <div className="mt-8">
        <HowItWorksAnimatedVisual />
      </div>
    </section>
  );
}
