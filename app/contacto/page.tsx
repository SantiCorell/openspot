import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con OpenSpot: planes, facturación, prensa e integraciones. Equipo en España.",
  openGraph: {
    title: "Contacto | OpenSpot",
    description: "Habla con el equipo OpenSpot sobre ubicación comercial y datos.",
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Contacto</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
        Cuéntanos qué necesitas: demostración, contratación Enterprise, soporte o prensa.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  );
}
