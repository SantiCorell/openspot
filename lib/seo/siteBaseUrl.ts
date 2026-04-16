/**
 * URL canónica del sitio (sin barra final). Usar en sitemap, robots, JSON-LD y metadataBase.
 *
 * No usar `VERCEL_URL` como base: es distinto en cada deployment (preview) y Google
 * rechaza esas URLs si el sitemap está asociado a tu dominio de producción.
 *
 * En Vercel define `NEXT_PUBLIC_SITE_URL` (p. ej. https://www.openspot.es) en Production
 * y, si quieres el mismo sitemap canónico en Preview, cópiala también en Preview o usa solo Production en GSC.
 */

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

function fromExplicitUrl(raw: string | undefined): string | null {
  const t = raw?.trim();
  if (!t) return null;
  try {
    const u = new URL(t);
    return stripTrailingSlash(`${u.protocol}//${u.host}`);
  } catch {
    return stripTrailingSlash(t);
  }
}

export function siteBaseUrl(): string {
  const explicit =
    fromExplicitUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    fromExplicitUrl(process.env.AUTH_URL) ??
    fromExplicitUrl(process.env.NEXTAUTH_URL);
  if (explicit) return explicit;

  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodHost && (process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview")) {
    return stripTrailingSlash(`https://${prodHost}`);
  }

  return "http://localhost:3000";
}

export function siteBaseUrlAsUrl(): URL {
  try {
    return new URL(siteBaseUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
