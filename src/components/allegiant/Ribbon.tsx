"use client";

import { useState } from "react";
import { copy, type Lang } from "@/data/allegiant";
import { useBooking } from "./AllegiantShell";

/** Cinta de oferta superior, discreta y descartable. */
export function Ribbon({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [visible, setVisible] = useState(true);
  const { openBook } = useBooking();

  if (!visible) return null;

  return (
    <div className="al-ribbon">
      <span>{t.ribbon.text}</span>
      <button type="button" className="al-ribbon-cta" onClick={openBook}>{t.ribbon.cta}</button>
      <button type="button" className="al-ribbon-close" aria-label={t.booking.close} onClick={() => setVisible(false)}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f4efe6" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 5 L19 19 M19 5 L5 19" />
        </svg>
      </button>
    </div>
  );
}
