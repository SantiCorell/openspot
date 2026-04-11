import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies de OpenSpot: cookies técnicas, preferencias y enlaces útiles.",
  robots: { index: true, follow: true },
};

export default function CookiesPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Política de cookies</h1>
      <p className="mt-2 text-[14px] text-[var(--muted)]">Última actualización: abril 2026</p>

      <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-[var(--foreground)]">
        <p>
          OpenSpot utiliza cookies y almacenamiento local únicamente para el funcionamiento
          técnico del sitio (por ejemplo, recordar que has aceptado este aviso o mantener tu sesión
          cuando inicias sesión). No vendemos datos de navegación a terceros.
        </p>
        <h2 className="text-xl font-semibold tracking-tight">Cookies propias</h2>
        <ul className="list-disc space-y-2 pl-5 text-[var(--muted)]">
          <li>
            <strong className="text-[var(--foreground)]">Sesión / autenticación:</strong> necesarias
            para que NextAuth recuerde tu inicio de sesión de forma segura.
          </li>
          <li>
            <strong className="text-[var(--foreground)]">Preferencia de cookies:</strong> guardamos
            en tu navegador que has aceptado esta política para no mostrar el banner en cada visita.
          </li>
        </ul>
        <h2 className="text-xl font-semibold tracking-tight">Terceros</h2>
        <p className="text-[var(--muted)]">
          Si en el futuro incorporamos analítica o mapas que depositen cookies adicionales, lo
          indicaremos aquí y, cuando sea obligatorio, pediremos consentimiento previo.
        </p>
        <h2 className="text-xl font-semibold tracking-tight">Cómo gestionarlas</h2>
        <p className="text-[var(--muted)]">
          Puedes borrar cookies desde la configuración de tu navegador. Si las bloqueas por
          completo, algunas funciones (como iniciar sesión) podrían dejar de funcionar.
        </p>
        <p>
          <Link href="/contacto" className="font-semibold text-[var(--accent)] underline">
            Contacto
          </Link>{" "}
          para cualquier duda sobre privacidad o datos.
        </p>
      </div>
    </main>
  );
}
