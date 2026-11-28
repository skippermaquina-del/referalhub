/** Dirección firmada para subir la foto del trabajo directo a Supabase. */

import { adminGate } from "@/lib/admin";
import { photoUploadUrl } from "@/lib/quote-photo";

export async function POST(request: Request, { params }: { params: Promise<{ tenant: string }> }) {
  const t = await adminGate(request, params);
  return t instanceof Response ? t : photoUploadUrl(t, request);
}
