import type { BlogPost } from "./types";

export const BLOG_POSTS_B: BlogPost[] = [
  {
    slug: "retail-calle-centro-comercial-senales",
    title: "Retail en calle vs. centro comercial: señales de datos que importan",
    excerpt:
      "Tráfico peatonal, estacionalidad y coste por visita. Cómo leer el territorio cuando dudas entre escaparate urbano y unidad en parque comercial.",
    publishedAt: "2026-02-05",
    readTimeMin: 11,
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Pasillo de tienda de ropa",
    blocks: [
      {
        type: "p",
        text: "La calle te da visibilidad y narrativa de barrio; el centro comercial concentra flujo y servicios compartidos. La decisión no es estética, es económica: coste fijo por metro cuadrado, horarios de afluencia compatibles con tu margen y profundidad de surtido que puedes permitirte sin quiebras de stock.",
      },
      {
        type: "h2",
        text: "Qué mide un buen análisis territorial",
      },
      {
        type: "ul",
        items: [
          "Patrones de afluencia por franja horaria y día de la semana.",
          "Competencia de misma categoría y sustitutos (online incluido como presión).",
          "Sensibilidad del margen al alquiler: cuántas ventas extra necesitas si sube un 10 %.",
        ],
      },
      {
        type: "p",
        text: "OpenSpot orienta la conversación hacia zonas puntuadas y costes modelo para que compares municipios o, dentro del mismo, microentornos con lenguaje común.",
      },
      {
        type: "cta",
        title: "Compara escenarios retail",
        text: "Elige municipio, vertical retail y presupuesto.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Analizar retail",
      },
    ],
  },
  {
    slug: "informe-ubicacion-banco-inversor",
    title: "Informe de ubicación: qué debe entender tu banco o inversor en 5 minutos",
    excerpt:
      "Estructura recomendada: mercado, riesgo, números y plan B. Cómo evitar informes que nadie lee y acelerar due diligence.",
    publishedAt: "2026-01-28",
    readTimeMin: 13,
    category: "Financiación",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Documentos y planificación en mesa",
    blocks: [
      {
        type: "p",
        text: "Un inversor no quiere un ensayo literario: quiere saber si entiendes el mercado, si los números cierran en escenario conservador y qué harás si las ventas van un 20 % por debajo del plan. El informe de ubicación es la pieza que traduce el territorio a ese lenguaje.",
      },
      {
        type: "h2",
        text: "Bloques imprescindibles",
      },
      {
        type: "ul",
        items: [
          "Contexto municipal con población de referencia (INE) y señales de mercado.",
          "Zonas priorizadas con puntuación y por qué la primera no es “magia”, sino equilibrio riesgo/retorno.",
          "Costes e ingresos orientativos y supuestos explícitos.",
        ],
      },
      {
        type: "p",
        text: "OpenSpot genera narrativa ejecutiva con IA a partir de esas señales para que no empieces desde cero en el procesador de textos.",
      },
      {
        type: "h2",
        text: "Transparencia que genera confianza",
      },
      {
        type: "p",
        text: "Incluir limitaciones del modelo (estimaciones, necesidad de validación in situ) no debilita el proyecto: demuestra madurez. La diligencia comercial sigue siendo obligatoria; el informe acorta distancia entre idea y crédito.",
      },
      {
        type: "cta",
        title: "Genera un informe presentable",
        text: "Regístrate y obtén resumen + tablas + señales de datos.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Crear informe",
      },
    ],
  },
  {
    slug: "competencia-google-maps-radio-negocio",
    title: "Competencia en Google Maps: por qué el radio importa tanto como el pin",
    excerpt:
      "Cómo interpretar densidad de competidores sin obsesionarte con el contador. Radios útiles, categorías sustitutas y saturación real.",
    publishedAt: "2026-01-20",
    readTimeMin: 10,
    category: "Datos",
    image:
      "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Globo terráqueo y concepto de ubicación",
    blocks: [
      {
        type: "p",
        text: "Ver veinte pins de “restaurante” en el mapa no te dice si compites por el mismo cliente ni si el tráfico es compatible con tu ticket. El valor está en cruzar recuento con tipo de oferta, afluencia y presión de alquiler en esa micromanzana.",
      },
      {
        type: "h2",
        text: "Sustitutos invisibles",
      },
      {
        type: "p",
        text: "Dark kitchen, delivery de marca nacional y comida preparada de gran superficie compiten con la hostelería clásica sin aparecer como “tu categoría”. Un modelo de saturación por sector intenta capturar parte de esa presión agregada.",
      },
      {
        type: "ul",
        items: [
          "Ajusta el radio al modo de captación (peatonal, coche, delivery).",
          "Compara competencia entre zonas del mismo municipio, no solo entre ciudades.",
          "Cruza con coste fijo: mucha competencia con alquiler bajo es distinto de mucha competencia con alquiler alto.",
        ],
      },
      {
        type: "cta",
        title: "Ve competencia en contexto",
        text: "Analiza tu municipio y vertical con OpenSpot.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Ver análisis",
      },
    ],
  },
  {
    slug: "idea-al-local-tres-pasos-datos-openspot",
    title: "De la idea al local: tres pasos con datos (sin perder meses)",
    excerpt:
      "Registro, elección de municipio y negocio, informe accionable. Flujo pensado para founders que odian las hojas de cálculo eternas.",
    publishedAt: "2026-01-12",
    readTimeMin: 9,
    category: "Producto",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Dashboard con métricas",
    blocks: [
      {
        type: "p",
        text: "Muchos proyectos mueren en el limbo entre ilusión y Excel. OpenSpot condensa el flujo en tres acciones: autenticarte, definir dónde y qué quieres abrir, y consumir un informe que ya mezcla mapa, puntuaciones y texto ejecutivo.",
      },
      {
        type: "h2",
        text: "Paso 1 — Cuenta y plan",
      },
      {
        type: "p",
        text: "El plan gratuito permite probar el flujo; los planes de pago amplían volumen de búsquedas y comparadores. La idea es que la primera búsqueda ya te dé material para decidir si merece la pena seguir profundizando en ese municipio.",
      },
      {
        type: "h2",
        text: "Paso 2 — Municipio y vertical",
      },
      {
        type: "p",
        text: "El autocompletado apoya nombres oficiales INE para evitar errores de localización. La vertical (bar, farmacia, gimnasio…) calibra el motor económico y la lectura de saturación.",
      },
      {
        type: "h2",
        text: "Paso 3 — Informe y siguiente acción",
      },
      {
        type: "p",
        text: "Sales con zonas ordenadas, estimaciones de costes e ingresos y un resumen que puedes compartir. El siguiente paso siempre es validar en calle; el informe te dice dónde mirar primero.",
      },
      {
        type: "cta",
        title: "Empieza el flujo ahora",
        text: "Tres clics hasta tu primer informe completo.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Registrarse gratis",
      },
    ],
  },
  {
    slug: "turistico-vs-residencial-tipo-negocio",
    title: "Destino turístico vs. municipio residencial: cómo ajusta tu modelo de negocio",
    excerpt:
      "Estacionalidad, personal fijo y mix de costes. Guía para no proyectar agosto sobre doce meses de cuentas.",
    publishedAt: "2026-01-05",
    readTimeMin: 12,
    category: "Estrategia",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Playa y costa",
    blocks: [
      {
        type: "p",
        text: "Un negocio costero puede facturar en ocho semanas lo que otro urbano factura en trimestre, pero arrastra meses de estructura mínima. Si tu plan de caja asume reparto uniforme de ventas, el turismo te romperá la tesorería.",
      },
      {
        type: "h2",
        text: "Residencial: volumen estable, competencia de barrio",
      },
      {
        type: "p",
        text: "En dormitorios la clave es recurrencia y servicio de proximidad. Los picos son más suaves; la competencia se mide en hábito semanal. El alquiler puede ser más predecible, pero el crecimiento de ticket es más lento.",
      },
      {
        type: "h2",
        text: "Turístico: pico y valle",
      },
      {
        type: "ul",
        items: [
          "Personal variable y contratos acordes a temporada.",
          "Marketing concentrado en canales que traen visitante, no solo vecino.",
          "Stock y mermas ajustados a rotación rápida en verano.",
        ],
      },
      {
        type: "p",
        text: "Los datos de padrón y afluencia ayudan a contextualizar si tu municipio se comporta más como uno u otro arquetipo antes de fijar hipótesis de venta.",
      },
      {
        type: "cta",
        title: "Contextualiza tu municipio",
        text: "Lanza un análisis y lee el informe junto a la señal de datos.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Analizar ahora",
      },
    ],
  },
  {
    slug: "interpretar-puntuacion-zonas-estudio-openspot",
    title: "Cómo interpretar la puntuación de zonas en un estudio OpenSpot",
    excerpt:
      "Rentabilidad, competencia, saturación y recomendación: qué significa cada métrica y cómo no confundir ranking con garantía de éxito.",
    publishedAt: "2025-12-18",
    readTimeMin: 15,
    category: "Producto",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Equipo analizando pizarra",
    blocks: [
      {
        type: "p",
        text: "Un estudio automatizado prioriza zonas con un equilibrio entre margen teórico, presión competitiva y saturación del sector. Ninguna puntuación es una promesa de facturación: es una brújula para ordenar visitas comerciales y conversaciones con socios.",
      },
      {
        type: "h2",
        text: "Puntuación de rentabilidad (zona)",
      },
      {
        type: "p",
        text: "Resume el margen mensual estimado a partir de ingresos y costes modelo. Valores altos indican que, bajo los supuestos del motor, la zona deja más espacio entre ventas y gastos fijos. Siempre revisa las hipótesis de ticket y ocupación en el detalle del informe.",
      },
      {
        type: "h2",
        text: "Competencia y saturación",
      },
      {
        type: "p",
        text: "La competencia mide presión de rivales cercanos; la saturación refleja densidad relativa del sector en el modelo. Pueden moverse en direcciones distintas: poca competencia puntual pero mercado maduro, o muchos rivales pero en zona de tráfico extremo.",
      },
      {
        type: "h2",
        text: "Puntuación de recomendación",
      },
      {
        type: "p",
        text: "Es un compuesto ponderado orientado a “primero mira aquí”. Úsala para decidir el orden de visitas a inmobiliarias, no para eliminar barrios sin pisar la calle.",
      },
      {
        type: "h2",
        text: "Inversión orientativa",
      },
      {
        type: "p",
        text: "Aproxima CAPEX más colchón en función de tu presupuesto declarado y costes fijos de la zona. Es una guía de magnitud, no un presupuesto de obra detallado.",
      },
      {
        type: "p",
        text: "Para definiciones completas y ejemplos, visita la sección Producto → Entender resultados.",
      },
      {
        type: "cta",
        title: "Prueba las métricas con tu caso",
        text: "Genera un informe y contrasta las definiciones con tu municipio real.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Generar estudio",
      },
    ],
  },
];
