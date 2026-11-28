/**
 * La foto del trabajo: subirla y leerla.
 *
 * La lectura no toca el precio, y eso no es una promesa del prompt: el
 * servidor filtra lo que sugiere la IA contra `puedeSugerir`, que mira la
 * opción de verdad dentro del trabajo. Lo que no esté marcado como
 * "se ve en una foto" se descarta acá, diga lo que diga el modelo.
 *
 * El tipo de pared es el caso que importa. Pintados, el drywall y el bloque
 * son la misma pared blanca, y es la opción que más mueve el número ($45).
 * Una IA igual va a contestar, porque siempre contesta. Por eso no está en
 * la lista y la foto, en cambio, genera la pregunta.
 */

import { randomUUID } from "node:crypto";
import { adminDb } from "@/lib/admin";
import { JOBS, puedeSugerir, type Job } from "@/data/superhman-pricing";
import type { Tenant } from "@/lib/tenants";

export const QUOTE_BUCKET = "quotes";
/** Lo que manda un teléfono después de achicar la foto. De sobra. */
export const MAX_BYTES = 8 * 1024 * 1024;

const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
};

const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

/** Dirección firmada para que el teléfono suba la foto directo a Supabase. */
export async function photoUploadUrl(tenant: Tenant, request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const dado = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const ext = TIPOS[typeof dado.type === "string" ? dado.type : ""];
  if (!ext) return Response.json({ error: "unsupported_type" }, { status: 400 });

  const size = typeof dado.size === "number" ? dado.size : 0;
  if (size <= 0 || size > MAX_BYTES) return Response.json({ error: "too_large" }, { status: 400 });

  const dia = new Date().toISOString().slice(0, 10);
  const path = `${tenant.id}/${dia}/${randomUUID()}.${ext}`;

  const { data, error } = await adminDb().storage.from(QUOTE_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[quote-photo] no se pudo firmar la subida:", error?.message);
    return Response.json({ error: "storage" }, { status: 500 });
  }
  return Response.json({ path, token: data.token });
}

type Lectura = {
  resumen: string;
  piezas: number | null;
  preguntar: string[];
  alertas: string[];
  sugerencias: { choice: string; option: string }[];
};

const schema = {
  type: "object",
  properties: {
    resumen: { type: "string" },
    piezas: { type: "integer" },
    preguntar: { type: "array", items: { type: "string" } },
    alertas: { type: "array", items: { type: "string" } },
    sugerencias: {
      type: "array",
      items: {
        type: "object",
        properties: { choice: { type: "string" }, option: { type: "string" } },
        required: ["choice", "option"],
      },
    },
  },
  required: ["resumen", "preguntar", "alertas", "sugerencias"],
};

/** Lo único que la IA puede llegar a elegir, servido como catálogo. */
function catalogo(job: Job) {
  return job.choices
    .map((c) => ({
      choice: c.id,
      label: c.label,
      options: c.options
        .filter((o) => o.fromPhoto)
        .map((o) => ({ option: o.id, label: o.label })),
    }))
    .filter((c) => c.options.length > 0);
}

function instruccion(job: Job): string {
  return `Sos el ayudante de un handyman en Broward, Florida. Te paso la foto que mandó un cliente para el trabajo "${job.label}". Vas a hablarle a él, no al cliente, en español rioplatense, corto y concreto.

Devolvé:

- "resumen": dos o tres renglones de lo que se ve. Hechos, no opiniones.
- "piezas": cuántas unidades del trabajo se ven (agujeros, estantes, muebles). Si no corresponde o no se puede contar, no lo pongas.
- "preguntar": lo que hace falta saber para dar un precio y NO se puede sacar de la foto. Importantísimo: el tipo de pared (drywall, montantes de metal o bloque de concreto) NO se puede saber mirando una foto, así que si el trabajo depende de eso, ponelo siempre acá. Preguntas cortas, como se las haría al cliente.
- "alertas": riesgos o cosas que cambian el trabajo. Si ves popcorn en el techo, decilo. Si ves un tomacorriente justo donde va el TV, decilo. Si parece muy alto o muy pesado para una persona sola, decilo.
- "sugerencias": SOLO opciones de esta lista, y solo si la foto alcanza para estar bastante seguro. Si dudás, no la pongas y mandá una pregunta en su lugar. Lista:

${JSON.stringify(catalogo(job), null, 2)}

Nunca inventes un precio ni hables de plata. El precio lo pone él.`;
}

async function leerConGemini(job: Job, mime: string, base64: string): Promise<Lectura> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("falta GEMINI_API_KEY");

  for (let intento = 1; intento <= 2; intento++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ inlineData: { mimeType: mime, data: base64 } }] }],
          systemInstruction: { parts: [{ text: instruccion(job) }] },
          generationConfig: { responseMimeType: "application/json", responseSchema: schema },
        }),
      },
    );

    if (res.ok) {
      const data = await res.json();
      const txt: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      return JSON.parse(txt) as Lectura;
    }
    if ((res.status === 503 || res.status === 429) && intento < 2) {
      await new Promise((r) => setTimeout(r, 1500));
      continue;
    }
    throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  }
  throw new Error("inalcanzable");
}

const textos = (v: unknown, max: number): string[] =>
  (Array.isArray(v) ? v : [])
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.trim().slice(0, 300))
    .slice(0, max);

export async function analyzePhoto(tenant: Tenant, request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const dado = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const job = JOBS.find((j) => j.id === dado.job);
  if (!job) return Response.json({ error: "unknown_job" }, { status: 400 });

  const path = typeof dado.path === "string" ? dado.path : "";
  // La ruta la dio este mismo servidor al firmar la subida. Igual se comprueba
  // que empiece por el inquilino, para que un código no lea la foto de otro.
  if (!path.startsWith(`${tenant.id}/`) || path.includes("..")) {
    return Response.json({ error: "bad_path" }, { status: 400 });
  }

  const { data: archivo, error } = await adminDb().storage.from(QUOTE_BUCKET).download(path);
  if (error || !archivo) {
    console.error("[quote-photo] no se pudo bajar la foto:", error?.message);
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const bytes = Buffer.from(await archivo.arrayBuffer());
  if (bytes.byteLength > MAX_BYTES) return Response.json({ error: "too_large" }, { status: 400 });
  const mime = archivo.type || "image/jpeg";

  let cruda: Lectura;
  try {
    cruda = await leerConGemini(job, mime, bytes.toString("base64"));
  } catch (e) {
    console.error("[quote-photo] la lectura falló:", e instanceof Error ? e.message : e);
    return Response.json({ error: "vision" }, { status: 502 });
  }

  // El filtro. Lo que la IA proponga fuera de la lista blanca se cae acá.
  const sugerencias = (Array.isArray(cruda.sugerencias) ? cruda.sugerencias : [])
    .filter(
      (s): s is { choice: string; option: string } =>
        Boolean(s) && typeof s.choice === "string" && typeof s.option === "string",
    )
    .filter((s) => puedeSugerir(job, s.choice, s.option))
    .slice(0, 6);

  const piezas =
    typeof cruda.piezas === "number" && Number.isFinite(cruda.piezas)
      ? Math.min(Math.max(Math.trunc(cruda.piezas), 1), job.perUnit?.max ?? 1)
      : null;

  return Response.json({
    resumen: typeof cruda.resumen === "string" ? cruda.resumen.trim().slice(0, 1200) : "",
    piezas: job.perUnit ? piezas : null,
    preguntar: textos(cruda.preguntar, 6),
    alertas: textos(cruda.alertas, 6),
    sugerencias,
  });
}
