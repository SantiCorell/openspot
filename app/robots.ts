import type { MetadataRoute } from "next";

import { siteBaseUrl } from "@/lib/seo/siteBaseUrl";

export default function robots(): MetadataRoute.Robots {
  const base = siteBaseUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/admin/", "/dashboard", "/dashboard/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
