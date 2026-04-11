/**
 * Motor SEO — genera metadatos y JSON-LD para páginas programáticas.
 * (Ampliar con ISR y plantillas por intención de búsqueda.)
 */

export interface SeoPageSpec {
  path: string;
  title: string;
  description: string;
  city: string;
  intent: "donde_abrir" | "mejores_negocios" | "abrir_tipo";
  businessType?: string;
}

export function buildJsonLdArticle(spec: SeoPageSpec) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: spec.title,
    description: spec.description,
    inLanguage: "es-ES",
    about: {
      "@type": "Place",
      name: spec.city,
    },
  };
}

export function buildProgrammaticDescription(spec: SeoPageSpec): string {
  return spec.description;
}
