/**
 * Herramienta `save_lead` del agente de voz de cualquier inquilino:
 * `/api/t/<inquilino>/voice-lead`.
 *
 * Cada inquilino puede tener su propio `<INQUILINO>_VAPI_WEBHOOK_SECRET`; si no
 * lo tiene, vale el compartido.
 */

import { getTenant } from "@/lib/tenants";
import { handleVoiceLead } from "@/lib/voice-leads";

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: id } = await params;
  const tenant = getTenant(id);
  if (!tenant) return Response.json({ error: "unknown_tenant" }, { status: 404 });
  return handleVoiceLead(tenant, request);
}
