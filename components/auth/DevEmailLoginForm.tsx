import { signIn } from "@/auth";

import { MailIcon } from "@/components/brand/MailIcon";

/** Solo se renderiza en desarrollo (sin contraseña). */
export function DevEmailLoginForm() {
  if (process.env.NODE_ENV !== "development") return null;

  async function devSignIn(formData: FormData) {
    "use server";
    const email = formData.get("email");
    if (typeof email !== "string" || !email.includes("@")) return;
    await signIn("dev-email", { email, redirectTo: "/dashboard" });
  }

  return (
    <div className="mt-6 border-t border-dashed border-[var(--border)] pt-6">
      <p className="text-center text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
        Solo desarrollo — email sin contraseña
      </p>
      <form action={devSignIn} className="mt-3 space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="demo@local.dev"
          className="os-input text-[13px]"
          autoComplete="email"
        />
        <button
          type="submit"
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-transparent px-3 text-[13px] font-medium text-[var(--muted)] hover:bg-[var(--muted-bg)]"
        >
          <MailIcon className="h-4 w-4 opacity-70" />
          Entrar (dev)
        </button>
      </form>
    </div>
  );
}
