"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { business, type Lang } from "@/data/allegiant";
import { scanText, statusColors, statusLabels, type Story } from "@/data/allegiant-stories";
import "./scan.css";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/**
 * Escaneo en video de un aparato: rayos X → falla → reparación.
 * Las etiquetas siguen `video.currentTime`; al final aparece la llamada a la
 * acción. Se abre desde el recorrido por la casa al tocar un aparato.
 */
export function ScanModal({
  story,
  lang,
  onClose,
  onBook,
}: {
  story: Story;
  lang: Lang;
  onClose: () => void;
  onBook: () => void;
}) {
  const ui = scanText[lang];
  const ref = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const still = reduced || failed;
  const { duration, endAt, phases } = story;

  // Reloj del video, cuadro a cuadro.
  useEffect(() => {
    if (still) return;
    let raf = 0;
    const loop = () => {
      const v = ref.current;
      if (v) setT((prev) => (Math.abs(prev - v.currentTime) > 0.04 ? v.currentTime : prev));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [still]);

  // Esc cierra; el fondo no se desplaza; el foco vuelve a donde estaba.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  const time = still ? duration : t;
  const phase = phases.find((ph) => time >= ph.a && time < ph.b) ?? null;
  const endA = still ? 1 : Math.min(1, Math.max(0, (time - endAt) / 0.7));
  const ended = time >= duration - 0.05;
  const color = phase?.status ? statusColors[phase.status] : "var(--al-accent)";

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (ended) {
      v.currentTime = 0;
      void v.play();
    } else if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <div className="al-scan" role="dialog" aria-modal="true" aria-label={story.endTitle[lang]} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="al-scan-box" style={{ ["--al-scan-aspect" as string]: story.aspect }}>
        <div className="al-scan-media">
          {still ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={story.endImage} alt="" />
          ) : (
            <video
              ref={ref}
              poster={story.poster}
              autoPlay
              muted
              playsInline
              preload="auto"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
              aria-hidden
            >
              <source src={story.mp4} type="video/mp4" />
              {/* Último formato: si también falla no hay alternativa → imagen fija. */}
              <source src={story.webm} type="video/webm" onError={() => setFailed(true)} />
            </video>
          )}
          <div className="al-scan-fade" />
          <div className="al-scan-endfade" style={{ opacity: endA }} />
          {!still && (
            <div className="al-scan-progress" aria-hidden>
              <div style={{ width: `${(time / duration) * 100}%` }} />
            </div>
          )}
        </div>

        <div className="al-scan-side">
          <div className="al-scan-label">
            <span className="al-scan-dot" data-live={playing ? "" : undefined} />
            {ui.label}
          </div>

          {!still && endA < 1 && phase && (
            <div key={phase.id} className="al-scan-card" style={{ ["--al-scan-color" as string]: color }}>
              {phase.id === "intro" ? (
                <p className="al-scan-intro">{phase.title[lang]}</p>
              ) : (
                <>
                  <div className="al-scan-meta">
                    <span>{phase.step ? `${String(phase.step).padStart(2, "0")} / ${String(story.totalSteps).padStart(2, "0")}` : "SCAN"}</span>
                    {phase.status && <span className="al-scan-status">{statusLabels[lang][phase.status]}</span>}
                  </div>
                  <p className="al-scan-title">{phase.title[lang]}</p>
                  {phase.note && <p className="al-scan-note">{phase.note[lang]}</p>}
                </>
              )}
            </div>
          )}

          <div className="al-scan-end" style={{ opacity: endA, pointerEvents: endA > 0.6 ? "auto" : "none" }}>
            <div className="al-eyebrow">{business.name}</div>
            <p className="al-scan-end-title">{story.endTitle[lang]}</p>
            <p className="al-scan-note">{story.endBody[lang]}</p>
            <div className="al-scan-actions">
              <button type="button" className="al-scan-primary" onClick={onBook}>
                {ui.book}
              </button>
              <a className="al-scan-ghost" href={`tel:${business.phoneHref}`}>
                {ui.call} {business.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        <button ref={closeRef} type="button" className="al-scan-close" onClick={onClose} aria-label={ui.close}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
        {!still && (
          <button type="button" className="al-scan-toggle" onClick={toggle}>
            {ended ? `${ui.replay} ↺` : playing ? ui.pause : ui.play}
          </button>
        )}
      </div>
    </div>
  );
}
