"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInPasswordAction } from "@/app/actions/auth";

import { MailIcon } from "@/components/brand/MailIcon";

export function LoginPasswordForm() {
  const [state, formAction, pending] = useActionState(signInPasswordAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.ok === false ? (
        <p className="rounded-xl border border-red-500/25 bg-red-500/5 px-3 py-2 text-[13px] text-red-700 dark:text-red-300">
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-[12px] font-medium text-[var(--muted)]">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="os-input"
        />
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-[12px] font-medium text-[var(--muted)]"
        >
          Contraseña
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="os-input"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--muted-bg)] px-4 py-3 text-[15px] font-semibold text-[var(--foreground)] shadow-sm transition-[background-color,transform] hover:bg-[var(--border)]/40 active:scale-[0.992] disabled:opacity-50 dark:hover:bg-zinc-800"
      >
        <MailIcon className="opacity-70" />
        {pending ? "Entrando…" : "Entrar con email y contraseña"}
      </button>
      <p className="text-center text-[13px] text-[var(--muted)]">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
