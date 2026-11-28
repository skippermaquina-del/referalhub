/**
 * Lectura de la foto del trabajo.
 *
 * Describe, cuenta, avisa y dice qué preguntar. No pone precios: lo que
 * sugiere pasa por la lista blanca del modelo antes de salir de acá.
 */

import { adminGate } from "@/lib/admin";
import { analyzePhoto } from "@/lib/quote-photo";

export const maxDuration = 60;

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await adminGate(request, params);
  return t instanceof Response ? t : analyzePhoto(t, request);
}
