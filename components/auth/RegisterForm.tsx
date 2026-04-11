"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction } from "@/app/actions/auth";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {state?.ok === false ? (
        <p className="rounded-xl border border-red-500/25 bg-red-500/5 px-3 py-2 text-[13px] text-red-700 dark:text-red-300">
          {state.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="reg-name" className="mb-1.5 block text-[12px] font-medium text-[var(--muted)]">
          Nombre
        </label>
        <input
          id="reg-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          maxLength={80}
          className="os-input"
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="mb-1.5 block text-[12px] font-medium text-[var(--muted)]">
          Email
        </label>
        <input
          id="reg-email"
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
          htmlFor="reg-password"
          className="mb-1.5 block text-[12px] font-medium text-[var(--muted)]"
        >
          Contraseña
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          maxLength={128}
          className="os-input"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[var(--foreground)] px-4 py-3 text-[15px] font-semibold text-[var(--background)] transition-[opacity,transform] hover:opacity-90 active:scale-[0.992] disabled:opacity-50"
      >
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
      <p className="text-center text-[13px] text-[var(--muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
