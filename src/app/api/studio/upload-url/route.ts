/**
 * Da una dirección firmada para subir un archivo directo a Supabase desde el
 * teléfono (Vercel no deja pasar archivos grandes por sus funciones).
 */

import { randomUUID } from "node:crypto";
import { STUDIO_BUCKET, STUDIO_MAX_BYTES, studioConfigured, studioDb, studioDenied, studioProject } from "@/lib/studio";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
};

export async function POST(request: Request) {
  const project = studioProject(request);
  if (!studioConfigured() || !project) return studioDenied();

  let body: { type?: unknown; size?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const type = typeof body.type === "string" ? body.type : "";
  const size = typeof body.size === "number" ? body.size : 0;
  const ext = TYPES[type];
  if (!ext) return Response.json({ error: "unsupported_type" }, { status: 400 });
  if (size <= 0 || size > STUDIO_MAX_BYTES) return Response.json({ error: "too_large" }, { status: 400 });

  const day = new Date().toISOString().slice(0, 10);
  const path = `uploads/${project.slug}/${day}/${randomUUID()}.${ext}`;
  const { data, error } = await studioDb().storage.from(STUDIO_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[studio] signed upload failed", error);
    return Response.json({ error: "storage_error" }, { status: 500 });
  }
  return Response.json({ path, token: data.token });
}
