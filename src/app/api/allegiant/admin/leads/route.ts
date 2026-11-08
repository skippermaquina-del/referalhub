/**
 * Solicitudes para el panel de Allegiant.
 * GET: las pendientes de aprobación. PATCH { id, status }: aprobar o rechazar.
 * Ambas exigen el código del panel (ver `@/lib/allegiant-admin`).
 */

import { adminAuthorized, adminConfigured, adminDb, adminDenied } from "@/lib/allegiant-admin";

const STATUSES = new Set(["confirmed", "declined"]);

export async function GET(request: Request) {
  if (!adminConfigured() || !adminAuthorized(request)) return adminDenied();

  const { data, error } = await adminDb()
    .from("leads")
    .select("*")
    .eq("status", "pending_approval")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[allegiant admin] list failed", error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }
  return Response.json({ leads: data ?? [] });
}

export async function PATCH(request: Request) {
  if (!adminConfigured() || !adminAuthorized(request)) return adminDenied();

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

  const { error } = await adminDb().from("leads").update({ status }).eq("id", id);
  if (error) {
    console.error("[allegiant admin] update failed", error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }
  return Response.json({ ok: true });
}
