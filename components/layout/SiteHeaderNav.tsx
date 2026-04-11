"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { signOutAction } from "@/app/actions/auth";

const linkClass =
  "rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--muted)] transition-colors hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]";

const menuItemClass =
  "flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] text-[var(--foreground)] transition-colors hover:bg-[var(--muted-bg)]";

export type HeaderNavUser = {
  firstName: string;
  name: string | null | undefined;
  email: string | null;
  image: string | null;
  planLabel: string;
  quotaHeadline: string;
  isAdmin: boolean;
};

type Props = {
  user: HeaderNavUser | null;
};

function initialsFromUser(name: string | null | undefined, email: string | null): string {
  const n = name?.trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const local = email?.split("@")[0]?.trim();
  if (local && local.length >= 2) return local.slice(0, 2).toUpperCase();
  if (local) return (local[0] + local[0]).toUpperCase();
  return "OS";
}

function UserAvatar({
  name,
  email,
  image,
  size,
}: {
  name: string | null | undefined;
  email: string | null;
  image: string | null;
  size: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "h-11 w-11 text-[15px]" : size === "md" ? "h-9 w-9 text-[13px]" : "h-8 w-8 text-[11px]";
  const label = initialsFromUser(name, email);
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        width={size === "lg" ? 44 : size === "md" ? 36 : 32}
        height={size === "lg" ? 44 : size === "md" ? 36 : 32}
        className={`${dim} shrink-0 rounded-full object-cover ring-2 ring-[var(--background)]`}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold tracking-tight text-white shadow-inner ring-2 ring-[var(--background)]`}
      aria-hidden
    >
      {label}
    </div>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon({
  children,
  className = "text-indigo-600 dark:text-indigo-400",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-500/10 ${className}`}
      aria-hidden
    >
      {children}
    </span>
  );
}

