"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

const W = 300;
const H = 534;

/**
 * Reproduce un video grabado sobre fondo negro y lo dibuja en un canvas con
 * el negro vuelto transparente (así funciona igual en iPhone, donde el webm
 * con alpha no existe).
 */
function KeyedVideo({
  name,
  loop,
  still,
  onEnded,
}: {
  name: string;
  loop?: boolean;
  /** Sin movimiento: dibuja un solo cuadro. */
  still?: boolean;
  onEnded?: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const v = video.current;
    const c = canvas.current;
    const ctx = c?.getContext("2d", { willReadFrequently: true });
    if (!v || !c || !ctx) return;
    let raf = 0;
    const draw = () => {
      if (v.readyState >= 2) {
        ctx.drawImage(v, 0, 0, W, H);
        const img = ctx.getImageData(0, 0, W, H);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const m = Math.max(d[i], d[i + 1], d[i + 2]) / 255;
          const a = (m - 0.03) / 0.09;
          d[i + 3] = a <= 0 ? 0 : a >= 1 ? 255 : a * 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    if (still) {
      v.addEventListener("loadeddata", draw, { once: true });
    } else {
      v.play().catch(() => {});
      raf = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("loadeddata", draw);
    };
  }, [still]);

  return (
    <>
      <video ref={video} muted playsInline preload="auto" loop={loop} onEnded={onEnded} className="al-balloon-src">
        <source src={`/allegiant/balloon/${name}.mp4`} type="video/mp4" />
        <source src={`/allegiant/balloon/${name}.webm`} type="video/webm" />
      </video>
      <canvas ref={canvas} width={W} height={H} className="al-balloon-canvas" aria-hidden="true" />
    </>
  );
}

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Globo real que flota por la página a los 10 s; al pincharlo se abre la oferta. */
export function OfferBalloon({ lang, suppressed, onBook }: { lang: Lang; suppressed: boolean; onBook: () => void }) {
  const t = balloonText[lang];
  const [show, setShow] = useState(false);
  const [popped, setPopped] = useState(false);
  const [modal, setModal] = useState(false);
  const still = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);

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
    window.setTimeout(() => setModal(true), still ? 0 : 1300);
  }

  function dismiss() {
    remember();
    setShow(false);
    setPopped(false);
    setModal(false);
  }

  return (
    <>
      {show && !modal && (
        <div className="al-balloon" data-hidden={suppressed ? "" : undefined}>
          <div className="al-balloon-drift" data-still={still ? "" : undefined}>
            <div className="al-balloon-box">
              {popped && !still ? <KeyedVideo key="pop" name="pop" /> : <KeyedVideo key="float" name="float" loop still={still} />}
              {!popped && (
                <>
                  <button type="button" className="al-balloon-hit" aria-label={t.label} onClick={pop} />
                  <button type="button" className="al-balloon-x" aria-label={t.close} onClick={dismiss}>
                    ×
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="al-balloon-modal" role="dialog" aria-modal="true" onClick={dismiss}>
          <div onClick={(e) => e.stopPropagation()}>
            <Coupon
              lang={lang}
              onBook={() => {
                dismiss();
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
