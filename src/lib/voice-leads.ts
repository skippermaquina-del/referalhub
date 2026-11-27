/**
 * Herramienta `save_lead` del agente telefónico de Vapi, compartida por todos
 * los inquilinos.
 *
 * El teléfono de la persona NO lo dicta ni lo escribe el agente: sale de la
 * propia llamada (`call.customer.number`), así no hay errores de dígitos. Solo
 * si el número llegó oculto se usa `callbackNumber`, que la persona sí dictó.
 *
 * La solicitud se guarda con el mismo núcleo que el formulario de la página
 * (`handleLead`): misma tabla, mismo estado `pending_approval`, mismo aviso.
 *
 * Los textos que el agente lee en voz alta nombran al dueño del negocio
 * (`tenant.ownerName`), no a una persona fija.
 *
 * Seguridad: se exige el secreto del inquilino (cabecera `x-vapi-secret` o
 * `Authorization: Bearer ...`). Si no está configurado, la ruta no responde.
 */

import { timingSafeEqual } from "node:crypto";
import { handleLead } from "@/lib/leads";
import { tenantByAgentPhone, vapiSecret, type Tenant } from "@/lib/tenants";

type Json = Record<string, unknown>;

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function authorized(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const header = request.headers.get("x-vapi-secret") ?? "";
  const bearer = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  return (header !== "" && safeEqual(header, secret)) || (bearer !== "" && safeEqual(bearer, secret));
}

const str = (v: unknown, max = 200): string =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";

/** Como `str`, pero vacío cuando el agente rellenó con "not given", "unknown", etc. */
const PLACEHOLDER = /^(not given|unknown|none|n\/a|na|no|-+|no lo dio|desconocido)\.?$/i;
const field = (v: unknown, max = 200): string => {
  const s = str(v, max);
  return PLACEHOLDER.test(s) ? "" : s;
};

/** Número de la llamada, o "" si llegó oculto o sin dato. */
function callerNumber(call: Json | undefined): string {
  const customer = call?.customer as Json | undefined;
  const raw = str(customer?.number, 30);
  const digits = raw.replace(/\D/g, "");
  return digits.length >= 7 ? raw : "";
}

/** Las herramientas llegan como { function: { name, arguments } } o { name, arguments }. */
function parseToolCall(tc: Json): { id: string; name: string; args: Json } {
  const fn = (tc.function as Json | undefined) ?? tc;
  let args = fn.arguments ?? tc.arguments ?? {};
  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch {
      args = {};
    }
  }
  return { id: str(tc.id, 80), name: str(fn.name ?? tc.name, 60), args: (args ?? {}) as Json };
}

// Llamadas que ya mandaron una ficha vacía (en memoria; basta para cortar
// reintentos seguidos). El id de llamada es único entre inquilinos.
const emptyCalls = new Set<string>();

/**
 * Entrada por inquilino fijo: la URL ya dice de quién es la llamada y se
 * autoriza con el secreto de ese inquilino.
 */
export async function handleVoiceLead(tenant: Tenant, request: Request): Promise<Response> {
  const secret = vapiSecret(tenant);
  if (!authorized(request, secret)) {
    return Response.json({ error: "unauthorized" }, { status: secret ? 401 : 503 });
  }

  const body = await readJson(request);
  if (!body) return Response.json({ error: "invalid_json" }, { status: 400 });
  return processVoiceLead(tenant, body);
}

/**
 * Entrada compartida: una sola URL para todos los inquilinos.
 *
 * Hace falta porque la herramienta `save_lead` vive en el asistente plantilla
 * y su URL no se puede cambiar por override. Así que el inquilino se resuelve
 * igual que en `assistant-request`: por el número al que llamaron.
 *
 * Se autoriza con el secreto de plataforma, porque todavía no se sabe de qué
 * inquilino es la llamada en el momento de autorizar.
 */
