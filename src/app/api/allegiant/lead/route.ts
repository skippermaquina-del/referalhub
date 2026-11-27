/**
 * Formulario de Allegiant. La URL no cambia nunca: está publicada en el sitio
 * en producción y configurada en Vapi.
 *
 * Toda la lógica vive en `@/lib/leads`, compartida con el resto de los
 * inquilinos. Acá solo se fija cuál es el inquilino.
 */

import { handleLead } from "@/lib/leads";
import { getTenant } from "@/lib/tenants";

export async function POST(request: Request) {
  return handleLead(getTenant("allegiant")!, request);
}
