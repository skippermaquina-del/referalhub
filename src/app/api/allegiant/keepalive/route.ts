/**
 * Consulta mínima a Supabase una vez al día (cron de Vercel en vercel.json).
 * El plan gratuito de Supabase pausa el proyecto tras una semana sin actividad,
 * y entonces el formulario y el agente telefónico no pueden guardar solicitudes.
 */

import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "missing_config" }, { status: 500 });

  const { error } = await createClient(url, key).from("leads").select("id", { head: true, count: "exact" }).limit(1);
  if (error) {
    console.error("[allegiant] keepalive failed", error);
    return Response.json({ ok: false }, { status: 500 });
  }
  return Response.json({ ok: true });
}
