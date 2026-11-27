/**
 * Solicitudes del panel de Allegiant. URL histórica, conservada.
 * La lógica vive en `@/lib/admin-leads`, acotada al inquilino.
 */

import { adminAuthorized, adminConfigured, adminDenied } from "@/lib/admin";
import { listPendingLeads, updateLeadStatus } from "@/lib/admin-leads";
import { getTenant } from "@/lib/tenants";

const tenant = getTenant("allegiant")!;

export async function GET(request: Request) {
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return listPendingLeads(tenant);
}

export async function PATCH(request: Request) {
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return updateLeadStatus(tenant, request);
}
