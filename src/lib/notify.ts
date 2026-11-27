/**
 * SMS de aviso al dueño del negocio, con Twilio (API REST, sin el SDK).
 *
 * Generaliza lo que antes era `allegiant-sms.ts`: la cuenta de Twilio y el
 * número emisor son compartidos por toda la plataforma, pero el destinatario
 * y el texto salen del inquilino.
 *
 * Variables compartidas (si falta alguna, no se manda nada):
 * - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER: el número emisor, en formato +1XXXXXXXXXX
 *
 * El celular del dueño sale de `ownerPhone(tenant)`: `<INQUILINO>_OWNER_PHONE`,
 * y para Allegiant todavía vale el viejo `TWILIO_VADIM_PHONE`.
 *
 * Ojo: Twilio bloquea los SMS de un número toll-free hasta que su verificación
 * esté aprobada (error 30032). Mientras tanto la API acepta el mensaje, pero no
 * se entrega; se ve como "undelivered" en Monitor > Logs > Messaging.
 */

import { ownerPhone, type Tenant } from "@/lib/tenants";

const SID = process.env.TWILIO_ACCOUNT_SID;
const TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM = process.env.TWILIO_PHONE_NUMBER;

/** Dos segmentos de SMS como máximo. */
const MAX_LENGTH = 320;

/** Envía `body` al celular del dueño del inquilino. True si Twilio lo aceptó. */
export async function textOwner(tenant: Tenant, body: string): Promise<boolean> {
  const to = ownerPhone(tenant);
  if (!SID || !TOKEN || !FROM || !to) return false;
  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(SID)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${SID}:${TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: FROM, Body: body.slice(0, MAX_LENGTH) }),
        cache: "no-store",
        // Vapi espera la respuesta de la herramienta: no la demoramos por un SMS.
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) {
      console.warn(`[${tenant.id}] sms returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
    }
    return res.ok;
  } catch (error) {
    console.warn(`[${tenant.id}] sms delivery failed`, error);
    return false;
  }
}

/** Texto del SMS para una solicitud que dejó el agente de voz en una llamada. */
export function phoneCallSms(
  tenant: Tenant,
  lead: {
    name: string;
    phone: string;
    item: string;
    brand: string;
    zip: string;
    time: string;
    notes: string;
    urgent: boolean;
  },
): string {
  const notes = lead.notes.replace(/^URGENT\.\s*/, "");
  return [
    `${lead.urgent ? "URGENT - " : ""}${tenant.shortName} call: ${lead.name}, ${lead.phone}`,
    lead.item ? `${lead.item}${lead.brand ? ` ${lead.brand}` : ""}` : "",
    notes,
    lead.zip ? `ZIP ${lead.zip}` : "",
    lead.time ? `When: ${lead.time}` : "",
  ]
    .filter(Boolean)
    .join(" | ")
    .replace(/\s+/g, " ")
    .slice(0, MAX_LENGTH);
}
