import type { BlogPost } from "@/lib/content/blog/types";
import { siteBaseUrl } from "@/lib/seo/siteBaseUrl";

export function BlogPostingJsonLd({ post }: { post: BlogPost }) {
  const base = siteBaseUrl();
  const articleUrl = `${base}/blog/${post.slug}`;
  const isoDate = post.publishedAt.includes("T")
    ? post.publishedAt
    : `${post.publishedAt}T12:00:00.000+01:00`;

  const payload = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: isoDate,
    image: [post.image],
    author: {
      "@type": "Organization",
      name: "OpenSpot",
      url: base,
    },
    publisher: { "@id": `${base}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    inLanguage: "es-ES",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
