"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/data/allegiant";
import { balloonDelaySec, balloonText } from "@/data/allegiant-offer";
import { Coupon } from "./SurpriseBox";
import "./balloon.css";

const KEY = "al-offer-balloon";
const read = () => {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};
const remember = () => {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {}
};

const CONFETTI = Array.from({ length: 16 }, (_, i) => i);

/** Globo con llave inglesa que flota a los 10 s; al tocarlo se abre la oferta. */
export function OfferBalloon({ lang, suppressed, onBook }: { lang: Lang; suppressed: boolean; onBook: () => void }) {
  const t = balloonText[lang];
  const [show, setShow] = useState(false);
  const [popped, setPopped] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (read()) return;
    const id = window.setTimeout(() => setShow(true), balloonDelaySec * 1000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  function pop() {
    remember();
    setPopped(true);
    window.setTimeout(() => setModal(true), 450);
  }

  function dismiss() {
    remember();
    setShow(false);
    setPopped(false);
  }

  return (
    <>
      {show && !modal && (
        <div className="al-balloon" data-popped={popped ? "" : undefined} data-hidden={suppressed ? "" : undefined}>
          <button type="button" className="al-balloon-btn" aria-label={t.label} onClick={pop} disabled={popped}>
            <svg viewBox="0 0 80 120" width="76" height="114" aria-hidden="true">
              <path d="M40 4 C18 4 6 22 6 42 C6 66 26 84 40 92 C54 84 74 66 74 42 C74 22 62 4 40 4 Z" fill="#f26f21" />
              <path d="M22 18 C14 26 12 38 15 48" stroke="#ffd2b0" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M34 92 L40 100 L46 92 Z" fill="#c9540f" />
              <path d="M40 100 C34 108 46 112 40 120" stroke="#f4efe6" strokeWidth="1.5" fill="none" />
              <g transform="rotate(-40 40 46)" fill="#08101e">
                <path d="M33 30 a9 9 0 1 1 14 0 l-3 3 v3 h-8 v-3 z" />
                <rect x="37" y="36" width="6" height="28" rx="3" />
              </g>
            </svg>
          </button>
          {popped && (
            <span className="al-confetti" aria-hidden="true">
              {CONFETTI.map((i) => (
                <i key={i} style={{ ["--a" as string]: `${(i / CONFETTI.length) * 360}deg`, ["--c" as string]: i % 3 ? "#f26f21" : "#f4efe6" }} />
              ))}
            </span>
          )}
          {!popped && (
            <button type="button" className="al-balloon-x" aria-label={t.close} onClick={dismiss}>
              ×
            </button>
          )}
        </div>
      )}

      {modal && (
        <div className="al-balloon-modal" role="dialog" aria-modal="true" onClick={dismiss}>
          <div onClick={(e) => e.stopPropagation()}>
            <Coupon
              lang={lang}
              onBook={() => {
                dismiss();
                setModal(false);
                onBook();
              }}
            />
            <button type="button" className="al-balloon-close" onClick={dismiss}>
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
