/**
 * Acceso de los paneles a las solicitudes, por inquilino.
 *
 * Cada negocio tiene su propio código: `<INQUILINO>_ADMIN_CODE`. Allegiant
 * sigue leyendo `ALLEGIANT_ADMIN_CODE`, que ya respetaba esa convención.
 *
 * No hay código compartido ni respaldo entre inquilinos a propósito: si un
 * negocio no tiene el suyo configurado, su panel responde "no configurado" en
 * lugar de aceptar el código de otro.
 *
 * La tabla `leads` solo se puede leer con la clave privada de Supabase, que
 * vive en el servidor. El panel manda su código en la cabecera `x-admin-code`.
 */

import { timingSafeEqual } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getTenant, tenantEnv, type Tenant } from "@/lib/tenants";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function adminCode(tenant: Tenant): string | undefined {
  return tenantEnv(tenant, "ADMIN_CODE");
}

/** Falta alguna variable en Vercel: el panel de este inquilino no puede funcionar. */
export function adminConfigured(tenant: Tenant): boolean {
  return Boolean(adminCode(tenant) && SUPABASE_URL && SERVICE_KEY);
}

export function adminAuthorized(tenant: Tenant, request: Request): boolean {
  const wantedCode = adminCode(tenant);
  if (!wantedCode) return false;
  const given = Buffer.from(request.headers.get("x-admin-code") ?? "");
  const wanted = Buffer.from(wantedCode);
  return given.length === wanted.length && timingSafeEqual(given, wanted);
}

/** Respuesta común cuando el código no vale o falta configuración. */
export function adminDenied(tenant: Tenant): Response {
  return adminConfigured(tenant)
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

/**
 * Portero común de las rutas `/api/t/[tenant]/...` de panel.
 *
 * Devuelve el inquilino si el código vale, o la respuesta que hay que
 * contestar si no. Así cada ruta queda en una línea y ninguna se olvida de
 * mirar el código.
 */
export async function adminGate(
  request: Request,
  params: Promise<{ tenant: string }>,
): Promise<Tenant | Response> {
  const tenant = getTenant((await params).tenant);
  if (!tenant) return Response.json({ error: "unknown_tenant" }, { status: 404 });
  if (!adminConfigured(tenant) || !adminAuthorized(tenant, request)) return adminDenied(tenant);
  return tenant;
}
