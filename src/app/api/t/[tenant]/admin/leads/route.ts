/**
 * Solicitudes del panel de cualquier inquilino.
 *
 * Cada negocio entra con su propio `<INQUILINO>_ADMIN_CODE` y solo ve y toca
 * lo suyo: el filtro por inquilino va tanto al listar como al cambiar estado.
 */

import { adminAuthorized, adminConfigured, adminDenied } from "@/lib/admin";
import { listPendingLeads, updateLeadStatus } from "@/lib/admin-leads";
import { getTenant } from "@/lib/tenants";

export async function GET(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const tenant = getTenant((await params).tenant);
  if (!tenant) return Response.json({ error: "unknown_tenant" }, { status: 404 });
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return listPendingLeads(tenant);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const tenant = getTenant((await params).tenant);
  if (!tenant) return Response.json({ error: "unknown_tenant" }, { status: 404 });
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return updateLeadStatus(tenant, request);
}
