/**
 * Solicitudes del panel, acotadas al inquilino.
 *
 * El filtro por `tenant` va en las DOS operaciones, y eso es deliberado:
 *
 * - En el listado, para que cada dueño vea lo suyo.
 * - En el cambio de estado, porque sin esa condición bastaría conocer el id de
 *   una solicitud ajena para aprobarla o rechazarla desde otro panel. Filtrar
 *   solo al leer da una lista correcta y deja la escritura abierta.
 *
 * `updated_at` se escribe acá y no se deja al default de la tabla, que solo
 * aplica al insertar.
 */

import { adminDb } from "@/lib/admin";
import type { Tenant } from "@/lib/tenants";

const STATUSES = new Set(["confirmed", "declined"]);

export async function listPendingLeads(tenant: Tenant): Promise<Response> {
  const { data, error } = await adminDb()
    .from("leads")
    .select("*")
    .eq("tenant", tenant.id)
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`[${tenant.id} admin] list failed`, error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }
  return Response.json({ leads: data ?? [] });
}

export async function updateLeadStatus(tenant: Tenant, request: Request): Promise<Response> {
  let body: { id?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id || !STATUSES.has(status)) {
    return Response.json({ error: "invalid_fields" }, { status: 400 });
  }

  const { data, error } = await adminDb()
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("tenant", tenant.id)
    .select("id");

  if (error) {
    console.error(`[${tenant.id} admin] update failed`, error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }
  // Sin filas: el id no existe, o es de otro inquilino. No se distingue a
  // propósito, para no confirmar desde un panel ajeno que ese id existe.
  if (!data || data.length === 0) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}

/** Una solicitud de este inquilino, o null. Para el SMS del panel. */
export async function getLead(tenant: Tenant, id: string) {
  const { data, error } = await adminDb()
    .from("leads")
    .select("id, name, phone, appliance, brand, message, zip, time")
    .eq("id", id)
    .eq("tenant", tenant.id)
    .maybeSingle();
  if (error) {
    console.error(`[${tenant.id} admin] lead lookup failed`, error);
    return null;
  }
  return data;
}
