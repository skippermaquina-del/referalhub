/**
 * Núcleo compartido de captación de solicitudes.
 *
 * Antes vivía dentro de la ruta de Allegiant. Ahora recibe el inquilino y lo
 * usa para todo lo que cambia entre negocios: a quién se le avisa, con qué
 * nombre, y a qué panel apunta el pie del correo. La lógica —validación,
 * campo trampa, orden de entrega, qué cuenta como éxito— es la misma para
 * todos, y se mantiene idéntica a la que ya corría para Allegiant.
 *
 * Entrega, en este orden:
 * 1. Guarda en Supabase (siempre). La casilla `smsConsent` se guarda como
 *    "[SMS OK]" al inicio de la nota; sin esa marca el panel no manda SMS.
 * 2. Correo al dueño por Resend, si hay `RESEND_API_KEY` y `<T>_NOTIFY_EMAIL`.
 *    Las urgentes del agente telefónico llevan "URGENT" en el asunto.
 * 3. Webhook, si hay `<T>_LEADS_WEBHOOK_URL` (Slack, Make, Zapier).
 * 4. SMS al dueño, si la solicitud vino de una llamada del agente de voz.
 * 5. Devuelve ok si llegó por al menos una vía. Si la base falla, el correo
 *    avisa que no quedó en el panel.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { phoneCallSms, textOwner } from "@/lib/notify";
import { tenantEnv, type Tenant } from "@/lib/tenants";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/** Cliente con la clave pública (la tabla tiene RLS). Perezoso, para no romper el build sin env. */
function db(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}

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

/**
 * Reintento sin la columna `tenant`.
 *
 * La migración `add_tenant_to_leads` ya corrió, así que la columna existe. El
 * reintento queda por una sola razón: PostgREST cachea el esquema, y en la
 * ventana entre un cambio de DDL y la recarga de ese caché un insert con una
 * columna nueva puede fallar con PGRST204. Antes que perder la solicitud de un
 * cliente, se guarda con la forma vieja de la fila.
 *
 * El reintento no pierde el consentimiento de SMS: lo vuelve a codificar como
 * el prefijo "[SMS OK]" en la nota, que es donde vivía antes de que existiera
 * la columna. Un dato sin su forma nueva es mejor que un dato perdido.
 *
 * Se puede borrar una vez que se vea en producción un lead guardado con sus
 * columnas nuevas. Si este aviso aparece en los logs después de eso, el
 * problema es el caché de PostgREST, no la migración.
 */
function missingColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") return true;
  const m = error.message ?? "";
  return /tenant|sms_consent/i.test(m) && /column|schema cache/i.test(m);
}

