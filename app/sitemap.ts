import type { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/lib/content/blog";
import { siteBaseUrl } from "@/lib/seo/siteBaseUrl";

type StaticEntry = { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number };

/** Solo URLs públicas indexables (sin login ni herramientas que redirigen a auth). */
const STATIC_ROUTES: StaticEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.95 },
  { path: "/producto", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.85 },
  { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.35 },
  { path: "/producto/informes", changeFrequency: "monthly", priority: 0.82 },
  { path: "/producto/datos", changeFrequency: "monthly", priority: 0.82 },
  { path: "/producto/resultados", changeFrequency: "monthly", priority: 0.82 },
  { path: "/producto/mapas", changeFrequency: "monthly", priority: 0.82 },
  { path: "/producto/motor", changeFrequency: "monthly", priority: 0.82 },
  { path: "/producto/comparador", changeFrequency: "monthly", priority: 0.82 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteBaseUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  for (const post of BLOG_POSTS) {
    const last = new Date(post.publishedAt);
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: Number.isNaN(last.getTime()) ? now : last,
      changeFrequency: "monthly",
      priority: 0.78,
    });
  }

  return entries;
}
