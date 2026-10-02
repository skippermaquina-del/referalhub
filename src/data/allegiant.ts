/**
 * Contenido y configuración del sitio de Allegiant Appliances Inc.
 *
 * Todo lo que el negocio tiene que confirmar o completar vive aquí arriba, en
 * `business`: mientras un dato sea `null` / vacío, la sección que lo muestra
 * simplemente no se renderiza (nada de cifras o reseñas inventadas).
 */

export type Lang = "en" | "es";

export const business = {
  name: "Allegiant Appliances Inc",
  phoneDisplay: "+1 (323) 578-4010",
  phoneHref: "+13235784010",
  /**
   * Enlaces de Google. Se sobreescriben con variables de entorno cuando el
   * perfil de Google Business esté verificado (ver `.env.example`). Mientras
   * tanto apuntan a una búsqueda, para que nunca sean un enlace roto.
   */
  reviewsUrl:
    process.env.NEXT_PUBLIC_ALLEGIANT_REVIEWS_URL ??
    "https://www.google.com/search?q=Allegiant+Appliances+Inc+reviews",
  writeReviewUrl:
    process.env.NEXT_PUBLIC_ALLEGIANT_WRITE_REVIEW_URL ??
    "https://www.google.com/search?q=Allegiant+Appliances+Inc+reviews",
  /** Años de experiencia de Vadim en la zona (dato confirmado por el negocio). */
  yearsInArea: 5,
  /** Número de registro estatal de reparación de electrodomésticos. */
  registrationNumber: null as string | null,
  /** Calificación y cantidad de reseñas de Google; `null` oculta el dato. */
  reviewStats: null as { rating: string; count: number } | null,
  /** Reseñas reales (con permiso para publicarlas). Vacío oculta la sección. */
  testimonials: [] as { text: string; who: string }[],
  /** Oferta de la tarjeta de visita; `false` oculta la cinta superior. */
  offerEnabled: true,
};

/** Rutas públicas de cada idioma. */
export function paths(lang: Lang) {
  const base = lang === "es" ? "/allegiant/es" : "/allegiant";
  return {
    home: base,
    tour: `${base}/tour`,
    other: lang === "es" ? "/allegiant" : "/allegiant/es",
    otherTour: lang === "es" ? "/allegiant/tour" : "/allegiant/es/tour",
  };
}

export const luxuryBrands = [
  "Sub-Zero",
  "Wolf",
  "Miele",
  "Gaggenau",
  "Thermador",
  "Viking",
  "La Cornue",
  "Fisher & Paykel",
  "Liebherr",
  "Dacor",
  "Monogram",
  "Smeg",
];

export const homeBrands = [
  "Samsung",
  "LG",
  "Whirlpool",
  "GE",
  "Maytag",
  "Frigidaire",
  "KitchenAid",
  "Bosch",
  "Electrolux",
  "Kenmore",
  "Amana",
  "Hotpoint",
];

/**
 * Logos oficiales por marca (ruta bajo /public). Se agregan cuando el negocio
 * tenga los archivos de cada marca; mientras falte uno, la tarjeta muestra el
 * nombre en tipografía.
 */
export const brandLogos: Record<string, string> = {};

export const serviceAreas = [
  "West Hollywood",
  "Beverly Hills",
  "Bel Air",
  "Hollywood Hills",
  "Brentwood",
  "Santa Monica",
  "Culver City",
  "Studio City",
  "Sherman Oaks",
  "Downtown LA",
  "Pasadena",
  "Glendale",
  "Burbank",
  "Malibu",
];

export const heroImages = [
  { src: "/allegiant/kitchen-island.jpg", alt: { en: "Luxury kitchen with a marble island", es: "Cocina de lujo con isla de mármol" } },
  { src: "/allegiant/kitchen-wide.jpg", alt: { en: "Luxury kitchen with built-in refrigeration", es: "Cocina de lujo con refrigeración empotrada" } },
  { src: "/allegiant/laundry.jpg", alt: { en: "Luxury laundry room", es: "Lavandería de lujo" } },
];

