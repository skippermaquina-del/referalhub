/**
 * Oferta que se muestra al pinchar el globo. Confirmada por Vadim: 20 % en
 * mantenimiento y mano de obra de reparación, sin vencimiento (`valid: null`).
 * Todo lo que ve el cliente está aquí, en inglés y español.
 */
import type { Lang } from "./allegiant";

type Text = Record<Lang, string>;

export const offer: {
  big: Text;
  applies: Text;
  how: Text;
  /** Vigencia opcional; sin vencimiento por decisión de Vadim. */
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

/** Textos del cupón. */
export const couponText: Record<Lang, { won: string; save: string; book: string }> = {
  en: { won: "You won", save: "Save contact", book: "Book a visit" },
  es: { won: "¡Ganaste!", save: "Guardar contacto", book: "Reservar visita" },
};

/** Globo flotante que aparece a los pocos segundos y abre la oferta. */
export const balloonText: Record<Lang, { label: string; close: string }> = {
  en: { label: "A surprise for you — tap to open", close: "Close" },
  es: { label: "Una sorpresa para ti — toca para abrir", close: "Cerrar" },
};

/** Segundos antes de que aparezca el globo. */
export const balloonDelaySec = 10;
