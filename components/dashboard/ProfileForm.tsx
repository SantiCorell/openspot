"use client";

import { useActionState } from "react";

import {
  updateProfileAction,
  type ProfileActionState,
} from "@/app/actions/profile";

const initial: ProfileActionState = { ok: true, message: "" };

type UserRow = {
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  bio: string | null;
};

export function ProfileForm({ user }: { user: UserRow }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={formAction} className="space-y-5">
      {state.ok && state.message ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-800 dark:text-emerald-200">
          {state.message}
        </div>
      ) : null}
      {!state.ok && state.message ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-800 dark:text-red-200">
          {state.message}
        </div>
      ) : null}

      <label className="block">
        <span className="text-[13px] font-medium text-[var(--foreground)]">
          Nombre completo <span className="text-red-500">*</span>
        </span>
        <input
          name="name"
          required
          maxLength={80}
          defaultValue={user.name ?? ""}
          className="os-input mt-2"
          autoComplete="name"
        />
        {!state.ok && state.fieldErrors?.name?.[0] ? (
          <span className="mt-1 block text-[12px] text-red-600">{state.fieldErrors.name[0]}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="text-[13px] font-medium text-[var(--foreground)]">Correo</span>
        <input
          value={user.email ?? ""}
          readOnly
          className="os-input mt-2 cursor-not-allowed opacity-80"
        />
        <span className="mt-1 block text-[12px] text-[var(--muted)]">
          Lo gestiona tu proveedor de acceso (p. ej. Google). No editable aquí.
        </span>
      </label>

      <label className="block">
        <span className="text-[13px] font-medium text-[var(--foreground)]">Teléfono</span>
        <input
          name="phone"
          type="tel"
          maxLength={40}
          defaultValue={user.phone ?? ""}
          className="os-input mt-2"
          autoComplete="tel"
          placeholder="+34 …"
        />
      </label>

      <label className="block">
        <span className="text-[13px] font-medium text-[var(--foreground)]">
          Empresa o proyecto
        </span>
        <input
          name="company"
          maxLength={120}
          defaultValue={user.company ?? ""}
          className="os-input mt-2"
          autoComplete="organization"
          placeholder="Nombre comercial, SL, marca…"
        />
      </label>

      <label className="block">
        <span className="text-[13px] font-medium text-[var(--foreground)]">
          Notas / contexto del negocio
        </span>
        <textarea
          name="bio"
          rows={5}
          maxLength={2000}
          defaultValue={user.bio ?? ""}
          className="os-input mt-2 min-h-[120px] resize-y"
          placeholder="Qué tipo de locales buscas, zonas de interés, timing aproximado…"
        />
        <span className="mt-1 block text-[12px] text-[var(--muted)]">
          Solo tú y el equipo OpenSpot con acceso admin; ayuda a contextualizar futuras mejoras.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-8 text-[14px] font-semibold text-[var(--background)] disabled:opacity-40"
      >
        {pending ? "Guardando…" : "Guardar perfil"}
      </button>
    </form>
  );
}
