/**
 * `save_lead` del asistente plantilla, para todos los inquilinos.
 *
 * Una sola URL, porque la herramienta vive en el asistente compartido y Vapi
 * no deja cambiarla por override. El inquilino se resuelve por el número al
 * que llamaron, igual que en `assistant-request`.
 *
 * Esta es la URL que va en la herramienta `save_lead` de la plantilla. Las
 * rutas `/api/t/<inquilino>/voice-lead` siguen existiendo para los agentes que
 * tienen su propio asistente, como Jessica.
 */

import { handleSharedVoiceLead } from "@/lib/voice-leads";

export async function POST(request: Request) {
  return handleSharedVoiceLead(request);
}
