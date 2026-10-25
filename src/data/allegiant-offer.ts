/**
 * Oferta que se muestra al abrir el regalo de la "Caja sorpresa".
 *
 * BORRADOR — confirmar con Vadim antes de publicar:
 *  - porcentaje y a qué aplica (mantenimiento / mano de obra de reparación)
 *  - si tiene vigencia (`valid`)
 * Todo lo que ve el cliente está aquí, en inglés y español.
 */
import type { Lang } from "./allegiant";

type Text = Record<Lang, string>;

export const offer: {
  big: Text;
  applies: Text;
  how: Text;
  /** Vigencia opcional, p. ej. { en: "Valid through Dec 31", es: "Válido hasta el 31 de dic." } */
  valid: Text | null;
} = {
  big: { en: "20% OFF", es: "20 % DE DESCUENTO" },
  applies: {
    en: "maintenance and repair labor",
    es: "en mantenimiento y mano de obra de reparación",
  },
  how: {
    en: "Save Vadim's contact and mention this offer when you book.",
    es: "Guarda el contacto de Vadim y menciona esta oferta al reservar.",
  },
  valid: null,
};

/** Textos de la sección "Caja sorpresa". */
export const boxText: Record<
  Lang,
  {
    eyebrow: string;
    h2: string;
    p: string;
    hint: string;
    openGift: string;
    won: string;
    save: string;
    book: string;
    tagline: string;
    fragile: string;
  }
> = {
  en: {
    eyebrow: "Surprise box",
    h2: "Grab a box. Tap the gift.",
    p: "Throw the boxes around, then open the gift to claim your discount.",
    hint: "Drag & throw the boxes · tap the gift",
    openGift: "Open the gift",
    won: "You won",
    save: "Save contact",
    book: "Book a visit",
    tagline: "WE REPAIR IT ✓",
    fragile: "FRAGILE",
  },
  es: {
    eyebrow: "Caja sorpresa",
    h2: "Agarra una caja. Toca el regalo.",
    p: "Lanza las cajas y abre el regalo para reclamar tu descuento.",
    hint: "Arrastra y lanza las cajas · toca el regalo",
    openGift: "Abrir el regalo",
    won: "¡Ganaste!",
    save: "Guardar contacto",
    book: "Reservar visita",
    tagline: "LO REPARAMOS ✓",
    fragile: "FRÁGIL",
  },
};