export async function handleSharedVoiceLead(request: Request): Promise<Response> {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!authorized(request, secret)) {
    return Response.json({ error: "unauthorized" }, { status: secret ? 401 : 503 });
  }

  const body = await readJson(request);
  if (!body) return Response.json({ error: "invalid_json" }, { status: 400 });

  const message = (body.message ?? body) as Json;
  const call = message.call as Json | undefined;
  const dialed =
    (message.phoneNumber as Json | undefined)?.number ?? (call?.phoneNumber as Json | undefined)?.number;
  const tenant = tenantByAgentPhone(dialed);

  if (!tenant) {
    console.warn(`[vapi] save_lead from an unrouted number: ${str(dialed, 30) || "(unknown)"}`);
    // El agente lee esto y no se queda mudo esperando.
    return Response.json({
      results: [
        {
          toolCallId: "",
          result: "NOT SAVED because of a configuration error. Apologize, ask the caller to try again later, and end the call politely.",
        },
      ],
    });
  }

  return processVoiceLead(tenant, body);
}

async function readJson(request: Request): Promise<Json | null> {
  try {
    return (await request.json()) as Json;
  } catch {
    return null;
  }
}

async function processVoiceLead(tenant: Tenant, body: Json): Promise<Response> {
  const message = (body.message ?? body) as Json;
  const call = message.call as Json | undefined;
  const toolCalls = ((message.toolCallList ?? message.toolCalls ?? []) as Json[]).map(parseToolCall);

  // Vapi manda otros eventos a la misma dirección; solo nos interesa save_lead.
  const wanted = toolCalls.filter((t) => t.name === "save_lead");
  if (wanted.length === 0) return Response.json({ ok: true });

  const owner = tenant.ownerName;
  const results: { toolCallId: string; result: string }[] = [];

  for (const tool of wanted) {
    const a = tool.args;
    const phone = callerNumber(call) || str(a.callbackNumber, 30);

    if (!phone || phone.replace(/\D/g, "").length < 7) {
      // El agente lee este texto y le pide el número a la persona.
      results.push({
        toolCallId: tool.id,
        result: "NOT SAVED: the caller's number was hidden. Ask for a callback number, repeat it back digit by digit, then call save_lead again with callbackNumber.",
      });
      continue;
    }

    // A veces la ficha llega vacía (la llamada se corta o interrumpen al agente).
    // Igual se guarda el número para que el dueño reciba el aviso y pueda devolver la llamada.
    const empty = !field(a.name, 80) && !field(a.address, 200) && !field(a.appliance, 60);
    // Si el agente repite la ficha vacía en la misma llamada, no se manda otro SMS.
    const callId = str(call?.id, 80);
    if (empty && callId && emptyCalls.has(callId)) {
      results.push({
        toolCallId: tool.id,
        result: `Already saved. Do not call save_lead again. Tell the caller ${owner} will call them back, thank them and end the call.`,
      });
      continue;
    }
    if (empty && callId) {
      if (emptyCalls.size > 500) emptyCalls.clear();
      emptyCalls.add(callId);
    }

    const urgent = a.urgency === "urgent";
    const note = [
      "[PHONE AGENT]",
      empty ? "Details did not come through, call back." : null,
      urgent ? "URGENT." : null,
      a.customerType && a.customerType !== "residential" ? `Customer: ${str(a.customerType, 30)}.` : null,
      field(a.address, 200) ? `Address: ${field(a.address, 200)}.` : null,
      field(a.symptom, 250) ? `Problem: ${field(a.symptom, 250)}.` : null,
      a.offerMentioned === true ? "Mentioned the 20% offer." : null,
      // Cómo nos conoció (Google, YouTube, recomendación...), si lo dijo.
      field(a.source, 60) ? `Heard about us: ${field(a.source, 60)}.` : null,
      str(a.notes, 200) || null,
    ]
      .filter(Boolean)
      .join(" ");

    const response = await handleLead(
      tenant,
      new Request(`http://internal/api/t/${tenant.id}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: str(a.name, 80) || "Phone caller",
          phone,
          appliance: field(a.appliance, 60),
          brand: field(a.brand, 60),
          zip: field(a.zip, 10),
          time: field(a.preferredTime, 40),
          message: note.slice(0, 800),
          lang: a.language === "es" ? "es" : "en",
        }),
      }),
    );

    results.push({
      toolCallId: tool.id,
      result: !response.ok
        ? `NOT SAVED because of a system error. Apologize, say ${owner} will still follow up, and end the call politely.`
        : empty
          ? `Saved the phone number. Do not call save_lead again. Tell the caller ${owner} will call them back, thank them and end the call.`
          : `Saved. Tell the caller ${owner} will call them back, thank them and end the call.`,
    });
  }

  return Response.json({ results });
}
