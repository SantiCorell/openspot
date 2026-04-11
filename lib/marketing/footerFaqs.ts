export interface FooterFaq {
  question: string;
  answer: string;
}

/** FAQs visibles + JSON-LD (alinear respuestas con el schema). */
export const FOOTER_FAQS: FooterFaq[] = [
  {
    question: "¿Qué es OpenSpot?",
    answer:
      "OpenSpot es una plataforma de inteligencia de ubicación para España: parte del padrón municipal oficial (INE) y lo cruza con millones de datos propios en bases analíticas actualizadas (afluencia, competencia, mercado), motores económicos por tipo de negocio e informes con IA para decidir dónde invertir con más fundamento.",
  },
  {
    question: "¿De dónde salen los datos?",
    answer:
      "Integramos fuentes estadísticas oficiales (INE y referencias públicas), nuestra propia base con millones de puntos de datos y series históricas que mantenemos al día, más señales de mercado (tráfico, competencia, rentas orientativas). Todo se normaliza en una capa única para que cada informe sea comparable entre municipios.",
  },
  {
    question: "¿Puedo analizar cualquier municipio de España?",
    answer:
      "Sí. El motor cubre el territorio municipal español con referencias de población y contexto económico. En núcleos muy grandes afinamos con microzonas; en el resto, el informe se articula en ámbitos urbanísticos y de competencia representativos.",
  },
  {
    question: "¿Qué incluye un informe completo?",
    answer:
      "Resumen ejecutivo con IA, puntuación por zonas, estimación de costes e ingresos, índices de saturación y competencia, referencias de locales orientativas y la narrativa de datos que respalda la recomendación — lista para presentar a inversores o socios.",
  },
  {
    question: "¿Cuánto cuesta usar OpenSpot?",
    answer:
      "Hay un plan gratuito con búsquedas incluidas, planes Pro con cupo mensual y créditos extra, y Enterprise con más volumen, comparador municipal avanzado y soporte. Consulta la página de precios para el detalle actual.",
  },
  {
    question: "¿Qué aporta el plan Enterprise?",
    answer:
      "Más búsquedas mensuales, mejor precio por búsqueda adicional y el comparador municipal: contrasta municipios con datos de padrón y estructura demográfica para ver oportunidad relativa frente a núcleos saturados.",
  },
];

export function buildFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FOOTER_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OpenSpot",
    description:
      "Plataforma de inteligencia de ubicación y viabilidad de negocio para España: INE y padrón oficial más millones de datos propios en bases actualizadas, modelos económicos e informes con IA.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXTAUTH_URL ??
      "https://openspot.es",
    areaServed: {
      "@type": "Country",
      name: "España",
    },
  };
}
