/**
 * SMS de aviso a Vadim con Twilio (API REST, sin el SDK).
 *
 * Variables de entorno (las cuatro hacen falta; si falta alguna no se envía nada):
 * - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER: el número de Twilio que envía, en formato +1XXXXXXXXXX
 * - TWILIO_VADIM_PHONE: el celular de Vadim, en formato +1XXXXXXXXXX
 *
 * Ojo: Twilio bloquea los SMS de un número toll-free hasta que su verificación
 * esté aprobada (error 30032). Mientras tanto la API acepta el mensaje, pero no
 * se entrega; se ve como "undelivered" en Monitor > Logs > Messaging.
 */

const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_PHONE_NUMBER;
const TO = process.env.TWILIO_VADIM_PHONE;

/** Dos segmentos de SMS como máximo. */
const MAX_LENGTH = 320;

/** Envía `body` al celular de Vadim. Devuelve true si Twilio aceptó el mensaje. */
export async function textVadim(body: string): Promise<boolean> {
  if (!SID || !TOKEN || !FROM || !TO) return false;
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(SID)}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: TO, From: FROM, Body: body.slice(0, MAX_LENGTH) }),
      cache: "no-store",
      // Vapi espera la respuesta de la herramienta: no la demoramos por un SMS.
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.warn(`[allegiant] sms returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return res.ok;
  } catch (error) {
    console.warn("[allegiant] sms delivery failed", error);
    return false;
  }
}

/** Texto del SMS para una solicitud que dejó Jessica en una llamada. */
export function phoneCallSms(lead: {
  name: string;
  phone: string;
  appliance: string;
  brand: string;
  zip: string;
  time: string;
  notes: string;
  urgent: boolean;
}): string {
  const notes = lead.notes.replace(/^URGENT\.\s*/, "");
  return [
    `${lead.urgent ? "URGENT - " : ""}Allegiant call: ${lead.name}, ${lead.phone}`,
    lead.appliance ? `${lead.appliance}${lead.brand ? ` ${lead.brand}` : ""}` : "",
    notes,
    lead.zip ? `ZIP ${lead.zip}` : "",
    lead.time ? `When: ${lead.time}` : "",
  ]
    .filter(Boolean)
    .join(" | ")
    .replace(/\s+/g, " ")
    .slice(0, MAX_LENGTH);
}
