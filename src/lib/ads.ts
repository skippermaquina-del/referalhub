const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const bookingLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL;

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Avisa a Google Ads que se envió el formulario de reserva. No hace nada si falta la configuración. */
export function trackBookingConversion() {
  if (!adsId || !bookingLabel || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", "conversion", { send_to: `${adsId}/${bookingLabel}` });
}

const callLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL;

/** Registra un toque en un enlace de teléfono (evento de Analytics y, si hay etiqueta, conversión de Ads). */
export function trackPhoneClick() {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (!gtag) return;
  gtag("event", "phone_click", { page: window.location.pathname });
  if (adsId && callLabel) gtag("event", "conversion", { send_to: `${adsId}/${callLabel}` });
}
