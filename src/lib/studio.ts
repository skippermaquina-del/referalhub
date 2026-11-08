/**
 * Servidor del Estudio de Shorts (/studio).
 *
 * Cada proyecto entra con su código (`STUDIO_CODE_<SLUG>` en Vercel), que el
 * navegador manda en la cabecera `x-studio-code`. El almacén y la tabla se
 * usan con la clave privada de Supabase, que nunca sale del servidor.
 */

import { timingSafeEqual } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { studioProjects, type StudioProject } from "@/data/studio-projects";

export const STUDIO_BUCKET = "studio";
/** Límite del plan gratuito de Supabase por archivo. */
export const STUDIO_MAX_BYTES = 50 * 1024 * 1024;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Proyecto al que pertenece el código, o null si no coincide con ninguno. */
export function projectForCode(code: string | null): StudioProject | null {
  const given = (code ?? "").trim();
  if (!given) return null;
  for (const project of Object.values(studioProjects)) {
    const wanted = process.env[`STUDIO_CODE_${project.slug.toUpperCase()}`];
    if (wanted && safeEqual(given, wanted)) return project;
  }
  return null;
}

export function studioProject(request: Request): StudioProject | null {
  return projectForCode(request.headers.get("x-studio-code"));
}

export function studioConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

export function studioDenied(): Response {
  return studioConfigured()
    ? Response.json({ error: "unauthorized" }, { status: 401 })
    : Response.json({ error: "not_configured" }, { status: 503 });
}

let db: SupabaseClient | null = null;

export function studioDb(): SupabaseClient {
  if (!db) {
    db = createClient(SUPABASE_URL!, SERVICE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return db;
}

/**
 * Pide a GitHub Actions que arme el video ya mismo. Si falta el token, no pasa
 * nada: la tarea programada del repositorio revisa la cola cada pocos minutos.
 */
export async function triggerRender(): Promise<boolean> {
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const repo = process.env.STUDIO_GITHUB_REPO || "skippermaquina-del/referalhub";
  if (!token) return false;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/studio-render.yml/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "master" }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.warn(`[studio] dispatch returned ${res.status}`);
    return res.ok;
  } catch (error) {
    console.warn("[studio] dispatch failed", error);
    return false;
  }
}

/** Datos del proyecto que el navegador puede ver (sin nada secreto). */
export function publicProject(p: StudioProject) {
  return { slug: p.slug, name: p.name, primary: p.primary, accent: p.accent, logo: `/${p.logo}` };
}
