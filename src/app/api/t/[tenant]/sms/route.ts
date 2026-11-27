/** SMS al dueño desde el panel de cualquier inquilino. */

import { adminAuthorized, adminConfigured, adminDenied } from "@/lib/admin";
import { sendLeadSms } from "@/lib/admin-sms";
import { getTenant } from "@/lib/tenants";

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const tenant = getTenant((await params).tenant);
  if (!tenant) return Response.json({ error: "unknown_tenant" }, { status: 404 });
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return sendLeadSms(tenant, request);
}
