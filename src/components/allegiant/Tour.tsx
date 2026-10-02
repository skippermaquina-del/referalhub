"use client";

import Image from "next/image";
import { useState } from "react";
import { copy, paths, tourScenes, type Lang } from "@/data/allegiant";
import { PowerMark } from "./PowerMark";
import { useBooking } from "./AllegiantShell";

/**
 * Recorrido por la casa: una escena por cuarto, con puntos sobre cada aparato
 * y vista de rayos X en los refrigeradores de acero.
 */
export function Tour({ lang }: { lang: Lang }) {
  const t = copy[lang].tour;
  const p = paths(lang);
  const { openBook } = useBooking();
  const [scene, setScene] = useState(0);
  const [spot, setSpot] = useState<string | null>(null);
  const [xray, setXray] = useState(false);

  const count = tourScenes.length;
  const current = tourScenes[scene].hotspots.find((h) => h.id === spot) ?? null;
  const kind = current ? t.kinds[current.kind] : null;
  const canXray = !!current?.xray;
  const xrayOn = xray && canXray;

  const go = (i: number) => {
    setScene((i + count) % count);
    setSpot(null);
    setXray(false);
  };

  return (
    <section className="al-tour" aria-label={t.scenes[scene]}>
      {tourScenes.map((s, si) => {
        const active = si === scene;
        return (
          <div key={s.src} className="al-tour-layer" data-active={active ? "" : undefined} aria-hidden={!active}>
            <div className="al-tour-stage">
              <Image src={s.src} alt={t.scenes[si]} fill sizes="100vw" priority={si === 0} />
              <div className="al-tour-dim" data-on={xrayOn ? "" : undefined} />

              {active && xrayOn && current?.xray && (
                <div
                  className="al-xray"
                  style={{
                    left: `${current.xray.left}%`,
                    top: `${current.xray.top}%`,
                    width: `${current.xray.width}%`,
                    height: `${current.xray.height}%`,
                  }}
                >
                  <svg viewBox="0 0 100 270" width="100%" height="100%" fill="none" stroke="#7fb4d6" strokeWidth="1" aria-hidden="true">
                    <rect x="8" y="10" width="84" height="74" rx="2" strokeDasharray="3 3" />
                    <rect x="8" y="98" width="84" height="108" rx="2" strokeDasharray="3 3" />
                    <line x1="4" y1="91" x2="96" y2="91" />
                    <rect x="22" y="222" width="56" height="32" rx="3" />
                    <path d="M50 206 L50 222" />
                    <path d="M68 180 C92 180 94 140 92 110 C90 70 72 48 52 54 C36 58 30 74 36 88" stroke="#f26f21" strokeDasharray="2 3" />
                    <circle cx="68" cy="180" r="5" fill="#f26f21" stroke="none" />
                    <circle className="al-xray-valve-ring" cx="68" cy="180" r="5" stroke="#f26f21" />
                  </svg>
                  <div className="al-xray-scan" />
                </div>
              )}

              {s.hotspots.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className="al-spot"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  data-hidden={xrayOn ? "" : undefined}
                  aria-label={t.kinds[h.kind].name}
                  aria-pressed={spot === h.id}
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    setSpot((cur) => (cur === h.id ? null : h.id));
                    setXray(false);
                  }}
                >
                  <span className="al-spot-ring" />
                  <span className="al-spot-dot" />
                </button>
              ))}
            </div>
          </div>
        );
      })}

      <div className="al-tour-shade-l" />
      <div className="al-tour-shade-b" />
      <div className="al-tour-shade-t" />

      <header className="al-tour-header">
        <a href={p.home} className="al-brand" aria-label="Allegiant">
          <div className="al-brand-mark" style={{ width: 44, height: 44, flex: "0 0 44px" }}>
            <PowerMark compact label={{ on: lang === "es" ? "Encender el logo" : "Turn the logo on", off: lang === "es" ? "Apagar el logo" : "Turn the logo off" }} />
          </div>
          <span className="al-brand-name" style={{ fontSize: 18 }}>Allegiant</span>
        </a>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <div className="al-lang">
            <a href={paths("en").tour} hrefLang="en" aria-current={lang === "en"} aria-label="English">EN</a>
            <a href={paths("es").tour} hrefLang="es" aria-current={lang === "es"} aria-label="Español">ES</a>
          </div>
          <a href={p.home} className="al-link">{t.back}</a>
        </div>
      </header>

      <div className="al-tour-panel">
        <div className="al-eyebrow">0{scene + 1} / 0{count}</div>
        <h1 className="al-tour-title">{kind ? kind.name : t.scenes[scene]}</h1>
        {kind ? (
          <div>
            <div className="al-tour-repair">{t.repair}</div>
            <p style={{ margin: "26px 0 0", fontSize: 16, lineHeight: 1.8, color: "var(--al-text-2)" }}>{kind.copy}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {kind.faults.map((f) => (
                <span key={f} className="al-fault">{f}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center", marginTop: 36 }}>
              {canXray && (
                <button type="button" className="al-xray-btn" aria-pressed={xrayOn} onClick={() => setXray((v) => !v)}>
                  {xrayOn ? t.xrayOff : t.xrayOn}
                </button>
              )}
              <button type="button" className="al-link" style={{ background: "none", borderTop: 0, borderLeft: 0, borderRight: 0 }} onClick={openBook}>
                {t.book}
              </button>
            </div>
            {xrayOn && (
              <div style={{ marginTop: 28, borderLeft: "1px solid var(--al-accent)", paddingLeft: 18, maxWidth: 380 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--al-accent)" }}>{t.xrayTitle}</div>
                <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.7, color: "var(--al-text-2)" }}>{t.xrayNote}</p>
              </div>
            )}
          </div>
        ) : (
          <p style={{ margin: "26px 0 0", fontSize: 16, lineHeight: 1.8, color: "var(--al-text-2)", maxWidth: 380 }}>{t.hint}</p>
        )}
      </div>

      <nav className="al-tour-nav" aria-label={t.scenes[scene]}>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" className="al-arrow" aria-label={t.prev} onClick={() => go(scene - 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f4efe6" strokeWidth="1.4" aria-hidden="true"><path d="M15 5 L8 12 L15 19" /></svg>
          </button>
          <button type="button" className="al-arrow" aria-label={t.next} onClick={() => go(scene + 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f4efe6" strokeWidth="1.4" aria-hidden="true"><path d="M9 5 L16 12 L9 19" /></svg>
          </button>
        </div>
        <div className="al-tour-tabs" style={{ display: "flex", gap: 40 }}>
          {t.tabs.map((label, i) => (
            <button key={label} type="button" className="al-tab" aria-current={i === scene} onClick={() => go(i)}>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </section>
  );
}