function Svg({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

export function SiteHeaderNav({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const isLoggedIn = user != null;

  const publicNavLinks = (
    <>
      <Link href="/#como-funciona" className={linkClass} onClick={() => setOpen(false)}>
        Cómo funciona
      </Link>
      <Link href="/producto" className={linkClass} onClick={() => setOpen(false)}>
        Producto
      </Link>
      <Link href="/pricing" className={linkClass} onClick={() => setOpen(false)}>
        Precios
      </Link>
      <Link href="/blog" className={linkClass} onClick={() => setOpen(false)}>
        Blog
      </Link>
      <Link href="/contacto" className={linkClass} onClick={() => setOpen(false)}>
        Contacto
      </Link>
    </>
  );

  const accountLinks =
    isLoggedIn && user ? (
      <>
        <Link href="/dashboard" className={menuItemClass} onClick={() => setMenuOpen(false)} role="menuitem">
          <MenuIcon>
            <Svg d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />
          </MenuIcon>
          <span>
            <span className="block font-medium">Mi panel</span>
            <span className="text-[11px] text-[var(--muted)]">Historial y resumen</span>
          </span>
        </Link>
        <Link href="/comparador" className={menuItemClass} onClick={() => setMenuOpen(false)} role="menuitem">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
            aria-hidden
          >
            <Svg
              d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4M3 12h18"
              className="text-cyan-700 dark:text-cyan-300"
            />
          </span>
          <span>
            <span className="block font-medium">Comparar zonas</span>
            <span className="text-[11px] text-[var(--muted)]">Varios municipios a la vez</span>
          </span>
        </Link>
        <Link href="/analyze" className={menuItemClass} onClick={() => setMenuOpen(false)} role="menuitem">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--accent)]/15"
            aria-hidden
          >
            <Svg
              d="M3 3v18h18 M7 12h4m4 0h4M7 8h10M7 16h6"
              className="text-[var(--accent)]"
            />
          </span>
          <span>
            <span className="block font-medium">Nuevo análisis</span>
            <span className="text-[11px] text-[var(--muted)]">Informe completo de ubicación</span>
          </span>
        </Link>
        <div className="my-1 border-t border-[var(--border)]" role="separator" />
        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Cuenta
        </p>
        <Link href="/dashboard/perfil" className={menuItemClass} onClick={() => setMenuOpen(false)} role="menuitem">
          <MenuIcon>
            <Svg d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
          </MenuIcon>
          <span className="font-medium">Perfil y datos</span>
        </Link>
        <Link href="/dashboard/facturacion" className={menuItemClass} onClick={() => setMenuOpen(false)} role="menuitem">
          <MenuIcon>
            <Svg d="M4 2v20M4 6h16M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M8 10h8 M8 14h8" />
          </MenuIcon>
          <span className="font-medium">Pagos y facturas</span>
        </Link>
        {user.isAdmin ? (
          <Link
            href="/admin"
            className={`${menuItemClass} font-semibold text-indigo-600 dark:text-indigo-300`}
            onClick={() => setMenuOpen(false)}
            role="menuitem"
          >
            <MenuIcon>
              <Svg d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </MenuIcon>
            <span>Panel admin</span>
          </Link>
        ) : null}
      </>
    ) : null;

  const desktopUserMenu = isLoggedIn ? (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        ref={menuButtonRef}
        type="button"
        id={`${menuId}-trigger`}
        className="flex max-w-[15rem] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] py-1 pl-1.5 pr-2.5 text-left shadow-sm transition-[border-color,box-shadow,transform] hover:border-[var(--border-strong)] hover:shadow-md active:scale-[0.99]"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-controls={menuOpen ? `${menuId}-menu` : undefined}
        onClick={() => setMenuOpen((m) => !m)}
      >
        <UserAvatar name={user.name} email={user.email} image={user.image} size="sm" />
        <span className="min-w-0 flex-1 py-0.5">
          <span className="block truncate text-[13px] font-semibold text-[var(--foreground)]">
            {user.firstName}
          </span>
          <span className="block truncate text-[10px] text-[var(--muted)]">
            {user.planLabel}
          </span>
        </span>
        <ChevronDown open={menuOpen} />
      </button>
      {menuOpen ? (
        <div
          id={`${menuId}-menu`}
          role="menu"
          aria-labelledby={`${menuId}-trigger`}
          className="absolute right-0 z-[60] mt-2 w-[min(100vw-2rem,20rem)] origin-top-right overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] py-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <div className="border-b border-[var(--border)] px-4 py-3">
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} email={user.email} image={user.image} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[var(--foreground)]">
                  {user.name?.trim() || user.firstName}
                </p>
                {user.email ? (
                  <p className="truncate text-[12px] text-[var(--muted)]">{user.email}</p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                    {user.planLabel}
                  </span>
                  {user.quotaHeadline ? (
                    <span
                      className="max-w-full truncate rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--muted)]"
                      title={user.quotaHeadline}
                    >
                      {user.quotaHeadline}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="py-1">{accountLinks}</div>
          <div className="border-t border-[var(--border)] pt-1">
            <form action={signOutAction}>
              <button
                type="submit"
                role="menuitem"
                className={`${menuItemClass} text-red-700 hover:bg-red-500/5 dark:text-red-400`}
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-500/10"
                  aria-hidden
                >
                  <Svg d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" className="text-red-600 dark:text-red-400" />
                </span>
                <span className="font-semibold">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  ) : null;

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
      <nav className="hidden min-w-0 items-center gap-0.5 md:flex" aria-label="Principal">
        {publicNavLinks}
      </nav>

      {desktopUserMenu}

      <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-sm"
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <span className="text-lg leading-none" aria-hidden>
              ×
            </span>
          ) : (
            <span className="flex flex-col gap-1" aria-hidden>
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
          )}
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-4 top-[3.75rem] z-50 w-[min(100vw-2rem,20rem)] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-xl md:hidden">
            {isLoggedIn ? (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-gradient-to-br from-indigo-500/[0.07] to-transparent p-3">
                <UserAvatar name={user.name} email={user.email} image={user.image} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--foreground)]">
                    {user.name?.trim() || user.firstName}
                  </p>
                  <p className="truncate text-[11px] text-[var(--muted)]">{user.email}</p>
                  <p className="mt-1 text-[10px] font-medium text-[var(--muted)]">
                    {user.planLabel}
                    {user.quotaHeadline ? ` · ${user.quotaHeadline}` : ""}
                  </p>
                </div>
              </div>
            ) : null}
            <nav className="flex flex-col gap-0.5" aria-label="Principal móvil">
              <Link href="/#como-funciona" className={linkClass} onClick={() => setOpen(false)}>
                Cómo funciona
              </Link>
              <Link href="/producto" className={linkClass} onClick={() => setOpen(false)}>
                Producto
              </Link>
              <Link href="/pricing" className={linkClass} onClick={() => setOpen(false)}>
                Precios
              </Link>
              <Link href="/blog" className={linkClass} onClick={() => setOpen(false)}>
                Blog
              </Link>
              <Link href="/contacto" className={linkClass} onClick={() => setOpen(false)}>
                Contacto
              </Link>
            </nav>
            {isLoggedIn ? (
              <>
                <p className="mb-1 mt-4 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Tu cuenta
                </p>
                <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/30 p-1">
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-[var(--card)]"
                    onClick={() => setOpen(false)}
                  >
                    Mi panel
                  </Link>
                  <Link
                    href="/comparador"
                    className="rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-[var(--card)]"
                    onClick={() => setOpen(false)}
                  >
                    Comparar zonas
                  </Link>
                  <Link
                    href="/dashboard/perfil"
                    className="rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-[var(--card)]"
                    onClick={() => setOpen(false)}
                  >
                    Perfil y datos
                  </Link>
                  <Link
                    href="/dashboard/facturacion"
                    className="rounded-lg px-3 py-2.5 text-[13px] font-medium hover:bg-[var(--card)]"
                    onClick={() => setOpen(false)}
                  >
                    Pagos y facturas
                  </Link>
                  {user.isAdmin ? (
                    <Link
                      href="/admin"
                      className="rounded-lg px-3 py-2.5 text-[13px] font-semibold text-indigo-600 hover:bg-[var(--card)] dark:text-indigo-300"
                      onClick={() => setOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : null}
                </div>
              </>
            ) : null}
            <div className="mt-3 border-t border-[var(--border)] pt-3">
              {isLoggedIn ? (
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-red-700 hover:bg-red-500/5 dark:text-red-400"
                  >
                    Cerrar sesión
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-xl px-3 py-2.5 text-[13px] font-semibold hover:bg-[var(--muted-bg)]"
                  onClick={() => setOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="mt-1 block rounded-xl px-3 py-2.5 text-[13px] font-medium text-[var(--muted)] hover:bg-[var(--muted-bg)]"
                  onClick={() => setOpen(false)}
                >
                  Crear cuenta
                </Link>
              )}
              <Link
                href="/analyze"
                className="mt-2 flex h-11 items-center justify-center rounded-full bg-[var(--accent)] text-[13px] font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Analizar
              </Link>
            </div>
          </div>
        </>
      ) : null}

      <div className="hidden items-center gap-2 md:flex md:pl-1">
        {!isLoggedIn ? (
          <>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--foreground)] shadow-sm transition-[box-shadow,transform] hover:border-[var(--border-strong)] active:scale-[0.98]"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Registro
            </Link>
          </>
        ) : null}
        <Link
          href="/analyze"
          className="inline-flex items-center rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm shadow-indigo-500/20 transition-[filter,transform] hover:brightness-110 active:scale-[0.98]"
        >
          Analizar
        </Link>
      </div>
    </div>
  );
}
