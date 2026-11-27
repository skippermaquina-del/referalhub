/**
 * SMS que el panel le manda al dueño cuando aprueba una solicitud.
 *
 * El panel manda solo el id. El contenido del mensaje se arma en el servidor
 * con lo que hay en la base, acotado al inquilino: antes venían el nombre y el
 * teléfono desde el navegador, así que cualquiera con el código del panel
 * podía mandar el texto que quisiera al celular del dueño.
 */

import { adminDb } from "@/lib/admin";
import { getLead } from "@/lib/admin-leads";
import { textOwner } from "@/lib/notify";
import { ownerPhone, type Tenant } from "@/lib/tenants";

export async function sendLeadSms(tenant: Tenant, request: Request): Promise<Response> {
  if (!ownerPhone(tenant)) {
    return Response.json({ error: "owner_phone_not_configured" }, { status: 500 });
  }

  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return Response.json({ error: "invalid_fields" }, { status: 400 });

  const lead = await getLead(tenant, id);
  // Mismo 404 para "no existe" y "es de otro inquilino".
  if (!lead) return Response.json({ error: "not_found" }, { status: 404 });

  const note = (lead.message ?? "").replace(/^\[(PHONE AGENT|SMS OK)\]\s*/, "");
  const sent = await textOwner(
    tenant,
    [
      `New ${tenant.shortName} lead: ${lead.name} (${lead.phone})`,
      lead.appliance ? `${tenant.itemLabel}: ${lead.appliance}${lead.brand ? ` ${lead.brand}` : ""}` : null,
      note ? `Note: ${note}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  if (!sent) return Response.json({ error: "sms_failed" }, { status: 502 });
  return Response.json({ ok: true });
}

// Reexport para que las rutas no tengan que importar de dos lados.
export { adminDb };
