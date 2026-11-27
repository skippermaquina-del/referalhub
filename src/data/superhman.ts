/**
 * Contenido del sitio de SuperHman.
 *
 * Igual que en Allegiant: lo que el negocio tiene que confirmar vive arriba en
 * `business`, y mientras un dato sea `null` o esté vacío, la sección que lo
 * muestra no se renderiza. Nada de cifras ni reseñas inventadas.
 */

export type Lang = "en" | "es";

export const business = {
  name: "SuperHman Handyman",
  phoneDisplay: "(645) 221-9200",
  phoneHref: "+16452219200",
  whatsapp: "https://wa.me/16452219200?text=Hi%20Andy",
  instagram: "https://instagram.com/handysuperm",
  owner: "Andy",
  /**
   * Seguro de responsabilidad civil. Mientras sea `false`, la palabra
   * "Insured" no aparece en ninguna parte del sitio. No se enciende hasta que
   * la póliza exista de verdad: decirlo sin tenerla es el tipo de problema que
   * cuesta el negocio entero.
   */
  insured: false,
  /** Reseñas de Google reales, con permiso. Vacío oculta la sección. */
  testimonials: [] as { text: string; who: string }[],
  /** Calificación y cantidad de reseñas; `null` oculta el dato. */
  reviewStats: null as { rating: string; count: number } | null,
};

/** Precios "desde". Los mismos del volante de puerta, ya impreso. */
export const prices = [
  { en: "TV mounted on the wall", es: "TV montado en la pared", from: 150 },
  { en: "Drywall patched & painted", es: "Pared parchada y pintada", from: 120 },
  { en: "Door adjusted so it closes right", es: "Puerta ajustada para que cierre bien", from: 90 },
  { en: "Furniture assembled", es: "Muebles armados", from: 120 },
  { en: "Shelves, curtains, mirrors hung", es: "Estantes, cortinas y espejos colgados", from: 100 },
];

export const copy = {
  en: {
    nav: { es: "Español", call: "Call" },
    heroTitle: "The things you keep meaning to",
    heroTitleAccent: "fix",
    heroLead:
      "The shelf that never went up. The door that sticks. The patch by the shower. One visit, one person, done this week.",
    heroCta: "Get a price",
    heroCall: "Or call",
    pricesTitle: "What it costs",
    pricesNote: "Free estimate before anything starts. You hear the price first.",
    from: "from",
    stepsTitle: "How it works",
    steps: [
      { n: "01", t: "Send a photo of the problem", d: "Text, WhatsApp or the form below. A photo is worth ten minutes on the phone." },
      { n: "02", t: "You get a price before I start", d: "No surprises, no meter running. If the job grows, we talk first." },
      { n: "03", t: "Fixed this week", d: "One person shows up, on the day we agreed." },
    ],
    trust: ["Free estimates", "Same-week appointments", "English · Español · Русский"],
    formTitle: "Tell me what needs fixing",
    formLead: "I answer the same day. Nothing is charged for the estimate.",
    f: {
      name: "Your name",
      phone: "Phone",
      job: "What needs fixing",
      jobPlaceholder: "TV mount, drywall patch, door…",
      zip: "ZIP code",
      time: "Best time",
      times: ["Morning", "Afternoon", "Evening", "Any time"],
      message: "Anything else I should know",
      send: "Send request",
      sending: "Sending…",
      or: "Or just call",
    },
    ok: "Got it. I will call you back today.",
    error: "That did not go through. Please call or text instead.",
    scopeNote:
      "Carpentry, drywall, painting, mounting and assembly. I do not do plumbing or electrical work — for those I will point you to a licensed pro.",
    footerArea: "Broward · Miami-Dade · Boca Raton",
  },
  es: {
    nav: { es: "English", call: "Llamar" },
    heroTitle: "Eso que hace meses pensás",
    heroTitleAccent: "arreglar",
    heroLead:
      "El estante que nunca se colgó. La puerta que roza. El parche al lado de la ducha. Una visita, una persona, resuelto esta semana.",
    heroCta: "Pedir precio",
    heroCall: "O llamá al",
    pricesTitle: "Cuánto sale",
    pricesNote: "Presupuesto gratis antes de empezar. El precio lo sabés primero.",
    from: "desde",
    stepsTitle: "Cómo funciona",
    steps: [
      { n: "01", t: "Mandá una foto del problema", d: "Mensaje, WhatsApp o el formulario de abajo. Una foto vale diez minutos de teléfono." },
      { n: "02", t: "Te paso el precio antes de empezar", d: "Sin sorpresas ni reloj corriendo. Si el trabajo crece, lo hablamos antes." },
      { n: "03", t: "Resuelto esta semana", d: "Va una persona, el día que acordamos." },
    ],
    trust: ["Presupuesto gratis", "Turnos en la misma semana", "English · Español · Русский"],
    formTitle: "Contame qué hay que arreglar",
    formLead: "Contesto el mismo día. El presupuesto no se cobra.",
    f: {
      name: "Tu nombre",
      phone: "Teléfono",
      job: "Qué hay que arreglar",
      jobPlaceholder: "Colgar TV, parchar pared, puerta…",
      zip: "Código postal",
      time: "Mejor horario",
      times: ["Mañana", "Tarde", "Noche", "Cualquiera"],
      message: "Algo más que deba saber",
      send: "Enviar solicitud",
      sending: "Enviando…",
      or: "O llamá directo al",
    },
    ok: "Recibido. Te llamo hoy mismo.",
    error: "No se pudo enviar. Llamá o mandá un mensaje.",
    scopeNote:
      "Carpintería, pared, pintura, montaje y armado. No hago plomería ni electricidad — para eso te paso un profesional con licencia.",
    footerArea: "Broward · Miami-Dade · Boca Raton",
  },
} as const;

export function paths(lang: Lang) {
  const base = lang === "es" ? "/superhman/es" : "/superhman";
  return {
    home: base,
    privacy: `${base}/privacy`,
    other: lang === "es" ? "/superhman" : "/superhman/es",
  };
}
