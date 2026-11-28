"use client";

import { useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  GLOBALES,
  JOBS,
  cotizar,
  grupoVisible,
  mensaje,
  type Job,
  type Lang,
  type Seleccion,
} from "@/data/superhman-pricing";

/**
 * Herramienta interna de cotización.
 *
 * Está pensada para usarse con el teléfono en una mano, mirando una foto que
 * el cliente acaba de mandar: elegís el trabajo, tocás tres o cuatro cosas, y
 * sale el número y el mensaje listo para pegar.
 *
 * Cada cotización se guarda. No es por prolijidad: son los datos con los que
 * después se le pueden poner precios reales a una calculadora pública, en vez
 * de inventarlos.
 *
 * La foto no cotiza. Describe, cuenta, avisa y dice qué preguntar; lo que
 * sugiere son botones que hay que tocar. Una sugerencia equivocada cuesta
 * cero porque está a la vista.
 */

const LANGS: { id: Lang; label: string }[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
];

type Lectura = {
  resumen: string;
  piezas: number | null;
  preguntar: string[];
  alertas: string[];
  sugerencias: { choice: string; option: string }[];
};

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null;

/** Opciones por defecto: la primera de cada grupo de una sola elección. */
function porDefecto(job: Job): Seleccion {
  const sel: Seleccion = {};
  for (const c of [...job.choices, ...GLOBALES]) {
    if (!c.multiple) sel[c.id] = c.options[0].id;
    else sel[c.id] = [];
  }
  return sel;
}

/**
 * Achica la foto antes de subirla. Un teléfono saca 4 MB; 1600 px al lado
 * largo pesa unos 300 KB, sube en un parpadeo con datos móviles y la IA ve
 * exactamente lo mismo. Si el navegador no puede abrirla (pasa con HEIC fuera
 * de Safari), se sube tal cual y el servidor se arregla.
 */
async function achicar(file: File): Promise<{ cuerpo: Blob; tipo: string }> {
  const MAX = 1600;
  const crudo = { cuerpo: file as Blob, tipo: file.type || "image/jpeg" };
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
    if (escala === 1 && file.size < 1_500_000) return crudo;

    const lienzo = document.createElement("canvas");
    lienzo.width = Math.round(bitmap.width * escala);
    lienzo.height = Math.round(bitmap.height * escala);
    const ctx = lienzo.getContext("2d");
    if (!ctx) return crudo;
    ctx.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((r) => lienzo.toBlob(r, "image/jpeg", 0.85));
    return blob ? { cuerpo: blob, tipo: "image/jpeg" } : crudo;
  } catch {
    return crudo;
  }
}

