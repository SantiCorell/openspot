/**
 * URL canónica del sitio (sin barra final). Usar en sitemap, robots, JSON-LD y enlaces absolutos SEO.
 * En producción define NEXT_PUBLIC_SITE_URL (p. ej. https://www.openspot.es).
 */
export function siteBaseUrl(): string {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return u.replace(/\/$/, "");
}

export function siteBaseUrlAsUrl(): URL {
  try {
    return new URL(siteBaseUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}
