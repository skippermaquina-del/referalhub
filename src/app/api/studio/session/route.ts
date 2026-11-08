/** Comprueba el código del Estudio y devuelve los datos públicos del proyecto. */

import { publicProject, studioConfigured, studioDenied, studioProject } from "@/lib/studio";

export async function GET(request: Request) {
  const project = studioProject(request);
  if (!studioConfigured() || !project) return studioDenied();
  return Response.json({ project: publicProject(project) });
}
