/**
 * Recibe de Vapi la herramienta `save_lead` del agente telefónico.
 *
 * El teléfono de la persona NO lo dicta ni lo escribe el agente: sale de la
 * propia llamada (`call.customer.number`), así no hay errores de dígitos. Solo
 * si el número llegó oculto se usa `callbackNumber`, que la persona sí dictó.
 *
 * La solicitud se guarda con el mismo manejador que el formulario de la página
 * (`../lead/route`): misma tabla, mismo estado `pending_approval`, mismo aviso.
 *
 * Seguridad: se exige `VAPI_WEBHOOK_SECRET` (cabecera `x-vapi-secret` o
 * `Authorization: Bearer ...`). Si no está configurada, la ruta no responde.
 */

import { timingSafeEqual } from "node:crypto";
import { POST as saveLead } from "../lead/route";

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
  const call = message.call as Json | undefined;
  const toolCalls = ((message.toolCallList ?? message.toolCalls ?? []) as Json[]).map(parseToolCall);

  // Vapi manda otros eventos a la misma dirección; solo nos interesa save_lead.
  const wanted = toolCalls.filter((t) => t.name === "save_lead");
  if (wanted.length === 0) return Response.json({ ok: true });

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

    const urgent = a.urgency === "urgent";
    const note = [
      "[PHONE AGENT]",
      urgent ? "URGENT." : null,
      a.customerType && a.customerType !== "residential" ? `Customer: ${str(a.customerType, 30)}.` : null,
      field(a.address, 200) ? `Address: ${field(a.address, 200)}.` : null,
      field(a.symptom, 250) ? `Problem: ${field(a.symptom, 250)}.` : null,
      a.offerMentioned === true ? "Mentioned the 20% offer." : null,
      str(a.notes, 200) || null,
    ]
      .filter(Boolean)
      .join(" ");

    const response = await saveLead(
      new Request("http://internal/api/allegiant/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: str(a.name, 80),
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
      result: response.ok
        ? "Saved. Tell the caller Vadim will call them back, thank them and end the call."
        : "NOT SAVED because of a system error. Apologize, say Vadim will still follow up, and end the call politely.",
    });
  }

  return Response.json({ results });
}
