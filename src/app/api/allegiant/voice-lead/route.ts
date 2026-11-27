/**
 * Herramienta `save_lead` de Jessica, el agente de Allegiant. La URL no cambia
 * nunca: está configurada en el panel de Vapi.
 *
 * Toda la lógica vive en `@/lib/voice-leads`, compartida con el resto de los
 * inquilinos. Acá solo se fija cuál es el inquilino.
 */

import { getTenant } from "@/lib/tenants";
import { handleVoiceLead } from "@/lib/voice-leads";

export async function POST(request: Request) {
  return handleVoiceLead(getTenant("allegiant")!, request);
}