export type ApplianceKind = "fridge" | "micro" | "dish" | "wine" | "washer" | "dryer";

export type Hotspot = {
  id: string;
  kind: ApplianceKind;
  /** Posición del punto, en % de la imagen. */
  x: number;
  y: number;
  /** Zona (en % de la imagen) que se abre en la vista de rayos X. */
  xray?: { left: number; top: number; width: number; height: number };
};

export const tourScenes: { src: string; hotspots: Hotspot[] }[] = [
  {
    src: "/allegiant/kitchen-wide.jpg",
    hotspots: [
      { id: "a1", kind: "fridge", x: 69, y: 50, xray: { left: 64.3, top: 27.3, width: 9.5, height: 46.3 } },
      { id: "a2", kind: "fridge", x: 52.7, y: 50 },
      { id: "a3", kind: "micro", x: 41.6, y: 69.5 },
      { id: "a4", kind: "wine", x: 28.9, y: 62 },
    ],
  },
  {
    src: "/allegiant/kitchen-island.jpg",
    hotspots: [
      { id: "b1", kind: "fridge", x: 37.4, y: 47, xray: { left: 31.6, top: 20.8, width: 11.6, height: 50 } },
      { id: "b2", kind: "micro", x: 54.5, y: 71 },
      { id: "b3", kind: "dish", x: 64, y: 77 },
      { id: "b4", kind: "wine", x: 81, y: 61 },
    ],
  },
  {
    src: "/allegiant/laundry.jpg",
    hotspots: [
      { id: "c1", kind: "dryer", x: 49, y: 38 },
      { id: "c2", kind: "washer", x: 49, y: 56 },
      { id: "c3", kind: "dish", x: 65, y: 59 },
      { id: "c4", kind: "wine", x: 91, y: 83 },
    ],
  },
];

type Kind = { name: string; copy: string; faults: string[] };

