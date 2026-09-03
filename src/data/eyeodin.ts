/**
 * CONTENIDO — eyeOdin
 * ===================
 * Servicio de inspección técnica y mantenimiento para yates de lujo.
 * Bilingüe: cada cadena visible es un par `{ es, en }`.
 *
 * PENDIENTE DE DATOS REALES
 * -------------------------
 * Todo lo que vale `PENDING` son datos que solo tú puedes dar (contacto,
 * puertos, cifras). La página los pinta como una etiqueta punteada de
 * "por definir" en vez de inventárselos: en cuanto los sustituyas por el
 * valor real, la etiqueta desaparece sola. Busca `PENDING` en este archivo.
 *
 * El copy de servicios, proceso e informe SÍ es texto final propuesto:
 * describe la práctica habitual del sector, sin atribuir a eyeOdin ninguna
 * certificación, cifra ni cliente concreto. Revísalo y ajústalo a lo que
 * realmente ofreces antes de publicar.
 */

export type Lang = "es" | "en";

/** Cadena en los dos idiomas del sitio. */
export type Localized = { es: string; en: string };

/** Marcador de dato real pendiente. Mismo criterio que `offers.ts`. */
export const PENDING = "REPLACE_ME";

export function isPending(value: string): boolean {
  return value === PENDING;
}

/** Elige el idioma activo de un par bilingüe. */
export function t(lang: Lang, value: Localized): string {
  return value[lang];
}

export const company = {
  name: "eyeOdin",
  /** Se lee en la barra y en el pie, bajo el logotipo. */
  tagline: {
    es: "Inspección técnica y mantenimiento de yates",
    en: "Yacht technical inspection & maintenance",
  } satisfies Localized,
  /** Descripción para buscadores y para compartir el enlace. */
  description: {
    es: "Inspección subacuática con ROV, ultrasonidos y termografía para yates de lujo. Informe con evidencia y plan de mantenimiento predictivo.",
    en: "ROV underwater survey, ultrasonics and thermography for luxury yachts. Evidence-backed reporting and a predictive maintenance plan.",
  } satisfies Localized,
};

export const nav: { href: string; label: Localized }[] = [
  { href: "#servicios", label: { es: "Servicios", en: "Services" } },
  { href: "#proceso", label: { es: "Proceso", en: "Process" } },
  { href: "#informe", label: { es: "El informe", en: "The report" } },
  { href: "#criterio", label: { es: "Criterio", en: "Approach" } },
  { href: "#contacto", label: { es: "Contacto", en: "Contact" } },
];

export const hero = {
  eyebrow: {
    es: "Inspección técnica · Yates de lujo",
    en: "Technical inspection · Luxury yachts",
  } satisfies Localized,
  title: {
    es: "Todo lo que su yate no le está contando.",
    en: "Everything your yacht isn’t telling you.",
  } satisfies Localized,
  body: {
    es: "Revisamos casco, obra viva y sistemas con ROV, ultrasonidos y termografía, sin sacar el barco del agua. Usted recibe un informe con evidencia medida, no una opinión.",
    en: "We survey hull, running gear and systems with ROV, ultrasonics and thermography, without hauling out. You get a report backed by measurements, not an opinion.",
  } satisfies Localized,
  primaryCta: { es: "Solicitar inspección", en: "Request an inspection" } satisfies Localized,
  secondaryCta: { es: "Qué incluye el informe", en: "What the report covers" } satisfies Localized,
};

/**
 * Franja de tres cifras bajo la portada. Los valores son PENDING a
 * propósito: una cifra inventada aquí es una cifra que acaba publicada.
 */
export const figures: { value: string; label: Localized }[] = [
  { value: PENDING, label: { es: "Yates inspeccionados", en: "Yachts surveyed" } },
  { value: PENDING, label: { es: "Entrega del informe", en: "Report turnaround" } },
  { value: PENDING, label: { es: "Puertos de operación", en: "Ports covered" } },
];

export type Service = {
  slug: string;
  title: Localized;
  body: Localized;
};

export const services: Service[] = [
  {
    slug: "rov",
    title: { es: "Inspección subacuática con ROV", en: "Underwater ROV survey" },
    body: {
      es: "Casco, hélices, ejes, timones y ánodos filmados en alta definición con el barco en el agua. Sin varada, sin parar la temporada.",
      en: "Hull, propellers, shafts, rudders and anodes filmed in high definition with the boat in the water. No haul-out, no lost season.",
    },
  },
  {
    slug: "ultrasonidos",
    title: { es: "Espesores por ultrasonidos", en: "Ultrasonic thickness testing" },
    body: {
      es: "Malla de puntos sobre casco y tanques para detectar pérdida de material mientras todavía es mantenimiento y no obra estructural.",
      en: "A grid of measurement points across hull and tanks, catching material loss while it is still maintenance and not structural work.",
    },
  },
  {
    slug: "termografia",
    title: { es: "Termografía de sistemas", en: "Systems thermography" },
    body: {
      es: "Cuadros eléctricos, motores y líneas de escape. El punto caliente aparece en la cámara meses antes de que aparezca la avería.",
      en: "Switchboards, engines and exhaust lines. The hot spot shows up on camera months before the failure shows up at sea.",
    },
  },
  {
    slug: "aceite-vibraciones",
    title: { es: "Análisis de aceite y vibraciones", en: "Oil & vibration analysis" },
    body: {
      es: "Desgaste interno de motores, reductoras y línea de ejes, leído como tendencia entre campañas y no como una foto aislada.",
      en: "Internal wear on engines, gearboxes and shaft line, read as a trend across campaigns rather than a single snapshot.",
    },
  },
  {
    slug: "precompra",
    title: { es: "Peritaje de precompra", en: "Pre-purchase survey" },
    body: {
      es: "Estado real del barco antes de firmar, con el alcance acordado por escrito. No vendemos el barco ni las reparaciones que encontramos.",
      en: "The boat's real condition before you sign, to a scope agreed in writing. We sell neither the boat nor the repairs we find.",
    },
  },
  {
    slug: "plan-predictivo",
    title: { es: "Plan de mantenimiento predictivo", en: "Predictive maintenance plan" },
    body: {
      es: "Calendario por sistema y horas de uso, con presupuesto anual y aviso antes de cada intervención, para que nada se decida con prisa.",
      en: "A per-system schedule driven by running hours, with an annual budget and notice ahead of each job, so nothing is decided in a rush.",
    },
  },
];

