"use client";

import Image from "next/image";
import { useState } from "react";
import { copy, paths, tourScenes, type Lang } from "@/data/allegiant";
import { hitAreas, scanStoryFor, scanText, type Story } from "@/data/allegiant-stories";
import { PowerMark } from "./PowerMark";
import { ScanModal } from "./ScanModal";
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
  const [hover, setHover] = useState<string | null>(null);
  const [scan, setScan] = useState<Story | null>(null);

  const count = tourScenes.length;
  const hotspots = tourScenes[scene].hotspots;
  // La ficha de la derecha muestra el aparato señalado con el mouse o el último
  // tocado que no tiene escaneo (microondas, vinoteca).
  const shown = hotspots.find((h) => h.id === (hover ?? spot)) ?? null;
  const kind = shown ? t.kinds[shown.kind] : null;

  const go = (i: number) => {
    setScene((i + count) % count);
    setSpot(null);
    setHover(null);
  };

  const pick = (id: string, k: (typeof hotspots)[number]["kind"]) => {
    const story = scanStoryFor(k);
    if (story) {
      setScan(story);
      setSpot(null);
    } else {
      setSpot((cur) => (cur === id ? null : id));
    }
  };

  return (
    <section className="al-tour" aria-label={t.scenes[scene]}>
      {tourScenes.map((s, si) => {
        const active = si === scene;
        return (
          <div key={s.src} className="al-tour-layer" data-active={active ? "" : undefined} aria-hidden={!active}>
            <div className="al-tour-stage">
              <Image src={s.src} alt={t.scenes[si]} fill sizes="100vw" priority={si === 0} />

              {hotspots.map((h) => {
                const area = hitAreas[h.id];
                if (!area) return null;
                const name = t.kinds[h.kind].name;
                const hasScan = !!scanStoryFor(h.kind);
                return (
                  <button
                    key={h.id}
                    type="button"
                    className="al-hit"
                    style={{ left: `${area.left}%`, top: `${area.top}%`, width: `${area.width}%`, height: `${area.height}%` }}
                    aria-label={hasScan ? `${name} — ${scanText[lang].button}` : name}
                    tabIndex={active ? 0 : -1}
                    onClick={() => pick(h.id, h.kind)}
                    onMouseEnter={() => setHover(h.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(h.id)}
                    onBlur={() => setHover(null)}
                  >
                    <span className="al-hit-label">
                      {hasScan && <span aria-hidden="true">▶ </span>}
                      {name}
                    </span>
                  </button>
                );
              })}
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
            <p style={{ margin: "26px 0 0", fontSize: 19, lineHeight: 1.8, color: "var(--al-text-2)" }}>{kind.copy}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
              {kind.faults.map((f) => (
                <span key={f} className="al-fault">{f}</span>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center", marginTop: 36 }}>
              <button type="button" className="al-link" style={{ background: "none", borderTop: 0, borderLeft: 0, borderRight: 0 }} onClick={openBook}>
                {t.book}
              </button>
            </div>
          </div>
        ) : (
          <p style={{ margin: "26px 0 0", fontSize: 19, lineHeight: 1.8, color: "var(--al-text-2)", maxWidth: 380 }}>{scanText[lang].tourHint}</p>
        )}
      </div>

      {scan && (
        <ScanModal
          story={scan}
          lang={lang}
          onClose={() => setScan(null)}
          onBook={() => {
            setScan(null);
            openBook();
          }}
        />
      )}

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