export const copy = {
  en: {
    ribbon: { text: "Save your contact and get 20% off labor or maintenance.", cta: "Book now" },
    nav: { brands: "Brands", reviews: "Reviews", tour: "Home tour", faq: "FAQ", book: "Book a visit" },
    hero: {
      eyebrow: "Greater Los Angeles",
      h1a: "Every appliance,",
      h1b: "expertly",
      h1c: "restored.",
      p: "From luxury estates to family homes across Los Angeles. Over five years of trusted repair and maintenance in the neighborhood. Residential and commercial, licensed and insured.",
      cta: "Request a visit",
      tour: "Tour the home",
      rooms: ["The Island", "The Kitchen", "The Laundry"],
    },
    trust: {
      years: "Years serving the neighborhood",
      licensed: "Licensed",
      licensedSmall: "& insured",
      rating: "Google rating",
      reviews: "reviews",
      registration: "State repair registration",
    },
    brands: {
      eyebrow: "Brands we repair",
      h2: "Fine marques or everyday brands, the same standard of care.",
      luxury: "Luxury & professional",
      home: "Home favorites",
      all: "And every other major brand. If it plugs in, we know how to repair it.",
      prev: "Previous brands",
      next: "Next brands",
    },
    why: {
      eyebrow: "Why Allegiant",
      h2: "A small team, held to the highest standard.",
      items: [
        { n: "01", t: "Personal", p: "You deal with the technician who does the work. Vadim knows your appliance, your home and your name." },
        { n: "02", t: "Punctual", p: "Clear arrival windows, a call when we are on the way and no surprises on the bill." },
        { n: "03", t: "Discreet", p: "Careful, clean and respectful of your home and your privacy, from estates to apartments." },
      ],
    },
    reviews: {
      eyebrow: "Reviews",
      h2: "Over five years, one neighborhood at a time.",
      p: "Read what homeowners across Los Angeles say about Vadim and the team, or share your own experience.",
      read: "Read reviews on Google",
      write: "Leave a review",
      testimonials: "What our clients say.",
    },
    services: {
      items: [
        { n: "01", t: "Refrigeration & ice", p: "Built-in and column refrigeration, wine storage and ice makers." },
        { n: "02", t: "Cooking", p: "Ranges, ovens, cooktops and microwaves." },
        { n: "03", t: "Dishwashing", p: "Integrated and freestanding dishwashers." },
        { n: "04", t: "Laundry", p: "Washers and dryers, from diagnosis to restoration." },
        { n: "05", t: "Preventive care", p: "Scheduled maintenance for estates and commercial kitchens." },
      ],
    },
    tourTeaser: {
      eyebrow: "Home tour",
      h2a: "Walk through the house.",
      h2b: "See inside.",
      p: "Step into the kitchen and laundry, then look through the refrigerator to find the failing valve before we ever open the panel.",
      cta: "Begin the tour",
    },
    faq: {
      eyebrow: "Good to know",
      h2: "Quick answers before you call.",
      items: [
        { q: "Why isn’t my refrigerator keeping food cold?", a: "Make sure the unit has power and the controls are set correctly. Check the plug or the circuit breaker, and confirm the doors close fully. If it is still warm, keep the doors shut and call us. A failing part is often simple to fix when caught early." },
        { q: "Why isn’t my ice maker or water dispenser working?", a: "Check that the water line is open and not kinked, replace the water filter if it is overdue, and make sure the freezer is cold enough to make ice. If it still does not work, the water inlet valve is a common cause, and we can test it." },
        { q: "Why won’t my burners light?", a: "Check that the range has power and that the burner caps are seated and dry. If you smell gas, leave the home and call your gas utility right away. Otherwise, call us and we will diagnose the igniter or the gas supply safely." },
        { q: "Why is my dishwasher not draining?", a: "Clean the filter at the bottom of the tub and check that the drain hose is not kinked. If you have a garbage disposal, make sure the knockout plug was removed. If water is still standing, we can find the blockage or pump issue." },
      ],
    },
    areas: { eyebrow: "Service areas", h2: "From the hills to the coast, and beyond." },
    contact: { eyebrow: "By appointment", h2: "Let us take care of it." },
    footer: {
      blurb: "Expert repair and maintenance for fine appliances and everyday homes, across Greater Los Angeles.",
      contact: "Contact",
      where: "Serving Greater Los Angeles",
      explore: "Explore",
      google: "View us on Google →",
      mid: "Residential & Commercial · Licensed & Insured",
      legal: "Brand names are trademarks of their respective owners. Allegiant Appliances Inc is an independent service company and is not affiliated with, sponsored or authorized by these manufacturers.",
    },
    booking: {
      title: "Book a visit",
      sub: "Tell us what needs repair and we will call you back shortly.",
      name: "Name",
      phone: "Phone",
      appliance: "Appliance",
      brand: "Brand",
      zip: "ZIP code",
      time: "Preferred time",
      message: "What is happening?",
      send: "Request visit",
      sending: "Sending…",
      or: "Or call",
      close: "Close",
      thanks: "Thank you.",
      thanksP: "We received your request. Vadim will contact you shortly.",
      error: "Something went wrong. Please call us instead.",
      appliances: ["Refrigerator", "Wine cooler", "Ice maker", "Microwave", "Oven / range", "Dishwasher", "Washer", "Dryer", "Other"],
      times: ["As soon as possible", "Morning", "Afternoon", "Evening"],
    },
    chat: {
      title: "Jessica · Allegiant",
      sub: "Virtual assistant",
      hi: "Hi, I’m Jessica. How can I help you today?",
      call: "Call us",
      text: "Text us",
    },
    tour: {
      back: "Back to site",
      book: "Book a repair",
      repair: "we repair it.",
      xrayOn: "X-ray view",
      xrayOff: "Exit X-ray",
      xrayTitle: "X-ray · Water inlet valve",
      xrayNote: "A worn inlet valve is a common cause of leaks and ice maker problems. We test it first, then repair or replace it.",
      hint: "Tap the glowing points to see what we repair in every appliance.",
      prev: "Previous room",
      next: "Next room",
      scenes: ["The Kitchen", "The Island", "The Laundry"],
      tabs: ["Kitchen", "Island", "Laundry"],
      kinds: {
        fridge: { name: "Refrigerator", copy: "Cooling, leaks and noise, along with ice and water systems, diagnosed and repaired.", faults: ["Not cooling", "Leaking", "Noisy"] },
        micro: { name: "Microwave drawer", copy: "Heating, controls and door problems on built-in and drawer microwaves.", faults: ["No heat", "Sparking", "Dead panel"] },
        dish: { name: "Dishwasher", copy: "Drainage, cleaning performance and leaks on integrated and freestanding models.", faults: ["Not draining", "Not cleaning", "Leaking"] },
        wine: { name: "Wine cooler", copy: "Temperature stability and compressor issues, so every bottle is kept right.", faults: ["Not cooling", "Compressor noise", "Temperature swings"] },
        washer: { name: "Washer", copy: "Spin, drain and leak problems, from diagnosis to restoration.", faults: ["Not spinning", "Not draining", "Leaking"] },
        dryer: { name: "Dryer", copy: "Heating, airflow and drum problems, handled with care for your laundry.", faults: ["No heat", "Long cycles", "Drum noise"] },
      } satisfies Record<ApplianceKind, Kind>,
    },
    meta: {
      title: "Allegiant Appliances — Luxury & Everyday Appliance Repair in Los Angeles",
      description: "Expert appliance repair and maintenance across Greater Los Angeles. Sub-Zero, Wolf, Miele, Samsung, LG and every major brand. Licensed and insured.",
      tourTitle: "Home Tour — Allegiant Appliances",
      tourDescription: "Walk through a luxury home and see what Allegiant repairs in every appliance.",
    },
  },
  es: {
    ribbon: { text: "Guarda nuestro contacto y obtén 20 % de descuento en mano de obra o mantenimiento.", cta: "Reservar" },
    nav: { brands: "Marcas", reviews: "Reseñas", tour: "Recorrido", faq: "Preguntas", book: "Reservar visita" },
    hero: {
      eyebrow: "Gran Los Ángeles",
      h1a: "Cada electrodoméstico,",
      h1b: "reparado",
      h1c: "con maestría.",
      p: "De las residencias de lujo a los hogares de familia en todo Los Ángeles. Más de cinco años de reparación y mantenimiento de confianza en el barrio. Residencial y comercial, con licencia y seguro.",
      cta: "Solicitar visita",
      tour: "Recorre la casa",
      rooms: ["La Isla", "La Cocina", "La Lavandería"],
    },
    trust: {
      years: "Años sirviendo al barrio",
      licensed: "Con licencia",
      licensedSmall: "y seguro",
      rating: "Calificación en Google",
      reviews: "reseñas",
      registration: "Registro estatal de reparación",
    },
    brands: {
      eyebrow: "Marcas que reparamos",
      h2: "Marcas de lujo o de uso diario, el mismo nivel de cuidado.",
      luxury: "Lujo y profesional",
      home: "Favoritas del hogar",
      all: "Y todas las demás marcas importantes. Si se enchufa, sabemos repararlo.",
      prev: "Marcas anteriores",
      next: "Siguientes marcas",
    },
    why: {
      eyebrow: "Por qué Allegiant",
      h2: "Un equipo pequeño, con el más alto estándar.",
      items: [
        { n: "01", t: "Personal", p: "Tratas con el técnico que hace el trabajo. Vadim conoce tu aparato, tu casa y tu nombre." },
        { n: "02", t: "Puntual", p: "Ventanas de llegada claras, una llamada cuando vamos en camino y sin sorpresas en la factura." },
        { n: "03", t: "Discreto", p: "Cuidadoso, limpio y respetuoso con tu hogar y tu privacidad, de residencias a apartamentos." },
      ],
    },
    reviews: {
      eyebrow: "Reseñas",
      h2: "Más de cinco años, un barrio a la vez.",
      p: "Lee lo que dicen los propietarios de Los Ángeles sobre Vadim y su equipo, o comparte tu experiencia.",
      read: "Ver reseñas en Google",
      write: "Dejar una reseña",
      testimonials: "Lo que dicen nuestros clientes.",
    },
    services: {
      items: [
        { n: "01", t: "Refrigeración y hielo", p: "Refrigeración empotrada y de columna, vinotecas y máquinas de hielo." },
        { n: "02", t: "Cocción", p: "Estufas, hornos, placas y microondas." },
        { n: "03", t: "Lavavajillas", p: "Lavavajillas integrados y de libre instalación." },
        { n: "04", t: "Lavandería", p: "Lavadoras y secadoras, del diagnóstico a la restauración." },
        { n: "05", t: "Cuidado preventivo", p: "Mantenimiento programado para residencias y cocinas comerciales." },
      ],
    },
    tourTeaser: {
      eyebrow: "Recorrido",
      h2a: "Recorre la casa.",
      h2b: "Mira por dentro.",
      p: "Entra a la cocina y a la lavandería, y mira a través del refrigerador para encontrar la válvula dañada antes de abrir el panel.",
      cta: "Comenzar el recorrido",
    },
    faq: {
      eyebrow: "Bueno saber",
      h2: "Respuestas rápidas antes de llamar.",
      items: [
        { q: "¿Por qué mi refrigerador no enfría?", a: "Verifica que tenga corriente y que los controles estén bien ajustados. Revisa el enchufe o el breaker y confirma que las puertas cierran bien. Si sigue tibio, mantén las puertas cerradas y llámanos. Una pieza que falla suele ser fácil de arreglar si se detecta a tiempo." },
        { q: "¿Por qué no funciona mi máquina de hielo o el dispensador de agua?", a: "Comprueba que la línea de agua esté abierta y sin dobleces, cambia el filtro si ya toca y asegúrate de que el congelador esté lo bastante frío. Si sigue igual, la válvula de entrada de agua es una causa común y podemos probarla." },
        { q: "¿Por qué no encienden los quemadores?", a: "Verifica que la estufa tenga corriente y que las tapas de los quemadores estén bien colocadas y secas. Si hueles a gas, sal de la casa y llama de inmediato a la compañía de gas. Si no, llámanos y diagnosticaremos con seguridad el encendedor o el suministro de gas." },
        { q: "¿Por qué mi lavavajillas no drena?", a: "Limpia el filtro del fondo y revisa que la manguera de desagüe no esté doblada. Si tienes triturador de basura, confirma que se retiró el tapón. Si aún queda agua, podemos encontrar la obstrucción o el problema de la bomba." },
      ],
    },
    areas: { eyebrow: "Zonas de servicio", h2: "De las colinas a la costa, y más allá." },
    contact: { eyebrow: "Con cita previa", h2: "Permítanos encargarnos." },
    footer: {
      blurb: "Reparación y mantenimiento expertos para electrodomésticos finos y hogares de todos los días, en todo el Gran Los Ángeles.",
      contact: "Contacto",
      where: "Servicio en el Gran Los Ángeles",
      explore: "Explorar",
      google: "Vernos en Google →",
      mid: "Residencial y comercial · Con licencia y seguro",
      legal: "Los nombres de marca pertenecen a sus respectivos propietarios. Allegiant Appliances Inc es una empresa de servicio independiente y no está afiliada, patrocinada ni autorizada por estos fabricantes.",
    },
    booking: {
      title: "Reservar una visita",
      sub: "Cuéntanos qué necesita reparación y te llamamos enseguida.",
      name: "Nombre",
      phone: "Teléfono",
      appliance: "Aparato",
      brand: "Marca",
      zip: "Código postal",
      time: "Horario preferido",
      message: "¿Qué está pasando?",
      send: "Solicitar visita",
      sending: "Enviando…",
      or: "O llama al",
      close: "Cerrar",
      thanks: "Gracias.",
      thanksP: "Recibimos tu solicitud. Vadim te contactará en breve.",
      error: "Algo salió mal. Por favor llámanos.",
      appliances: ["Refrigerador", "Vinoteca", "Máquina de hielo", "Microondas", "Horno / estufa", "Lavavajillas", "Lavadora", "Secadora", "Otro"],
      times: ["Lo antes posible", "Mañana", "Tarde", "Noche"],
    },
    chat: {
      title: "Jessica · Allegiant",
      sub: "Asistente virtual",
      hi: "Hola, soy Jessica. ¿En qué puedo ayudarte hoy?",
      call: "Llámanos",
      text: "Escríbenos",
    },
    tour: {
      back: "Volver al sitio",
      book: "Reservar reparación",
      repair: "lo reparamos.",
      xrayOn: "Vista de rayos X",
      xrayOff: "Salir de rayos X",
      xrayTitle: "Rayos X · Válvula de entrada de agua",
      xrayNote: "Una válvula de entrada desgastada es una causa común de fugas y fallas en la máquina de hielo. La probamos primero y luego la reparamos o la cambiamos.",
      hint: "Toca los puntos brillantes para ver qué reparamos en cada aparato.",
      prev: "Cuarto anterior",
      next: "Siguiente cuarto",
      scenes: ["La Cocina", "La Isla", "La Lavandería"],
      tabs: ["Cocina", "Isla", "Lavandería"],
      kinds: {
        fridge: { name: "Refrigerador", copy: "Enfriamiento, fugas y ruido, además de hielo y agua, diagnosticados y reparados.", faults: ["No enfría", "Gotea", "Ruidoso"] },
        micro: { name: "Microondas de cajón", copy: "Problemas de calentamiento, controles y puerta en microondas empotrados y de cajón.", faults: ["No calienta", "Chispas", "Panel muerto"] },
        dish: { name: "Lavavajillas", copy: "Drenaje, limpieza y fugas en modelos integrados y de libre instalación.", faults: ["No drena", "No limpia", "Gotea"] },
        wine: { name: "Vinoteca", copy: "Estabilidad de temperatura y problemas del compresor, para que cada botella esté en su punto.", faults: ["No enfría", "Ruido del compresor", "Temperatura inestable"] },
        washer: { name: "Lavadora", copy: "Problemas de giro, drenaje y fugas, del diagnóstico a la restauración.", faults: ["No gira", "No drena", "Gotea"] },
        dryer: { name: "Secadora", copy: "Problemas de calor, flujo de aire y tambor, con el cuidado que merece tu ropa.", faults: ["No calienta", "Ciclos largos", "Ruido del tambor"] },
      } satisfies Record<ApplianceKind, Kind>,
    },
    meta: {
      title: "Allegiant Appliances — Reparación de electrodomésticos de lujo y de uso diario en Los Ángeles",
      description: "Reparación y mantenimiento expertos de electrodomésticos en el Gran Los Ángeles. Sub-Zero, Wolf, Miele, Samsung, LG y todas las marcas importantes. Con licencia y seguro.",
      tourTitle: "Recorrido — Allegiant Appliances",
      tourDescription: "Recorre una casa de lujo y mira qué reparamos en cada aparato.",
    },
  },
} as const;

export type Copy = (typeof copy)["en"] | (typeof copy)["es"];