export async function handleLead(tenant: Tenant, request: Request): Promise<Response> {
  const WEBHOOK_URL = tenantEnv(tenant, "LEADS_WEBHOOK_URL");
  const NOTIFY_TO = (tenantEnv(tenant, "NOTIFY_EMAIL") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  // Sin dominio verificado en Resend, solo se puede enviar desde onboarding@resend.dev
  // y únicamente al correo dueño de la cuenta de Resend.
  const NOTIFY_FROM = tenantEnv(tenant, "NOTIFY_FROM") || `${tenant.name} <onboarding@resend.dev>`;

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
  // Casilla opcional del formulario. Sin ella solo se llama, nunca se escribe por SMS.
  // Se guarda en su propia columna, no incrustada en el texto de la nota.
  const smsOk = body.smsConsent === "yes";

  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name || digits.length < 7) {
    return Response.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  // Guarda en Supabase. Si falla, se sigue con el aviso por correo para que
  // el dueño reciba la solicitud igual.
  const row = {
    name: lead.name,
    phone: lead.phone,
    appliance: lead.appliance || null,
    brand: lead.brand || null,
    zip: lead.zip || null,
    time: lead.time || null,
    message: lead.message || null,
    lang,
    status: "pending_approval",
    sms_consent: smsOk,
    // Cuándo lo aceptó. Es el dato que pide una operadora cuando hay que
    // demostrar el consentimiento, así que se guarda al momento de recibirlo.
    sms_consent_at: smsOk ? new Date().toISOString() : null,
  };

  /** La forma vieja de la fila, por si las columnas nuevas todavía no se ven. */
  const legacyRow = (() => {
    const { sms_consent, sms_consent_at, ...rest } = row;
    void sms_consent;
    void sms_consent_at;
    return smsOk
      ? { ...rest, message: `[SMS OK] ${rest.message ?? ""}`.trim().slice(0, limits.message) }
      : rest;
  })();

  let saved = false;
  const supabase = db();
  if (supabase) {
    try {
      let { error: dbError } = await supabase.from("leads").insert({ ...row, tenant: tenant.id });
      if (missingColumn(dbError)) {
        console.warn(`[${tenant.id}] new lead columns not visible yet; inserting the legacy shape`);
        ({ error: dbError } = await supabase.from("leads").insert(legacyRow));
      }
      if (dbError) console.error(`[${tenant.id}] database insert failed`, dbError);
      else saved = true;
    } catch (error) {
      console.error(`[${tenant.id}] unexpected database error`, error);
    }
  } else {
    console.error(`[${tenant.id}] Supabase is not configured`);
  }

  // Aviso al dueño (correo y webhook)
  const fromPhone = lead.message.startsWith("[PHONE AGENT]");
  const notes = lead.message.replace(/^\[(PHONE AGENT|SMS OK)\]\s*/, "");
  const text = [
    `New ${tenant.shortName} visit request (${lang.toUpperCase()})`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.appliance
      ? `${tenant.itemLabel}: ${lead.appliance}${lead.brand ? ` · ${lead.brand}` : ""}`
      : null,
    lead.zip ? `ZIP: ${lead.zip}` : null,
    lead.time ? `Preferred time: ${lead.time}` : null,
    notes ? `Notes: ${notes}` : null,
    fromPhone ? null : `Texts OK: ${smsOk ? "yes" : "no (call only)"}`,
    saved ? null : "NOT SAVED IN THE PANEL (database error). Keep this email.",
  ]
    .filter(Boolean)
    .join("\n");

  let emailed = false;

  if (RESEND_API_KEY && NOTIFY_TO.length) {
    const urgent = fromPhone && lead.message.includes("URGENT.");
    const subject = [
      urgent ? "URGENT -" : null,
      // Llamada en la que el cliente solo pidió que lo llamen de vuelta.
      fromPhone ? (lead.appliance ? "Phone call:" : "Callback request:") : "Website request:",
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
          text: `${text}\n\nCall back: tel:${digits.length === 10 ? `+1${digits}` : lead.phone}\nAll requests: ${tenant.adminUrl}`,
        }),
        cache: "no-store",
      });
      if (res.ok) emailed = true;
      else console.warn(`[${tenant.id}] email returned ${res.status}: ${await res.text()}`);
    } catch (error) {
      console.warn(`[${tenant.id}] email delivery failed`, error);
    }
  }

  if (WEBHOOK_URL) {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lead: { ...lead, tenant: tenant.id, lang, receivedAt: new Date().toISOString() },
        }),
        cache: "no-store",
      });
      if (!res.ok) console.warn(`[${tenant.id}] webhook returned ${res.status}`);
    } catch (error) {
      console.warn(`[${tenant.id}] webhook delivery failed`, error);
    }
  }

  // SMS al dueño por cada solicitud que deja el agente de voz en una llamada.
  let texted = false;
  if (fromPhone) {
    texted = await textOwner(
      tenant,
      phoneCallSms(tenant, {
        name: lead.name,
        phone: lead.phone,
        item: lead.appliance,
        brand: lead.brand,
        zip: lead.zip,
        time: lead.time,
        notes,
        urgent: lead.message.includes("URGENT."),
      }),
    );
  }

  // Solo es un error si la solicitud no llegó a ningún lado.
  if (!saved && !emailed && !texted) {
    return Response.json({ ok: false, error: "database_error" }, { status: 500 });
  }
  return Response.json({ ok: true, saved, emailed, texted });
}
