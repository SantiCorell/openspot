import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

import { signInGoogleAction } from "@/app/actions/auth";
import { GoogleGIcon } from "@/components/brand/GoogleGIcon";
import { MailIcon } from "@/components/brand/MailIcon";
import { OpenSpotLogo } from "@/components/brand/OpenSpotLogo";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  async function devSignIn(formData: FormData) {
    "use server";
    const email = formData.get("email");
    if (typeof email !== "string" || !email.includes("@")) return;
    await signIn("dev-email", { email, redirectTo: "/dashboard" });
  }

  return (
    <main className="relative flex min-h-[calc(100dvh-3.75rem)] flex-1 flex-col items-center justify-center px-4 py-8 sm:min-h-[calc(100dvh-4rem)] sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.12),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(6,182,212,0.06),transparent)]"
        aria-hidden
      />
      <div className="relative w-full max-w-[420px] space-y-8 sm:space-y-10 app-safe-bottom">
        <div className="flex flex-col items-center text-center">
          <OpenSpotLogo linkToHome={false} iconSize={44} className="mb-5 sm:mb-6" />
          <h1 className="text-[1.65rem] font-semibold tracking-tight sm:text-[1.75rem]">
            Entrar a OpenSpot
          </h1>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[var(--muted)]">
            Accede para guardar análisis y desbloquear el plan Pro cuando esté
            activo.
          </p>
        </div>

        <div className="os-card p-5 shadow-lg shadow-indigo-500/[0.06] sm:p-8">
          <form action={signInGoogleAction} className="space-y-3">
            <button type="submit" className="os-google-btn min-h-[52px] text-[15px]">
              <GoogleGIcon className="shrink-0" />
              Continuar con Google
            </button>
          </form>

          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden
            >
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              <span className="bg-[var(--card)] px-3">o</span>
            </div>
          </div>

          {process.env.NODE_ENV === "development" ? (
            <form action={devSignIn} className="space-y-4">
              <p className="text-center text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
                Desarrollo — email de prueba
              </p>
              <input
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="os-input"
                autoComplete="email"
              />
              <button
                type="submit"
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] px-4 py-3 text-[15px] font-semibold text-[var(--foreground)] shadow-sm transition-[background-color,transform] hover:bg-[var(--border)]/40 active:scale-[0.992] dark:hover:bg-zinc-800"
              >
                <MailIcon className="opacity-70" />
                Entrar con email
              </button>
            </form>
          ) : (
            <p className="text-center text-sm text-[var(--muted)]">
              En producción usa Google para iniciar sesión.
            </p>
          )}
        </div>

        <p className="text-center text-[13px] text-[var(--muted)]">
          <Link
            href="/"
            className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
          >
            Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
