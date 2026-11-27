/**
 * Formulario de cualquier inquilino: `/api/t/<inquilino>/lead`.
 *
 * Allegiant conserva además su URL histórica, que apunta al mismo núcleo.
 */

import { handleLead } from "@/lib/leads";
import { getTenant } from "@/lib/tenants";

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: id } = await params;
  const tenant = getTenant(id);
  if (!tenant) return Response.json({ ok: false, error: "unknown_tenant" }, { status: 404 });
  return handleLead(tenant, request);
}
