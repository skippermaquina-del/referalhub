"use client";

import { useMemo, useState } from "react";
import {
  GLOBALES,
  JOBS,
  cotizar,
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
 */

const LANGS: { id: Lang; label: string }[] = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
];

/** Opciones por defecto: la primera de cada grupo de una sola elección. */
function porDefecto(job: Job): Seleccion {
  const sel: Seleccion = {};
  for (const c of [...job.choices, ...GLOBALES]) {
    if (!c.multiple) sel[c.id] = c.options[0].id;
    else sel[c.id] = [];
  }
  return sel;
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

  const job = useMemo(() => JOBS.find((j) => j.id === jobId)!, [jobId]);
  const r = useMemo(() => cotizar(job, sel, cantidad), [job, sel, cantidad]);
  const texto = useMemo(() => mensaje(job, r, lang), [job, r, lang]);

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

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* el textarea queda seleccionable igual */
    }
  }

  async function guardar() {
    setGuardando(true);
    try {
      const res = await fetch("/api/t/superhman/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-code": code },
        body: JSON.stringify({
          job: job.id,
          quantity: r.cantidad,
          options: sel,
          total: r.total,
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

      {[...job.choices, ...GLOBALES].map((c) => (
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
