/**
 * Cotizaciones del cotizador interno.
 *
 * Dos decisiones que vale la pena dejar escritas:
 *
 * 1. El precio se recalcula acá, en el servidor. Lo que manda el teléfono se
 *    usa solo para avisar si no coincide. Si no fuera así, lo guardado sería
 *    "lo que dijo el navegador ese día" y no serviría para fijar precios.
 *
 * 2. Las opciones se filtran contra el modelo antes de guardarse: solo entran
 *    las que existen de verdad. Así la columna `options` queda limpia para
 *    poder agruparla después.
 */

import { adminDb } from "@/lib/admin";
import { GLOBALES, JOBS, cotizar, grupoVisible, type Job, type Seleccion } from "@/data/superhman-pricing";
import type { Tenant } from "@/lib/tenants";

const OUTCOMES = ["accepted", "rejected", "no_reply"] as const;
type Outcome = (typeof OUTCOMES)[number];

/** Deja solo las opciones que el modelo reconoce para este trabajo. */
function limpiarOpciones(job: Job, raw: unknown): Seleccion {
  const dado = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const limpio: Seleccion = {};

  for (const choice of [...job.choices, ...GLOBALES]) {
    // Un grupo que no viene al caso no se guarda: si no, la fila diría que la
    // puerta era hueca en un trabajo donde eso nunca se preguntó.
    if (!grupoVisible(choice, dado as Seleccion)) continue;
    const validas = new Set(choice.options.map((o) => o.id));
    const valor = dado[choice.id];

    if (choice.multiple) {
      const lista = Array.isArray(valor) ? valor : [];
      const buenas = lista.filter((v): v is string => typeof v === "string" && validas.has(v));
      if (buenas.length > 0) limpio[choice.id] = buenas;
    } else if (typeof valor === "string" && validas.has(valor)) {
      limpio[choice.id] = valor;
    }
  }
  return limpio;
}

export async function saveQuote(tenant: Tenant, request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const dado = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const job = JOBS.find((j) => j.id === dado.job);
  if (!job) return Response.json({ error: "unknown_job" }, { status: 400 });

  const pedida = Number(dado.quantity ?? 1);
  const tope = job.perUnit?.max ?? 1;
  const cantidad = Number.isFinite(pedida) ? Math.min(Math.max(Math.trunc(pedida), 1), tope) : 1;

  const options = limpiarOpciones(job, dado.options);
  const r = cotizar(job, options, cantidad);

  // Si el teléfono calculó otra cosa, manda el servidor: queda anotado para
  // poder encontrar después una versión vieja de la app dando vuelta.
  const delCliente = Number(dado.total);
  const descuadre = Number.isFinite(delCliente) && delCliente !== r.total;

  const texto = (v: unknown, max: number) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;

  const { data, error } = await adminDb()
    .from("quotes")
    .insert({
      tenant,
      job: job.id,
      quantity: cantidad,
      options,
      total: r.total,
      // Lo que pidió el cliente con sus palabras. Dentro de seis meses es
      // esto, y no las opciones, lo que explica por qué el número fue ese.
      description: texto(dado.description, 4000),
      photo_path: texto(dado.photo_path, 500),
      // Lo que leyó la IA va aparte de lo que dijo el cliente: una cosa es un
      // hecho y la otra una suposición, y conviene no mezclarlas.
      photo_read: dado.photo_read && typeof dado.photo_read === "object" ? dado.photo_read : null,
      notes: descuadre ? `el telefono mostro $${delCliente}` : null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[quotes] no se pudo guardar:", error.message);
    return Response.json({ error: "db" }, { status: 500 });
  }
  return Response.json({ id: data.id, total: r.total, mismatch: descuadre });
}

/** Las últimas cotizaciones de este inquilino, para marcarles el resultado. */
export async function listQuotes(tenant: Tenant): Promise<Response> {
  const { data, error } = await adminDb()
    .from("quotes")
    .select("id, created_at, job, quantity, total, outcome, final_price, notes")
    .eq("tenant", tenant)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) {
    console.error("[quotes] no se pudo listar:", error.message);
    return Response.json({ error: "db" }, { status: 500 });
  }
  return Response.json({ quotes: data ?? [] });
}

/** Marca qué pasó con una cotización. Es el dato que calibra los precios. */
export async function updateQuoteOutcome(tenant: Tenant, request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const dado = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const id = Number(dado.id);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "bad_id" }, { status: 400 });

  const outcome = dado.outcome;
  if (!OUTCOMES.includes(outcome as Outcome)) {
    return Response.json({ error: "bad_outcome" }, { status: 400 });
  }

  const precio = Number(dado.final_price);
  const final_price = Number.isFinite(precio) && precio >= 0 ? precio : null;

  // El filtro por inquilino va también acá: un código no puede tocar lo de otro.
  const { data, error } = await adminDb()
    .from("quotes")
    .update({ outcome, final_price })
    .eq("id", id)
    .eq("tenant", tenant)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[quotes] no se pudo actualizar:", error.message);
    return Response.json({ error: "db" }, { status: 500 });
  }
  if (!data) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ ok: true });
}
