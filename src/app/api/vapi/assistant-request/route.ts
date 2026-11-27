/**
 * `assistant-request` de Vapi: qué asistente atiende esta llamada entrante.
 *
 * Es la pieza que evita tener un agente por negocio. Hay UN asistente guardado
 * en Vapi, con el prompt lleno de huecos `{{...}}`; en cada llamada entrante
 * Vapi pega acá, este endpoint mira a qué número llamaron, resuelve el
 * inquilino y devuelve los valores de ese negocio.
 *
 * Tres cosas de Vapi que conviene no olvidar:
 * - Los overrides se aplican SOLO al inicio de la llamada. No se puede cambiar
 *   de negocio a mitad.
 * - Los nombres de variable son sensibles a mayúsculas y tienen que coincidir
 *   exactamente con los del prompt. Si no coinciden, falla en silencio.
 * - Las herramientas no se pueden cambiar por override. Por eso `save_lead` es
 *   la misma para todos: el ruteo lo hace nuestro servidor, no Vapi.
 *
 * Seguridad: secreto de plataforma (`VAPI_WEBHOOK_SECRET`), porque todavía no
 * se sabe de qué inquilino es la llamada cuando hay que autorizarla.
 */

import { timingSafeEqual } from "node:crypto";
import {
  CONSENT_LINE,
  TEMPLATE_ASSISTANT_ID,
  tenantByAgentPhone,
  tenantEnv,
  type Tenant,
} from "@/lib/tenants";

const SECRET = process.env.VAPI_WEBHOOK_SECRET;

type Json = Record<string, unknown>;

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function authorized(request: Request): boolean {
  if (!SECRET) return false;
  const header = request.headers.get("x-vapi-secret") ?? "";
  const bearer = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  return (header !== "" && safeEqual(header, SECRET)) || (bearer !== "" && safeEqual(bearer, SECRET));
}

/** El número al que llamaron. Vapi lo pone en uno de estos dos lugares. */
function dialedNumber(message: Json): string {
  const direct = (message.phoneNumber as Json | undefined)?.number;
  if (typeof direct === "string" && direct.trim() !== "") return direct;
  const call = message.call as Json | undefined;
  const nested = (call?.phoneNumber as Json | undefined)?.number;
  return typeof nested === "string" ? nested : "";
}

/**
 * Los valores que rellenan el prompt compartido. Las claves tienen que
 * coincidir, carácter por carácter, con los `{{...}}` del asistente en Vapi.
 */
function variableValues(tenant: Tenant): Record<string, string> {
  return {
    business_name: tenant.name,
    assistant_name: tenant.assistantName,
    owner_name: tenant.ownerName,
    trade: tenant.trade,
    services: tenant.services.join(", "),
    service_area: tenant.serviceArea,
    hours: tenant.hours,
    item_label: tenant.itemLabel,
    // Aviso de grabación por estado. Va al principio de la llamada: California
    // y Florida exigen el consentimiento de las dos partes.
    consent_line_en: CONSENT_LINE[tenant.state].en,
    consent_line_es: CONSENT_LINE[tenant.state].es,
  };
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "unauthorized" }, { status: SECRET ? 401 : 503 });
  }

  let body: Json;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const message = (body.message ?? body) as Json;
  const dialed = dialedNumber(message);
  const tenant = tenantByAgentPhone(dialed);

  if (!tenant) {
    console.warn(`[vapi] no tenant answers ${dialed || "(unknown number)"}`);
    // Vapi lee este texto en voz alta antes de cortar: mejor una frase
    // entendible que un silencio.
    return Response.json({ error: "This number is not in service. Please check the number and try again." });
  }

  // El asistente propio del inquilino si lo tiene configurado; si no, la plantilla.
  const assistantId =
    tenantEnv(tenant, "VAPI_ASSISTANT_ID", "VAPI_ASSISTANT_ID") ?? TEMPLATE_ASSISTANT_ID;

  return Response.json({
    assistantId,
    assistantOverrides: { variableValues: variableValues(tenant) },
  });
}
