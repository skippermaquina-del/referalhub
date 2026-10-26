/**
 * Recibe las solicitudes de visita del formulario de Allegiant.
 *
 * Entrega:
 * 1. Guarda la solicitud en Supabase (siempre, sin excepciones).
 * 2. Si `RESEND_API_KEY` y `ALLEGIANT_NOTIFY_EMAIL` están configuradas, manda un
 *    correo a Vadim con la solicitud (vía Resend). Las urgentes del agente
 *    telefónico llevan "URGENT" en el asunto.
 * 3. Si `ALLEGIANT_LEADS_WEBHOOK_URL` está configurada, envía un aviso al webhook
 *    (compatible con Slack, Make, Zapier, etc.).
 * 4. Devuelve {ok: true, saved: true} si se guardó en la BD. Si el aviso falla,
 *    la solicitud queda guardada igual.
 */

import { createClient } from "@supabase/supabase-js";

const WEBHOOK_URL = process.env.ALLEGIANT_LEADS_WEBHOOK_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Una o varias direcciones separadas por coma.
const NOTIFY_TO = (process.env.ALLEGIANT_NOTIFY_EMAIL ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// Sin dominio verificado en Resend, solo se puede enviar desde onboarding@resend.dev
// y únicamente al correo dueño de la cuenta de Resend.
const NOTIFY_FROM = process.env.ALLEGIANT_NOTIFY_FROM || "Allegiant Appliances <onboarding@resend.dev>";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase config");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

  // Guarda en Supabase primero
  try {
    const { error: dbError } = await supabase.from("leads").insert({
      name: lead.name,
      phone: lead.phone,
      appliance: lead.appliance || null,
      brand: lead.brand || null,
      zip: lead.zip || null,
      time: lead.time || null,
      message: lead.message || null,
      lang,
      status: "pending_approval",
    });

    if (dbError) {
      console.error("[allegiant] database insert failed", dbError);
      return Response.json({ ok: false, error: "database_error" }, { status: 500 });
    }
  } catch (error) {
    console.error("[allegiant] unexpected database error", error);
    return Response.json({ ok: false, error: "database_error" }, { status: 500 });
  }

  // Notifica por webhook si está configurado
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

  if (RESEND_API_KEY && NOTIFY_TO.length) {
    const fromPhone = lead.message.startsWith("[PHONE AGENT]");
    const urgent = fromPhone && lead.message.includes("URGENT.");
    const subject = [
      urgent ? "URGENT -" : null,
      fromPhone ? "Phone call:" : "Website request:",
      lead.name,
      lead.appliance ? `· ${lead.appliance}${lead.brand ? ` ${lead.brand}` : ""}` : null,
    ]
      .filter(Boolean)
      .join(" ");
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: NOTIFY_FROM,
          to: NOTIFY_TO,
          subject: subject.slice(0, 150),
          text: `${text}\n\nCall back: tel:${digits.length === 10 ? `+1${digits}` : lead.phone}\nAll requests: https://allegiantappliance.com/allegiant/admin`,
        }),
        cache: "no-store",
      });
      if (!res.ok) console.warn(`[allegiant] email returned ${res.status}: ${await res.text()}`);
    } catch (error) {
      console.warn("[allegiant] email delivery failed (lead saved anyway)", error);
    }
  }

  if (WEBHOOK_URL) {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lead: { ...lead, lang, receivedAt: new Date().toISOString() } }),
        cache: "no-store",
      });
      if (!res.ok) console.warn(`[allegiant] webhook returned ${res.status}`);
    } catch (error) {
      console.warn("[allegiant] webhook delivery failed (lead saved anyway)", error);
    }
  }

  return Response.json({ ok: true, saved: true });
}
