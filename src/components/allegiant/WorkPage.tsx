"use client";

import { useEffect, useState } from "react";
import { business, type Lang } from "@/data/allegiant";
import { workCopy } from "@/data/allegiant-work";
import { useBooking } from "./AllegiantShell";
import { ChannelVideo } from "./ChannelVideo";

/** "Trabajos reales": el vídeo corto y las fotos de reparaciones hechas por Vadim. */
export function WorkPage({ lang }: { lang: Lang }) {
  const t = workCopy[lang];
  const { openBook } = useBooking();
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="al-light al-k-host">
      <section className="al-section al-tools-hero">
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h1 className="al-h2">
          {t.h1a} <em>{t.h1b}</em>
        </h1>
        <p>{t.intro}</p>
      </section>

      <section className="al-section al-work-video">
        <h2 className="al-work-h">{t.videoTitle}</h2>
        <ChannelVideo
          label={t.videoLabel}
          sound={{ on: lang === "es" ? "Activar sonido" : "Turn sound on", off: lang === "es" ? "Silenciar" : "Mute" }}
          src="/allegiant/video/work-short.mp4"
          poster="/allegiant/video/work-short-poster.jpg"
          hasSound={false}
        />
      </section>

      <section className="al-section al-work-gallery">
        <h2 className="al-work-h">{t.galleryTitle}</h2>
        <div className="al-work-grid">
          {t.photos.map((p, i) => (
            <figure key={p.src}>
              <button type="button" onClick={() => setOpen(i)} aria-label={p.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} width={900} height={1600} loading="lazy" />
              </button>
              <figcaption>{p.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="al-tools-card al-work-note">
          <h3>{t.noteTitle}</h3>
          <p>{t.note}</p>
        </div>
        <p className="al-tools-note">{t.privacy}</p>
      </section>

      <section className="al-section al-grid12 al-teaser" style={{ textAlign: "center" }}>
        <div style={{ gridColumn: "1 / span 12" }}>
          <h2>{t.cta.title}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)", margin: "20px auto 36px", maxWidth: 620 }}>{t.cta.text}</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="al-tools-actions">
              <button type="button" className="al-btn" onClick={openBook}>
                {lang === "es" ? "Reservar visita" : "Book a visit"}
              </button>
              <a className="al-link" href={`tel:${business.phoneHref}`}>
                {lang === "es" ? "Llamar" : "Call"} {business.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {open !== null && (
        <div className="al-work-lightbox" role="dialog" aria-modal="true" aria-label={t.photos[open].alt} onClick={() => setOpen(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.photos[open].src} alt={t.photos[open].alt} />
          <p>{t.photos[open].caption}</p>
          <button type="button" className="al-btn-line" onClick={() => setOpen(null)}>
            {t.close}
          </button>
        </div>
      )}
    </div>
  );
}
