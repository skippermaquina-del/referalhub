/**
 * Acceso del panel de Allegiant (/allegiant/admin) a las solicitudes.
 *
 * La tabla `leads` solo se puede leer con la clave privada de Supabase, que
 * vive en el servidor. El panel manda su código en la cabecera `x-admin-code`
 * y el servidor lo compara con `ALLEGIANT_ADMIN_CODE`.
 */

import { timingSafeEqual } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const ADMIN_CODE = process.env.ALLEGIANT_ADMIN_CODE;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Falta alguna variable en Vercel: el panel no puede funcionar. */
export function adminConfigured(): boolean {
  return Boolean(ADMIN_CODE && SUPABASE_URL && SERVICE_KEY);
}

export function adminAuthorized(request: Request): boolean {
  if (!ADMIN_CODE) return false;
  const given = Buffer.from(request.headers.get("x-admin-code") ?? "");
  const wanted = Buffer.from(ADMIN_CODE);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/** Respuesta común cuando el código no vale o falta configuración. */
export function adminDenied(): Response {
  return adminConfigured()
    ? Response.json({ error: "unauthorized" }, { status: 401 })
    : Response.json({ error: "not_configured" }, { status: 503 });
}

let db: SupabaseClient | null = null;

/** Cliente con la clave privada. Solo para rutas que ya pasaron `adminAuthorized`. */
export function adminDb(): SupabaseClient {
  if (!db) {
    db = createClient(SUPABASE_URL!, SERVICE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return db;
}
