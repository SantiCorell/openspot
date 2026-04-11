import { siteBaseUrl } from "@/lib/seo/siteBaseUrl";

/** Organization + WebSite (Schema.org) para rich results / Knowledge Graph. */
export function SiteJsonLd() {
  const base = siteBaseUrl();
  const desc =
    "Estudios de viabilidad y ubicación en España con datos INE, competencia modelada e informes con IA para abrir negocio.";

  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: "OpenSpot",
        url: base,
        description: desc,
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        name: "OpenSpot",
        url: base,
        description: desc,
        inLanguage: "es-ES",
        publisher: { "@id": `${base}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