export type Step = {
  title: Localized;
  body: Localized;
};

export const process: Step[] = [
  {
    title: { es: "Briefing", en: "Briefing" },
    body: {
      es: "Nos cuenta el barco, cómo se usa y qué le preocupa. Cerramos alcance, fecha y precio antes de mover a nadie.",
      en: "You tell us the boat, how it is used and what worries you. Scope, date and price are closed before anyone moves.",
    },
  },
  {
    title: { es: "Inspección a bordo", en: "On-board inspection" },
    body: {
      es: "Una jornada de trabajo con el barco en su amarre. El equipo entra y sale sin desmontar más de lo acordado.",
      en: "One working day with the boat on its berth. The team works to the agreed scope and dismantles nothing beyond it.",
    },
  },
  {
    title: { es: "Informe", en: "Report" },
    body: {
      es: "Hallazgos ordenados por gravedad, cada uno con su foto, su vídeo y su medición. Sin adjetivos que no se puedan comprobar.",
      en: "Findings ranked by severity, each with its photo, video and measurement. No adjective that cannot be checked.",
    },
  },
  {
    title: { es: "Plan", en: "Plan" },
    body: {
      es: "Qué se arregla ahora, qué puede esperar a la próxima varada y cuánto cuesta cada partida por separado.",
      en: "What to fix now, what can wait for the next haul-out, and what each line item costs on its own.",
    },
  },
];

export const report = {
  title: { es: "Lo que recibe", en: "What you receive" } satisfies Localized,
  body: {
    es: "Un informe pensado para decidir con él delante: para hablar con el astillero, para negociar un precio o para no gastar todavía.",
    en: "A report built to decide with: to talk to the yard, to negotiate a price, or to justify not spending yet.",
  } satisfies Localized,
  items: [
    {
      es: "Índice de hallazgos por gravedad: crítico, a vigilar, cosmético.",
      en: "Findings index by severity: critical, monitor, cosmetic.",
    },
    {
      es: "Vídeo subacuático con marca de tiempo y posición de cada hallazgo.",
      en: "Underwater video with timestamp and position for every finding.",
    },
    {
      es: "Tabla de espesores comparada con la campaña anterior.",
      en: "Thickness table compared against the previous campaign.",
    },
    {
      es: "Presupuesto orientativo por partida, para pedir ofertas sin partir de cero.",
      en: "Indicative budget per line item, so you can request quotes from a baseline.",
    },
    {
      es: "Entrega en PDF y en un panel privado donde queda el histórico del barco.",
      en: "Delivered as a PDF and in a private dashboard that keeps the boat's history.",
    },
  ] satisfies Localized[],
};

export const pillars: { title: Localized; body: Localized }[] = [
  {
    title: { es: "Independencia", en: "Independence" },
    body: {
      es: "No vendemos barcos ni ejecutamos las reparaciones que detectamos. El diagnóstico es el único producto, así que no tiene que crecer.",
      en: "We neither sell boats nor carry out the repairs we find. The diagnosis is the only product, so it has no reason to grow.",
    },
  },
  {
    title: { es: "Evidencia", en: "Evidence" },
    body: {
      es: "Cada hallazgo va con su medición y su archivo original. Nada entra en el informe porque a alguien se lo haya parecido.",
      en: "Every finding carries its measurement and its raw file. Nothing enters the report because someone thought it looked wrong.",
    },
  },
  {
    title: { es: "Continuidad", en: "Continuity" },
    body: {
      es: "Guardamos cada campaña y la comparamos con la anterior. En mantenimiento el valor no está en el dato: está en la tendencia.",
      en: "Every campaign is kept and compared with the last. In maintenance the value is never in the reading: it is in the trend.",
    },
  },
];

export const contact = {
  title: { es: "Hablemos del barco", en: "Let's talk about the boat" } satisfies Localized,
  body: {
    es: "Cuéntenos esloras, matrícula y dónde está amarrado. Le devolvemos alcance, fecha y precio cerrado.",
    en: "Tell us length, registration and where she lies. We come back with scope, date and a fixed price.",
  } satisfies Localized,
  /** Sustituye estos cuatro por los reales y desaparecen las etiquetas punteadas. */
  email: PENDING,
  phone: PENDING,
  /** Base del yate / oficina. Ej.: "Puerto Banús, Marbella". */
  base: PENDING,
  /** Perfil de Instagram, con la @. */
  instagram: PENDING,
  emailLabel: { es: "Correo", en: "Email" } satisfies Localized,
  phoneLabel: { es: "Teléfono", en: "Phone" } satisfies Localized,
  baseLabel: { es: "Base", en: "Based in" } satisfies Localized,
  instagramLabel: { es: "Instagram", en: "Instagram" } satisfies Localized,
  pendingLabel: { es: "por definir", en: "to be defined" } satisfies Localized,
};
