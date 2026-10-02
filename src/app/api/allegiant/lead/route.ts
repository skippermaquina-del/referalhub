/**
 * Recibe las solicitudes de visita del formulario de Allegiant.
 *
 * Entrega: si `ALLEGIANT_LEADS_WEBHOOK_URL` está configurada, cada solicitud se
 * reenvía allí (compatible con webhooks de Slack, Make, Zapier, etc.: manda un
 * campo `text` legible y el objeto `lead`). Sin esa variable, la solicitud solo
 * queda en el log del servidor, así que hay que configurarla antes de publicar.
 */

const WEBHOOK_URL = process.env.ALLEGIANT_LEADS_WEBHOOK_URL;

const limits = {
  name: 80,
  phone: 30,
  appliance: 60,
  brand: 60,
  zip: 10,
  time: 40,
  message: 800,
} as const;

type Field = keyof typeof limits;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Campo trampa: los bots lo llenan, las personas no. Se responde "ok" sin hacer nada.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const lead = {} as Record<Field, string>;
  (Object.keys(limits) as Field[]).forEach((field) => {
    lead[field] = clean(body[field], limits[field]);
  });
  const lang = body.lang === "es" ? "es" : "en";

  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name || digits.length < 7) {
    return Response.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const text = [
    `New Allegiant visit request (${lang.toUpperCase()})`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Appliance: ${lead.appliance}${lead.brand ? ` · ${lead.brand}` : ""}`,
    lead.zip ? `ZIP: ${lead.zip}` : null,
    lead.time ? `Preferred time: ${lead.time}` : null,
    lead.message ? `Notes: ${lead.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  if (!WEBHOOK_URL) {
    console.warn("[allegiant] ALLEGIANT_LEADS_WEBHOOK_URL is not set; lead was not delivered:\n" + text);
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lead: { ...lead, lang, receivedAt: new Date().toISOString() } }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return Response.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[allegiant] lead delivery failed", error);
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
