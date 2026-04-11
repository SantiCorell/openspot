import type { BlogPost } from "./types";

export const BLOG_POSTS_A: BlogPost[] = [
  {
    slug: "guia-abrir-bar-espana-datos-ubicacion",
    title: "Guía para abrir un bar en España: ubicación con datos, no a ojo",
    excerpt:
      "Cómo combinar padrón INE, competencia real y presupuesto antes de firmar un local. Checklist para hosteleros que quieren convertir visitas en caja.",
    publishedAt: "2026-03-18",
    readTimeMin: 14,
    category: "Hostelería",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Interior de bar con ambiente cálido y barra iluminada",
    blocks: [
      {
        type: "p",
        text: "Abrir un bar sigue siendo uno de los proyectos más emocionantes —y más arriesgados— del retail en España. La diferencia entre un local que arranca con cola los viernes y otro que cierra a los ocho meses suele estar en tres decisiones tomadas antes de pagar la fianza: dónde estás en el mapa, cuánta competencia soporta el barrio y si tu ticket medio encaja con el gasto fijo del local.",
      },
      {
        type: "h2",
        text: "Por qué el “sitio bonito” no basta",
      },
      {
        type: "p",
        text: "Una terraza soleada o una calle peatonal no garantizan rentabilidad. Lo que importa es la densidad de demanda compatible con tu propuesta (turismo rápido vs. vecindario recurrente), la presión del alquiler por metro cuadrado en esa micromanzana y cuántos establecimientos similares compiten por el mismo bolsillo. Sin números, estás apostando; con ellos, priorizas.",
      },
      {
        type: "ul",
        items: [
          "Padrón municipal (INE): masa de población que justifica apertura y horarios.",
          "Capas de mercado: afluencia modelada, rotación de locales y saturación por categoría.",
          "Coste mensual modelo: alquiler + personal + licencias frente a ingresos estimados por zona.",
        ],
      },
      {
        type: "h2",
        text: "El error de copiar el bar de moda de otra ciudad",
      },
      {
        type: "p",
        text: "Lo que funciona en el centro de Madrid no se traduce automáticamente a un pueblo costero o a un polígono residencial. Cada municipio tiene un techo de gasto hostelería distinto y una estacionalidad propia. Un informe de ubicación debe leerse como un mapa de oportunidad relativa: no busca “el mejor bar del mundo”, sino el mejor encaje para tu modelo en ese territorio.",
      },
      {
        type: "p",
        text: "Antes de invertir, cruza siempre el presupuesto total (CAPEX + colchón de tesorería) con el alquiler medio de locales comparables y el nivel de competencia que el modelo detecta en radio útil. Si el margen teórico no cierra en papel, no lo cerrará en caja.",
      },
      {
        type: "h2",
        text: "Checklist ejecutiva antes de firmar",
      },
      {
        type: "ul",
        items: [
          "Tres escenarios de facturación (conservador, base, optimista) y qué ocurre si llegas solo al 70 % del base.",
          "Plan B de horario: ¿el bar sobrevive solo con cenas o necesitas mediodía?",
          "Cláusulas de salida en el contrato de arrendamiento y inversión amortizable en meses, no en años infinitos.",
        ],
      },
      {
        type: "p",
        text: "OpenSpot está pensado para que no tengas que montar esta hoja de cálculo desde cero: eliges municipio, tipo de negocio y presupuesto, y recibes zonas puntuadas más un informe en lenguaje claro para socios o entidad financiera.",
      },
      {
        type: "cta",
        title: "Pásalo a datos en minutos",
        text: "Genera un estudio de ubicación con mapa, competencia y narrativa ejecutiva para tu bar.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Analizar mi municipio",
      },
    ],
  },
  {
    slug: "gimnasio-local-comercial-rentabilidad-municipio",
    title: "Gimnasio o box: cómo elegir municipio y local sin quemar el capital",
    excerpt:
      "Superficie, altura libre, aparcamiento y competencia de bajo coste. Guía para founders de fitness que quieren números antes del arquitecto.",
    publishedAt: "2026-03-12",
    readTimeMin: 13,
    category: "Deporte",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Sala de entrenamiento con equipamiento moderno",
    blocks: [
      {
        type: "p",
        text: "Un gimnasio boutique no compite solo con otros gimnasios: compite con la suscripción low-cost a diez minutos, con el running al aire libre y con la falta de tiempo del vecindario. Por eso la ubicación no es “cerca de casa”, sino el punto donde la combinación de renta por metro cuadrado, población con poder adquisitivo compatible y hueco de oferta te permite sobrevivir los primeros veinticuatro meses.",
      },
      {
        type: "h2",
        text: "M² útiles vs. m² de titularidad comercial",
      },
      {
        type: "p",
        text: "El modelo económico de fitness premia la ocupación de sala y la retención. Un local demasiado grande dispara alquiler y climatización; uno pequeño limita aforo y mix de clases. La decisión óptima depende del mix de municipio: en núcleos densos puedes compensar menos superficie con horarios más apretados; en periferia sueles necesitar parking y vestuarios amplios.",
      },
      {
        type: "p",
        text: "Cuando compares zonas, mira siempre el coste mensual total estimado (alquiler + personal mínimo + licencias) frente a un ticket medio de membresía realista para esa zona, no el de tu marca ideal.",
      },
      {
        type: "h2",
        text: "Competencia que no aparece en Google como “gimnasio”",
      },
      {
        type: "p",
        text: "Crossfit, pilates, spinning de cadena y apps de entrenamiento compiten por el mismo minuto libre del usuario. Un buen análisis cruza densidad de oferta deportiva con patrón de afluencia y saturación del sector, no solo el recuento de pins con la palabra “gym”.",
      },
      {
        type: "ul",
        items: [
          "Radio de captación real (coche, transporte, hábito del barrio).",
          "Estacionalidad: costa, campus universitario, oficinas vacías en agosto.",
          "Hueco horario: ¿hay demanda insatisfecha a primera hora o a mediodía?",
        ],
      },
      {
        type: "p",
        text: "Si vas a presentar el plan a un inversor o banco, necesitas que la narrativa conecte superficie, competencia y escenarios de ingreso. OpenSpot genera esa estructura a partir de datos normalizados por municipio.",
      },
      {
        type: "cta",
        title: "Modela tu box con contexto territorial",
        text: "Selecciona municipio, presupuesto y vertical fitness para ver zonas y márgenes orientativos.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Estudio para mi gimnasio",
      },
    ],
  },
  {
    slug: "padron-ine-datos-mercado-elegir-local",
    title: "Padrón INE y datos de mercado: cómo leerlos juntos al elegir local",
    excerpt:
      "El INE te dice cuántas personas hay; el mercado te dice si gastan donde tú quieres. Evita la trampa de confundir población con demanda.",
    publishedAt: "2026-03-05",
    readTimeMin: 12,
    category: "Datos",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Gráficos y análisis en pantalla",
    blocks: [
      {
        type: "p",
        text: "El padrón municipal es la foto oficial de residentes: imprescindible para dimensionar si hay “suficiente gente” en un radio razonable. Pero la población no es la misma cosa que el gasto retail o hostelería: un municipio con muchos habitantes y poco poder adquisitivo concentrado puede generar menos ticket medio que otro más pequeño con perfil alto.",
      },
      {
        type: "h2",
        text: "Qué aporta cada capa de datos",
      },
      {
        type: "p",
        text: "Cuando cruzas padrón INE con señales de afluencia, competencia y rentas orientativas de locales, dejas de trabajar con un solo número mágico y pasas a un mapa de oportunidad. Ese es el salto que separa una decisión defendible ante socios de una intuición difícil de explicar.",
      },
      {
        type: "ul",
        items: [
          "INE: escala y crecimiento demográfico de referencia oficial.",
          "Datos propios agregados: normalización entre municipios y verticales.",
          "Señales de entorno: competidores, rotación y presión de suelo.",
        ],
      },
      {
        type: "h2",
        text: "Errores frecuentes al comparar pueblos",
      },
      {
        type: "p",
        text: "Comparar solo habitantes entre un destino turístico y un dormitorio sin ajustar estacionalidad lleva a sobredimensionar aperturas en verano o infradimensionar servicios de proximidad. El informe debe explicitar qué parte del contexto es “estructural” (padrón) y qué parte es “dinámica” (patrones de tráfico y competencia).",
      },
      {
        type: "p",
        text: "OpenSpot integra ambas familias de señales para que cada búsqueda devuelva un texto ejecutivo alineado con los números, no un volcado de tablas incomprensibles.",
      },
      {
        type: "cta",
        title: "Cruza INE + mercado en un solo informe",
        text: "Prueba el analizador con tu municipio y tipo de negocio.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Generar informe",
      },
    ],
  },
  {
    slug: "saturacion-hosteleria-invertir-antes",
    title: "Saturación en hostelería: qué mirar antes de invertir un euro",
    excerpt:
      "Índices, competencia y renta: cómo detectar cuándo el mercado ya no premia otro local igual y qué hacer al respecto.",
    publishedAt: "2026-02-28",
    readTimeMin: 11,
    category: "Hostelería",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Restaurante con mesas servidas",
    blocks: [
      {
        type: "p",
        text: "La saturación no es solo “hay muchos bares en la calle”. Es la combinación de oferta similar, ticket medio presionado a la baja y costes fijos que suben con el alquiler. Un barrio puede aguantar mucha hostelería si los modelos están diferenciados; revienta cuando todos compiten por el mismo consumo de copa barata o menú del día idéntico.",
      },
      {
        type: "h2",
        text: "Señales de alerta temprana",
      },
      {
        type: "ul",
        items: [
          "Rotación alta de locales con el mismo concepto en menos de dos años.",
          "Promociones agresivas permanentes en un radio corto.",
          "Alquiler por m² que solo cuadra con facturación de fin de semana todo el año.",
        ],
      },
      {
        type: "p",
        text: "Un índice de saturación agregado ayuda a comparar barrios dentro del mismo municipio y a comunicar el riesgo a quien pone el capital. No sustituye visitar el territorio, pero evita sorpresas obvias que solo se ven cuando ya has pagado traspaso.",
      },
      {
        type: "h2",
        text: "Estrategias cuando el barrio está “lleno”",
      },
      {
        type: "p",
        text: "Diferenciación dura (producto, horario, experiencia), micromercados colindantes menos explotados o formatos con menor superficie y mayor rotación. El dato te dice dónde está el hueco; el equipo ejecuta el concepto.",
      },
      {
        type: "cta",
        title: "Ve saturación y zonas en un clic",
        text: "Abre un análisis con tu ciudad y vertical de hostelería.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Analizar saturación",
      },
    ],
  },
  {
    slug: "alquiler-local-m2-espana-referencias",
    title: "Alquiler de local en España: cuánto pagar por m² sin romper el modelo",
    excerpt:
      "Referencias orientativas, sensibilidad al alquiler y cómo encajar personal y licencias en la misma hoja. Guía para no firmar un contrato que te coma el margen.",
    publishedAt: "2026-02-20",
    readTimeMin: 12,
    category: "Retail",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Espacio de oficina o local diáfano",
    blocks: [
      {
        type: "p",
        text: "El alquiler es el coste fijo que más duele cuando las ventas tardan en arrancar. Por eso conviene trabajar siempre con un rango de renta por metro cuadrado coherente con el municipio y el uso (bar, retail, servicios), no con el anuncio más barato o más caro del portal ese día.",
      },
      {
        type: "h2",
        text: "Del anuncio al escenario conservador",
      },
      {
        type: "p",
        text: "Los portales muestran oferta puntual; un modelo de negocio necesita mediana o rango por zona. Cuando integras renta orientativa con superficie típica de tu vertical, obtienes alquiler mensual modelo —una cifra que puedes estresar al -20 % de ingresos para ver si el local sigue siendo viable.",
      },
      {
        type: "ul",
        items: [
          "Suma alquiler + comunidad + IBI repercutido si aplica.",
          "Incluye personal mínimo viable y licencias antes de declarar “cuadra”.",
          "Reserva colchón de tesorería de varios meses; el INE no paga facturas, el caja sí.",
        ],
      },
      {
        type: "p",
        text: "OpenSpot muestra costes mensuales estimados por zona para que compares escenarios sin reconstruir hojas cada vez que cambias de barrio.",
      },
      {
        type: "cta",
        title: "Estima costes por zona",
        text: "Lanza un análisis con tu presupuesto y tipo de negocio.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Ver costes modelo",
      },
    ],
  },
  {
    slug: "franquicia-analizar-municipio-antes-firmar",
    title: "Franquicia: por qué debes analizar el municipio antes de firmar el local",
    excerpt:
      "El manual de marca no sustituye el territorio. Checklist para franquiciados que quieren negociar fees y exclusivas con datos en la mano.",
    publishedAt: "2026-02-12",
    readTimeMin: 10,
    category: "Estrategia",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Equipo de trabajo en reunión",
    blocks: [
      {
        type: "p",
        text: "La franquicia aporta marca y proceso; el franquiciado asume riesgo local. Si el zómino exclusivo no está alineado con la capacidad real del municipio, puedes pagar royalties sobre una base de demanda que no existe o competir en un punto ya sobredimensionado.",
      },
      {
        type: "h2",
        text: "Qué llevar a la reunión con la central",
      },
      {
        type: "ul",
        items: [
          "Población y dinámica del municipio objetivo (no solo “hay X habitantes”).",
          "Mapa de competencia directa e indirecta en radio acordado.",
          "Escenarios de facturación y punto muerto mensual con alquiler modelo.",
        ],
      },
      {
        type: "p",
        text: "Un informe claro mejora la negociación de condiciones y reduce fricción con bancos. OpenSpot está pensado para producir ese documento rápidamente.",
      },
      {
        type: "cta",
        title: "Documenta el territorio",
        text: "Genera un estudio exportable para central o banco.",
        href: "/login?callbackUrl=/analyze",
        buttonLabel: "Analizar municipio",
      },
    ],
  },
];