export function QuoteTool() {
  const [code, setCode] = useState("");
  const [entrado, setEntrado] = useState(false);
  const [jobId, setJobId] = useState<string>(JOBS[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [sel, setSel] = useState<Seleccion>(() => porDefecto(JOBS[0]));
  const [lang, setLang] = useState<Lang>("es");
  const [copiado, setCopiado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState<"no" | "si" | "error">("no");

  const [descripcion, setDescripcion] = useState("");
  const [vista, setVista] = useState<string | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [fase, setFase] = useState<
    "nada" | "subiendo" | "leyendo" | "lista" | "error" | "sinalmacen"
  >("nada");
  const [lectura, setLectura] = useState<Lectura | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const job = useMemo(() => JOBS.find((j) => j.id === jobId)!, [jobId]);
  const r = useMemo(() => cotizar(job, sel, cantidad), [job, sel, cantidad]);
  const texto = useMemo(() => mensaje(job, r, lang), [job, r, lang]);

  const headers = () => ({ "Content-Type": "application/json", "x-admin-code": code });

  function elegirJob(id: string) {
    const j = JOBS.find((x) => x.id === id)!;
    setJobId(id);
    setCantidad(1);
    // Los globales elegidos se conservan: la zona no cambia entre trabajos.
    setSel((prev) => {
      const base = porDefecto(j);
      for (const c of GLOBALES) base[c.id] = prev[c.id] ?? base[c.id];
      return base;
    });
    // La lectura era de otro trabajo: sus sugerencias ya no aplican.
    setLectura(null);
    if (photoPath) setFase("lista");
    setGuardado("no");
  }

  function set(choiceId: string, optionId: string, multiple: boolean) {
    setGuardado("no");
    setSel((prev) => {
      if (!multiple) return { ...prev, [choiceId]: optionId };
      const actual = Array.isArray(prev[choiceId]) ? (prev[choiceId] as string[]) : [];
      return {
        ...prev,
        [choiceId]: actual.includes(optionId)
          ? actual.filter((x) => x !== optionId)
          : [...actual, optionId],
      };
    });
  }

  const marcado = (choiceId: string, optionId: string) => {
    const v = sel[choiceId];
    return Array.isArray(v) ? v.includes(optionId) : v === optionId;
  };

  /**
   * Sugerencias que todavía valen: las ya aplicadas se van, y con ellas el
   * bloque entero si no queda ninguna. Antes el título quedaba colgado sin
   * nada debajo apenas tocabas la última.
   */
  const pendientes = useMemo(
    () => (lectura?.sugerencias ?? []).filter((s) => !marcado(s.choice, s.option)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lectura, sel],
  );
  const proponeCantidad = Boolean(lectura?.piezas && lectura.piezas !== cantidad);

  const etiqueta = (choiceId: string, optionId: string) => {
    const c = job.choices.find((x) => x.id === choiceId);
    return c?.options.find((o) => o.id === optionId)?.label ?? optionId;
  };

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* el textarea queda seleccionable igual */
    }
  }

  async function subirFoto(file: File) {
    // Sin cliente de Supabase no hay a dónde subirla. Pasa si falta una
    // variable en Vercel; antes esto no hacía nada y no decía nada.
    if (!supabase) {
      setVista(URL.createObjectURL(file));
      setFase("sinalmacen");
      return;
    }
    setFase("subiendo");
    setLectura(null);
    setPhotoPath(null);
    setVista(URL.createObjectURL(file));
    setGuardado("no");
    try {
      const { cuerpo, tipo } = await achicar(file);
      const res = await fetch(`/api/t/superhman/quotes/photo`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ type: tipo, size: cuerpo.size }),
      });
      if (!res.ok) throw new Error(`photo ${res.status}`);
      const { path, token } = (await res.json()) as { path: string; token: string };

      const { error } = await supabase.storage
        .from("quotes")
        .uploadToSignedUrl(path, token, cuerpo, { contentType: tipo });
      if (error) throw error;

      setPhotoPath(path);
      await leer(path);
    } catch {
      setFase("error");
    }
  }

  async function leer(path: string) {
    setFase("leyendo");
    try {
      const res = await fetch(`/api/t/superhman/quotes/analyze`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ path, job: job.id }),
      });
      if (!res.ok) throw new Error(`analyze ${res.status}`);
      setLectura((await res.json()) as Lectura);
      setFase("lista");
    } catch {
      setFase("error");
    }
  }

  function sacarFoto() {
    setVista(null);
    setPhotoPath(null);
    setLectura(null);
    setFase("nada");
    if (fileInput.current) fileInput.current.value = "";
  }

  async function guardar() {
    setGuardando(true);
    try {
      const res = await fetch(`/api/t/superhman/quotes`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          job: job.id,
          quantity: r.cantidad,
          options: sel,
          total: r.total,
          description: descripcion,
          photo_path: photoPath,
          photo_read: lectura,
        }),
      });
      setGuardado(res.ok ? "si" : "error");
    } catch {
      setGuardado("error");
    } finally {
      setGuardando(false);
    }
  }

  if (!entrado) {
    return (
      <form
        className="q-gate"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) setEntrado(true);
        }}
      >
        <h1>Cotizador</h1>
        <p>Herramienta interna de SuperHman.</p>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código"
          autoComplete="off"
          aria-label="Código"
        />
        <button type="submit">Entrar</button>
      </form>
    );
  }

  return (
    <div className="q">
      <header className="q-top">
        <h1>Cotizador</h1>
        <span>SuperHman</span>
      </header>

      <div className="q-jobs">
        {JOBS.map((j) => (
          <button
            key={j.id}
            type="button"
            className={j.id === jobId ? "on" : ""}
            onClick={() => elegirJob(j.id)}
          >
            {j.label}
          </button>
        ))}
      </div>

      {/* Lo que pidió el cliente, con sus palabras. Dentro de seis meses es
          esto, y no las opciones, lo que explica por qué el número fue ese. */}
      <div className="q-desc">
        <label htmlFor="q-d">Qué pidió el cliente</label>
        <textarea
          id="q-d"
          rows={3}
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setGuardado("no");
          }}
          placeholder="Lo que te dijo, tal cual. Dirección, piso, a qué hora puede."
        />
      </div>

      {/* La foto. No cotiza: describe, cuenta y dice qué preguntar. */}
      <div className="q-foto">
        {/* Sin `capture`. Con ese atributo el telefono va derecho a la camara
            y no deja elegir del rollo, que es el caso mas comun: la foto la
            mando el cliente por WhatsApp. Sin el, iOS muestra su propio menu
            con "Fototeca", "Tomar foto" y "Elegir archivo", que son las tres
            que hacen falta. */}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void subirFoto(f);
          }}
        />
        {vista ? (
          <div className="q-foto-hay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={vista} alt="Foto del trabajo" />
            <div>
              <p className="q-estado">
                {fase === "subiendo" && "Subiendo…"}
                {fase === "leyendo" && "Mirando la foto…"}
                {fase === "error" && "No se pudo leer. La foto quedó guardada igual."}
                {fase === "sinalmacen" && "No hay dónde guardarla: falta configurar el almacén."}
                {fase === "lista" && (lectura ? "Leída" : "Guardada")}
              </p>
              <div className="q-foto-btns">
                {photoPath && fase !== "leyendo" && (
                  <button type="button" onClick={() => void leer(photoPath)}>
                    {lectura ? "Leer de nuevo" : "Leer la foto"}
                  </button>
                )}
                <button type="button" onClick={sacarFoto}>
                  Sacarla
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button type="button" className="q-foto-add" onClick={() => fileInput.current?.click()}>
            Agregar foto del trabajo
            <small>Sacala ahora o elegí la que te mandó el cliente</small>
          </button>
        )}
      </div>

      {lectura && (
        <div className="q-lectura">
          {lectura.resumen && <p className="q-resumen">{lectura.resumen}</p>}

          {lectura.alertas.length > 0 && (
            <ul className="q-ojo">
              {lectura.alertas.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          )}

          {lectura.preguntar.length > 0 && (
            <div className="q-preguntar">
              <h3>Preguntale al cliente</h3>
              <ul>
                {lectura.preguntar.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {(pendientes.length > 0 || proponeCantidad) && (
            <div className="q-sug">
              <h3>¿Es esto? Tocá para aplicarlo</h3>
              <div className="q-sug-btns">
                {proponeCantidad && (
                  <button type="button" onClick={() => setCantidad(lectura.piezas!)}>
                    {lectura.piezas} {job.perUnit?.label.toLowerCase() ?? "piezas"}
                  </button>
                )}
                {pendientes.map((s) => (
                    <button
                      key={`${s.choice}-${s.option}`}
                      type="button"
                      onClick={() => {
                        const c = job.choices.find((x) => x.id === s.choice);
                        set(s.choice, s.option, Boolean(c?.multiple));
                      }}
                    >
                      {etiqueta(s.choice, s.option)}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {job.perUnit && (
        <div className="q-qty">
          <label htmlFor="q-n">{job.perUnit.label}</label>
          <div>
            <button type="button" onClick={() => setCantidad((n) => Math.max(1, n - 1))} aria-label="Menos">
              −
            </button>
            <output id="q-n">{cantidad}</output>
            <button
              type="button"
              onClick={() => setCantidad((n) => Math.min(job.perUnit!.max, n + 1))}
              aria-label="Más"
            >
              +
            </button>
          </div>
        </div>
      )}

      {[...job.choices, ...GLOBALES].filter((c) => grupoVisible(c, sel)).map((c) => (
        <fieldset className="q-group" key={`${job.id}-${c.id}`}>
          <legend>{c.label}</legend>
          <div className="q-opts">
            {c.options.map((o) => (
              <button
                key={o.id}
                type="button"
                className={marcado(c.id, o.id) ? "on" : ""}
                aria-pressed={marcado(c.id, o.id)}
                onClick={() => set(c.id, o.id, Boolean(c.multiple))}
              >
                {o.label}
                {o.delta ? <i>+${o.delta}</i> : null}
                {o.mult && o.mult !== 1 ? <i>×{o.mult}</i> : null}
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      {/* En un trabajo que no hay que tomar no se muestra precio. Un número en
          pantalla termina mandándose igual, por más avisos que haya al lado. */}
      <div className="q-total" hidden={r.bloqueado}>
        <div className="q-amount">
          <span>Precio</span>
          <strong>${r.total}</strong>
        </div>
        <ul className="q-break">
          <li>
            <span>Base{r.cantidad > 1 ? ` · ${r.cantidad} piezas` : ""}</span>
            <b>${r.base}</b>
          </li>
          {r.lineas.map((l) => (
            <li key={l.label}>
              <span>{l.label}</span>
              <b>+${l.delta}</b>
            </li>
          ))}
          {r.multiplicador && (
            <li>
              <span>{r.multiplicador.label}</span>
              <b>×{r.multiplicador.mult}</b>
            </li>
          )}
          {r.tocoMinimo && (
            <li className="q-min">
              <span>Mínimo de salida</span>
              <b>${r.total}</b>
            </li>
          )}
        </ul>
      </div>

      {r.avisos.length > 0 && (
        <ul className="q-warn">
          {r.avisos.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      )}

      <div className="q-msg">
        <div className="q-langs">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={l.id === lang ? "on" : ""}
              onClick={() => setLang(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <textarea readOnly value={texto} rows={9} aria-label="Mensaje para el cliente" />
      </div>

      <div className="q-save">
        <button type="button" onClick={guardar} disabled={guardando || guardado === "si"}>
          {guardado === "si" ? "Guardada" : guardando ? "Guardando…" : "Guardar cotización"}
        </button>
        {guardado === "error" && <span className="bad">No se pudo guardar. Revisá el código.</span>}
        {guardado === "si" && <span className="ok">Queda para fijar precios reales más adelante.</span>}
      </div>

      {/* Barra fija: el precio y el copiar siguen a mano aunque estés arriba
          de todo eligiendo opciones. Es la pantalla que se usa parado en la
          puerta de un cliente, no sentado. */}
      <div className={`q-bar${r.bloqueado ? " blocked" : ""}`}>
        <strong>{r.bloqueado ? "Este no lo tomes" : `$${r.total}`}</strong>
        <button type="button" onClick={copiar}>
          {copiado ? "Copiado" : r.bloqueado ? "Copiar respuesta" : "Copiar mensaje"}
        </button>
      </div>
    </div>
  );
}
