const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const bookingLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL;

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Avisa a Google Ads que se envió el formulario de reserva. No hace nada si falta la configuración. */
export function trackBookingConversion() {
  if (!adsId || !bookingLabel || typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", "conversion", { send_to: `${adsId}/${bookingLabel}` });
}
