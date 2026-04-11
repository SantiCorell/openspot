import type { MetadataRoute } from "next";

import { getAllBlogSlugs } from "@/lib/content/blog";

function siteUrl(): string {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return u.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const last = new Date();

  const staticPaths = [
    "",
    "/pricing",
    "/producto",
    "/blog",
    "/contacto",
    "/legal/cookies",
    "/login",
    "/analyze",
    "/comparador",
    "/producto/informes",
    "/producto/datos",
    "/producto/resultados",
    "/producto/mapas",
    "/producto/motor",
    "/producto/comparador",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: last,
    changeFrequency: path === "" || path === "/blog" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/pricing" || path === "/analyze" ? 0.9 : 0.7,
  }));

  for (const slug of getAllBlogSlugs()) {
    entries.push({
      url: `${base}/blog/${slug}`,
      lastModified: last,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  return entries;
}
