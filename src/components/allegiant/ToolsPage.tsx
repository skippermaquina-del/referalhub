"use client";

import { useState } from "react";
import { business, type Lang } from "@/data/allegiant";
import { dustLevel, energyModel, toolsCopy, type ApplianceId } from "@/data/allegiant-tools";
import { ApplianceDiagram } from "./ApplianceDiagram";
import { useBooking } from "./AllegiantShell";
import { CoilBrush } from "./CoilBrush";
import { KineticBackdrop } from "./KineticBackdrop";

type Tab = "symptoms" | "maintenance" | "energy";
const APPLIANCES: ApplianceId[] = ["fridge", "dishwasher", "washer", "dryer", "oven"];
const STORE = "al-tools-maintenance";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
/** "$26–$53", o un solo valor cuando los dos extremos redondean igual. */
const range = (a: number, b: number) => (Math.round(a) === Math.round(b) ? money(a) : `${money(a)}–${money(b)}`);
const fill = (tpl: string, n: number, m = 0) => tpl.replace("{n}", String(n)).replace("{m}", String(m));

function readStore(): Record<string, string[]> {
  try {
    return JSON.parse(window.localStorage.getItem(STORE) ?? "{}");
  } catch {
    return {};
  }
}
function writeStore(v: Record<string, string[]>) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(v));
  } catch {}
}

/** Las tres herramientas de /tools: síntomas, mantenimiento y energía. */
export function ToolsPage({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang];
  const [tab, setTab] = useState<Tab>("symptoms");

  return (
    <div className="al-light al-k-host">
      <KineticBackdrop />
      <section className="al-section al-tools-hero">
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h1 className="al-h2">
          {t.h1a} <em>{t.h1b}</em>
        </h1>
        <p>{t.intro}</p>
        <div className="al-tools-tabs" role="tablist">
          {(Object.keys(t.tabs) as Tab[]).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
              {t.tabs[k]}
            </button>
          ))}
        </div>
      </section>

      <section className="al-section al-tools-body">
        {tab === "symptoms" && <Symptoms lang={lang} />}
        {tab === "maintenance" && <Maintenance lang={lang} />}
        {tab === "energy" && <Energy lang={lang} />}
      </section>

      <Cta lang={lang} />
    </div>
  );
}

function AppliancePicker({ lang, value, onChange }: { lang: Lang; value: ApplianceId; onChange: (a: ApplianceId) => void }) {
  const t = toolsCopy[lang];
  return (
    <div className="al-tools-chips">
      {APPLIANCES.map((a) => (
        <button key={a} type="button" aria-pressed={value === a} onClick={() => onChange(a)}>
          {t.appliances[a]}
        </button>
      ))}
    </div>
  );
}

function Ring({ done, total }: { done: number; total: number }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  const pct = total ? done / total : 0;
  return (
    <svg className="al-tools-ring" viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r={r} fill="none" stroke="rgba(120,140,185,0.35)" strokeWidth="6" />
      <circle
        cx="30"
        cy="30"
        r={r}
        fill="none"
        stroke="#f26f21"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 30 30)"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text x="30" y="35" textAnchor="middle" fontSize="15" fill="currentColor" fontWeight="600">
        {done}/{total}
      </text>
    </svg>
  );
}

