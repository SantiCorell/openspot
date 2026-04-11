import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleGIcon } from "@/components/brand/GoogleGIcon";
import { OpenSpotLogo } from "@/components/brand/OpenSpotLogo";

import { signInGoogleAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

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
            Crear cuenta en OpenSpot
          </h1>
          <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-[var(--muted)]">
            Tres búsquedas gratis para probar el analizador. También puedes registrarte con Google.
          </p>
        </div>

        <div className="os-card p-5 shadow-lg shadow-indigo-500/[0.06] sm:p-8">
          <form action={signInGoogleAction} className="space-y-3">
            <button type="submit" className="os-google-btn min-h-[52px] text-[15px]">
              <GoogleGIcon className="shrink-0" />
              Registrarse con Google
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              <span className="bg-[var(--card)] px-3">o</span>
            </div>
          </div>

          <RegisterForm />
        </div>

        <p className="text-center text-[13px] text-[var(--muted)]">
          <Link
            href="/login"
            className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
          >
            Ya tengo cuenta
          </Link>
          {" · "}
          <Link href="/" className="underline-offset-4 hover:underline">
            Inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
