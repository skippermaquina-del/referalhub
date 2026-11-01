"use client";

import { useState } from "react";
import { business, type Lang } from "@/data/allegiant";
import { energyModel, toolsCopy, type ApplianceId } from "@/data/allegiant-tools";
import { useBooking } from "./AllegiantShell";

type Tab = "symptoms" | "maintenance" | "energy";
const APPLIANCES: ApplianceId[] = ["fridge", "dishwasher", "washer", "dryer", "oven"];

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Las tres herramientas de /tools: síntomas, mantenimiento y energía. */
export function ToolsPage({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang];
  const [tab, setTab] = useState<Tab>("symptoms");

  return (
    <>
      <section className="al-section al-light al-tone-2 al-tools-hero">
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

      <section className="al-section al-light al-tools-body">
        {tab === "symptoms" && <Symptoms lang={lang} />}
        {tab === "maintenance" && <Maintenance lang={lang} />}
        {tab === "energy" && <Energy lang={lang} />}
      </section>

      <Cta lang={lang} />
    </>
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

function Symptoms({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].symptoms;
  const [appliance, setAppliance] = useState<ApplianceId>("fridge");
  const list = t.list[appliance];
  const [symptomId, setSymptomId] = useState(list[0].id);
  const symptom = list.find((s) => s.id === symptomId) ?? list[0];

  return (
    <div className="al-tools-panel">
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

      {symptom.urgent ? (
        <div className="al-tools-urgent" role="alert">
          <strong>{t.urgentTitle}</strong>
          <p>{symptom.urgent}</p>
        </div>
      ) : (
        <div className="al-tools-card">
          <h3>{t.checksTitle}</h3>
          <p className="al-tools-unplug">{t.unplug}</p>
          <ol>
            {symptom.checks.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      )}
      <div className="al-tools-card">
        <h3>{t.callTitle}</h3>
        <ul>
          {symptom.callIf.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <BookRow lang={lang} />
      </div>
    </div>
  );
}

function Maintenance({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].maintenance;
  const [appliance, setAppliance] = useState<ApplianceId>("fridge");
  return (
    <div className="al-tools-panel">
      <p className="al-tools-lead">{t.intro}</p>
      <AppliancePicker lang={lang} value={appliance} onChange={setAppliance} />
      <div className="al-tools-table">
        <div className="al-tools-row al-tools-head">
          <span>{t.taskCol}</span>
          <span>{t.everyCol}</span>
        </div>
        {t.list[appliance].map((m) => (
          <div key={m.task} className="al-tools-row">
            <span>
              <strong>{m.task}</strong>
              <small>{m.how}</small>
            </span>
            <span className="al-tools-every">{m.every}</span>
          </div>
        ))}
      </div>
      <div className="al-tools-card">
        <h3>{t.proTitle}</h3>
        <p>{t.proText}</p>
        <BookRow lang={lang} />
      </div>
    </div>
  );
}

function Energy({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].energy;
  const [type, setType] = useState<keyof typeof energyModel.baseKwh>("builtin");
  const [age, setAge] = useState<keyof typeof energyModel.ageFactor>("mid");
  const [coils, setCoils] = useState<keyof typeof energyModel.coilsExtra>("never");
  const [rateText, setRateText] = useState(String(energyModel.defaultRate));

  const rate = Math.min(2, Math.max(0, Number(rateText.replace(",", ".")) || 0));
  const kwh = energyModel.baseKwh[type] * energyModel.ageFactor[age];
  const [lo, hi] = energyModel.coilsExtra[coils];
  const base = kwh * rate;

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
          <span>{t.coils}</span>
          <select value={coils} onChange={(e) => setCoils(e.target.value as typeof coils)}>
            <option value="recent">{t.coilsOpts.recent}</option>
            <option value="year">{t.coilsOpts.year}</option>
            <option value="never">{t.coilsOpts.never}</option>
          </select>
        </label>
        <label>
          <span>{t.rate}</span>
          <input inputMode="decimal" value={rateText} onChange={(e) => setRateText(e.target.value)} />
          <small>{t.rateHint}</small>
        </label>
      </div>
      <div className="al-tools-result" aria-live="polite">
        <div>
          <span>{t.yearly}</span>
          <strong>
            {money(base * (1 + lo))}
            {hi > lo ? `–${money(base * (1 + hi))}` : ""}
            <small>{t.perYear}</small>
          </strong>
        </div>
        <div>
          <span>{t.extra}</span>
          {hi > 0 ? (
            <strong>
              {money(base * lo)}–{money(base * hi)}
              <small>{t.perYear}</small>
            </strong>
          ) : (
            <p>{t.extraNone}</p>
          )}
        </div>
      </div>
      <p className="al-tools-note">{t.note}</p>
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
