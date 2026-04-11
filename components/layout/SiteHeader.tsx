import { auth } from "@/auth";
import { OpenSpotLogo } from "@/components/brand/OpenSpotLogo";
import { SiteHeaderNav } from "@/components/layout/SiteHeaderNav";
import { isAdminEmail } from "@/lib/admin/isAdmin";

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = isAdminEmail(session?.user?.email);
  const u = session?.user;

  const navUser =
    u?.id != null
      ? {
          firstName:
            u.name?.split(/\s+/)[0] ??
            u.email?.split("@")[0] ??
            "Usuario",
          name: u.name,
          email: u.email ?? null,
          image: u.image ?? null,
          planLabel: u.planLabel ?? "Free",
          quotaHeadline: u.quotaHeadline ?? "",
          isAdmin,
        }
      : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-bg)]/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent" />
      <div className="mx-auto flex h-[3.75rem] max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:gap-6 sm:px-6">
        <OpenSpotLogo iconSize={32} />
        <SiteHeaderNav user={navUser} />
      </div>
    </header>
  );
}
