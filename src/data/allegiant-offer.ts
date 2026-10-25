/**
 * Oferta que se muestra al pinchar el globo. Confirmada por Vadim: 20 % en
 * mantenimiento y mano de obra de reparación, sin vencimiento (`valid: null`).
 * Todo lo que ve el cliente está aquí, en inglés y español.
 */
import type { Lang } from "./allegiant";

type Text = Record<Lang, string>;

export const offer: {
  eyebrow: Text;
  big: Text;
  applies: Text;
  how: Text;
  /** Vigencia opcional; sin vencimiento por decisión de Vadim. */
  valid: Text | null;
} = {
  eyebrow: { en: "A welcome offer from Vadim", es: "Una atención de Vadim" },
  big: { en: "20% off", es: "20 % de descuento" },
  applies: {
    en: "on maintenance and repair labor",
    es: "en mantenimiento y mano de obra de reparación",
  },
  how: {
    en: "Just mention it when you call or book. No code, no sign-up.",
    es: "Solo menciónalo al llamar o reservar. Sin código ni registro.",
  },
  valid: null,
};

/** Botones de la tarjeta. */
export const couponText: Record<Lang, { call: string; save: string; book: string; close: string }> = {
  en: { call: "Call Vadim", save: "Save contact", book: "Book a visit", close: "Close" },
  es: { call: "Llamar a Vadim", save: "Guardar contacto", book: "Reservar visita", close: "Cerrar" },
};

/** Globo flotante que aparece a los pocos segundos y abre la oferta. */
export const balloonText: Record<Lang, { label: string; close: string; more: string }> = {
  en: { label: "A surprise for you — tap to pop", close: "Close", more: "One more…" },
  es: { label: "Una sorpresa para ti — toca para pinchar", close: "Cerrar", more: "Una más…" },
};

/** Segundos antes de que aparezca el globo. */
export const balloonDelaySec = 10;
