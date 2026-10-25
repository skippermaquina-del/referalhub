"use client";

import { useState } from "react";
import { copy, type Lang } from "@/data/allegiant";
import { scanGallery, scanText, type Story } from "@/data/allegiant-stories";
import { useBooking } from "./AllegiantShell";
import { ScanModal } from "./ScanModal";

/** Home: acceso directo a los escaneos de rayos X, sin pasar por el recorrido. */
export function ScanGallery({ lang }: { lang: Lang }) {
  const ui = scanText[lang];
  const kinds = copy[lang].tour.kinds;
  const { openBook } = useBooking();
  const [open, setOpen] = useState<Story | null>(null);

  return (
    <section id="scans" className="al-section al-light al-tone-2 al-scan-gallery">
      <div className="al-grid12 al-section-head">
        <div className="al-eyebrow">{ui.gallery.eyebrow}</div>
        <h2 className="al-h2">{ui.gallery.h2}</h2>
      </div>
      <p className="al-scan-gallery-p">{ui.gallery.p}</p>
      <ul className="al-scan-cards">
        {scanGallery.map(({ kind, story }) => (
          <li key={story.id}>
            <button type="button" className="al-scan-card-btn" onClick={() => setOpen(story)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={story.poster} alt="" loading="lazy" />
              <span className="al-scan-card-shade" />
              <span className="al-scan-card-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
              <span className="al-scan-card-text">
                <span className="al-scan-card-name">{kinds[kind].name}</span>
                <span className="al-scan-card-cta">{ui.button}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <ScanModal
          story={open}
          lang={lang}
          onClose={() => setOpen(null)}
          onBook={() => {
            setOpen(null);
            openBook();
          }}
        />
      )}
    </section>
  );
}