function Symptoms({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].symptoms;
  const labels = toolsCopy[lang].appliances;
  const [appliance, setAppliance] = useState<ApplianceId>("fridge");
  const list = t.list[appliance];
  const [symptomId, setSymptomId] = useState(list[0].id);
  const [ticked, setTicked] = useState<Record<string, number[]>>({});
  const symptom = list.find((s) => s.id === symptomId) ?? list[0];
  const key = `${appliance}:${symptom.id}`;
  const done = ticked[key] ?? [];
  const total = symptom.checks.length;
  const allDone = total > 0 && done.length === total;

  function toggle(i: number) {
    setTicked((prev) => {
      const cur = prev[key] ?? [];
      return { ...prev, [key]: cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i] };
    });
  }

  return (
    <div className="al-tools-panel al-tools-wide">
      <div className="al-tools-label">{t.pickAppliance}</div>
      <AppliancePicker
        lang={lang}
        value={appliance}
        onChange={(a) => {
          setAppliance(a);
          setSymptomId(t.list[a][0].id);
        }}
      />
      <div className="al-tools-label">{t.pickSymptom}</div>
      <div className="al-tools-chips">
        {list.map((s) => (
          <button key={s.id} type="button" aria-pressed={symptom.id === s.id} onClick={() => setSymptomId(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="al-tools-sym">
        <ApplianceDiagram
          appliance={appliance}
          symptomId={symptom.id}
          lang={lang}
          label={labels[appliance]}
          whereToLook={t.whereToLook}
        />
        <div>
          {symptom.urgent ? (
            <div className="al-tools-urgent" role="alert">
              <strong>{t.urgentTitle}</strong>
              <p>{symptom.urgent}</p>
            </div>
          ) : (
            <div className="al-tools-card" key={key}>
              <div className="al-tools-cardhead">
                <Ring done={done.length} total={total} />
                <div>
                  <h3>{t.checksTitle}</h3>
                  <small>{allDone ? t.allDone : `${fill(t.progress, done.length, total)} · ${t.tickHint}`}</small>
                </div>
              </div>
              <p className="al-tools-unplug">{t.unplug}</p>
              <ol className="al-tools-steps">
                {symptom.checks.map((c, i) => (
                  <li key={c} style={{ animationDelay: `${i * 70}ms` }}>
                    <label data-done={done.includes(i) ? "" : undefined}>
                      <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
                      <span className="al-tools-box" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#08101e" strokeWidth="2.4">
                          <path d="M3 8.5 L6.5 12 L13 4.5" />
                        </svg>
                      </span>
                      <span>{c}</span>
                    </label>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="al-tools-card" data-pulse={allDone ? "" : undefined}>
            <h3>{t.callTitle}</h3>
            <ul>
              {symptom.callIf.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <BookRow lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Maintenance({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].maintenance;
  const [appliance, setAppliance] = useState<ApplianceId>("fridge");
  const [store, setStore] = useState<Record<string, string[]>>(() => (typeof window === "undefined" ? {} : readStore()));
  const tasks = t.list[appliance];
  const done = (store[appliance] ?? []).filter((x) => tasks.some((k) => k.task === x));
  const complete = done.length === tasks.length;

  function toggle(task: string) {
    setStore((prev) => {
      const cur = prev[appliance] ?? [];
      const next = { ...prev, [appliance]: cur.includes(task) ? cur.filter((x) => x !== task) : [...cur, task] };
      writeStore(next);
      return next;
    });
  }
  function reset() {
    setStore((prev) => {
      const next = { ...prev, [appliance]: [] };
      writeStore(next);
      return next;
    });
  }

  return (
    <div className="al-tools-panel">
      <p className="al-tools-lead">{t.intro}</p>
      <AppliancePicker lang={lang} value={appliance} onChange={setAppliance} />
      <div className="al-tools-progress">
        <div className="al-brush-bar" role="progressbar" aria-valuemin={0} aria-valuemax={tasks.length} aria-valuenow={done.length}>
          <i style={{ width: `${(done.length / tasks.length) * 100}%` }} />
        </div>
        <span>{complete ? t.allDone : fill(t.progress, done.length, tasks.length)}</span>
        {done.length > 0 && (
          <button type="button" className="al-link" onClick={reset}>
            {t.startOver}
          </button>
        )}
      </div>
      <div className="al-tools-table">
        <div className="al-tools-row al-tools-head">
          <span>{t.taskCol}</span>
          <span>{t.everyCol}</span>
        </div>
        {tasks.map((m) => (
          <div key={m.task} className="al-tools-row" data-done={done.includes(m.task) ? "" : undefined}>
            <label>
              <input type="checkbox" checked={done.includes(m.task)} onChange={() => toggle(m.task)} />
              <span className="al-tools-box" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#08101e" strokeWidth="2.4">
                  <path d="M3 8.5 L6.5 12 L13 4.5" />
                </svg>
              </span>
              <span>
                <strong>{m.task}</strong>
                <small>{m.how}</small>
              </span>
            </label>
            <span className="al-tools-every">{m.every}</span>
          </div>
        ))}
      </div>
      {appliance === "fridge" && <Guide key={lang} lang={lang} />}
      <div className="al-tools-card">
        <h3>{t.proTitle}</h3>
        <p>{t.proText}</p>
        <BookRow lang={lang} />
      </div>
    </div>
  );
}

function heatOf(level: number): "high" | "mid" | "ok" {
  return level > 0.6 ? "high" : level > 0.25 ? "mid" : "ok";
}

function Energy({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].energy;
  const [type, setType] = useState<keyof typeof energyModel.baseKwh>("builtin");
  const [age, setAge] = useState<keyof typeof energyModel.ageFactor>("mid");
  const [months, setMonths] = useState(30);
  const [pets, setPets] = useState(0);
  const [rateText, setRateText] = useState(String(energyModel.defaultRate));
  const [cleaned, setCleaned] = useState(0);
  const [round, setRound] = useState(0);

  const rate = Math.min(2, Math.max(0, Number(rateText.replace(",", ".")) || 0));
  const kwh = energyModel.baseKwh[type] * energyModel.ageFactor[age];
  const dust = dustLevel(months, pets);
  const base = kwh * rate;
  const left = 1 - cleaned;
  const lo = energyModel.dustExtra.lo * dust;
  const hi = energyModel.dustExtra.hi * dust;
  const extraLo = base * lo * left;
  const extraHi = base * hi * left;
  const yearlyLo = base * (1 + lo * left);
  const yearlyHi = base * (1 + hi * left);
  const extraPct = Math.round(((lo + hi) / 2) * 100 * left);
  const savedAll = cleaned >= 0.9;
  const heat = heatOf(dust * left);

  function restart() {
    setCleaned(0);
    setRound((r) => r + 1);
  }

  return (
    <div className="al-tools-panel">
      <h2 className="al-tools-h">{t.title}</h2>
      <p className="al-tools-lead">{t.intro}</p>
      <div className="al-tools-form">
        <label>
          <span>{t.type}</span>
          <select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="standard">{t.types.standard}</option>
            <option value="builtin">{t.types.builtin}</option>
          </select>
        </label>
        <label>
          <span>{t.age}</span>
          <select value={age} onChange={(e) => setAge(e.target.value as typeof age)}>
            <option value="new">{t.ages.new}</option>
            <option value="mid">{t.ages.mid}</option>
            <option value="old">{t.ages.old}</option>
          </select>
        </label>
        <label>
          <span>
            {t.months}: <b>{months >= 30 ? "30+" : months} {t.monthsUnit}</b>
          </span>
          <input
            type="range"
            min={0}
            max={30}
            value={months}
            onChange={(e) => {
              setMonths(Number(e.target.value));
              restart();
            }}
          />
          <small>{t.monthsHint}</small>
        </label>
        <label>
          <span>{t.pets}</span>
          <select
            value={pets}
            onChange={(e) => {
              setPets(Number(e.target.value));
              restart();
            }}
          >
            <option value={0}>{t.petsOpts.none}</option>
            <option value={1}>{t.petsOpts.one}</option>
            <option value={2}>{t.petsOpts.many}</option>
          </select>
        </label>
        <label>
          <span>{t.rate}</span>
          <input inputMode="decimal" value={rateText} onChange={(e) => setRateText(e.target.value)} />
          <small>{t.rateHint}</small>
        </label>
      </div>

      <h3 className="al-tools-stage">{t.stageTitle}</h3>
      <p className="al-tools-lead">{t.stageHint}</p>
      <div className="al-heat-badge" data-heat={heat} aria-live="polite">
        <i aria-hidden="true" />
        {t.heat}: <strong>{t.heatLevels[heat]}</strong>
      </div>
      <CoilBrush
        key={`${months}-${pets}-${round}`}
        dust={dust}
        alt={t.coilsAlt}
        cleanLabel={t.cleanBtn}
        dustLabel={t.dustLabel}
        cleaned={cleaned}
        onClean={setCleaned}
      />
      {cleaned > 0 && (
        <button type="button" className="al-link al-tools-redo" onClick={restart}>
          {t.dustBtn}
        </button>
      )}

      <div className="al-tools-result" aria-live="polite">
        <div>
          <span>{t.yearly}</span>
          <strong>
            {range(yearlyLo, yearlyHi)}
            <small>{t.perYear}</small>
          </strong>
        </div>
        <div>
          <span>{t.extra}</span>
          <strong>
            {range(extraLo, extraHi)}
            <small>{t.perYear}</small>
          </strong>
          <em>
            {t.loadLabel}: +{extraPct}%
          </em>
        </div>
      </div>
      {savedAll && (
        <div className="al-tools-saved">
          <strong>
            {t.savedTitle} {range(base * lo, base * hi)}
            {t.perYear}
          </strong>
        </div>
      )}
      <p className="al-tools-note">{t.note}</p>
    </div>
  );
}

function Guide({ lang }: { lang: Lang }) {
  const g = toolsCopy[lang].maintenance.guide;
  const [open, setOpen] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const total = g.steps.reduce((a, x) => a + x.min, 0);
  const all = done.length === g.steps.length;

  function mark(i: number) {
    setDone((d) => (d.includes(i) ? d : [...d, i]));
    setOpen(Math.min(g.steps.length - 1, i + 1));
  }

  return (
    <div className="al-tools-guide">
      <h3>{g.title}</h3>
      <p className="al-tools-lead">
        {g.intro} ({fill(g.minutes, total)})
      </p>
      <div className="al-tools-card">
        <h4>{g.toolsTitle}</h4>
        <ul className="al-tools-chips">
          {g.tools.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
      <ol className="al-tools-gsteps">
        {g.steps.map((st, i) => (
          <li key={st.title} data-open={open === i ? "" : undefined} data-done={done.includes(i) ? "" : undefined}>
            <button type="button" onClick={() => setOpen(i)} aria-expanded={open === i}>
              <span className="al-tools-gnum">{done.includes(i) ? "✓" : i + 1}</span>
              <span>
                <small>{fill(g.step, i + 1, g.steps.length)} · {fill(g.minutes, st.min)}</small>
                <strong>{st.title}</strong>
              </span>
            </button>
            {open === i && (
              <div className="al-tools-gbody">
                <p>{st.text}</p>
                {st.caution && (
                  <p className="al-tools-gcaution">
                    <b>{g.cautionTitle}:</b> {st.caution}
                  </p>
                )}
                <button type="button" className="al-btn-line" onClick={() => mark(i)}>
                  {done.includes(i) ? g.done : g.markDone}
                </button>
              </div>
            )}
          </li>
        ))}
      </ol>
      {all && <div className="al-tools-saved"><strong>{g.finish}</strong></div>}
      <p className="al-tools-note">{g.builtin}</p>
    </div>
  );
}

function BookRow({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].cta;
  const { openBook } = useBooking();
  return (
    <div className="al-tools-actions">
      <button type="button" className="al-btn" onClick={openBook}>
        {t.book}
      </button>
      <a className="al-link" href={`tel:${business.phoneHref}`}>
        {t.call} {business.phoneDisplay}
      </a>
    </div>
  );
}

function Cta({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].cta;
  return (
    <section className="al-section al-grid12 al-teaser" style={{ textAlign: "center" }}>
      <div style={{ gridColumn: "1 / span 12" }}>
        <h2>{t.title}</h2>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)", margin: "20px auto 36px", maxWidth: 620 }}>
          {t.text}
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <BookRow lang={lang} />
        </div>
      </div>
    </section>
  );
}
