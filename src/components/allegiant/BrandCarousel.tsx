"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { brandLogos, copy, homeBrands, luxuryBrands, type Lang } from "@/data/allegiant";

type Card = { name: string; tag: string };

/**
 * Carrusel horizontal de marcas: avanza una cada 3 segundos y vuelve al
 * inicio sin saltos (las primeras tarjetas se repiten al final). Se detiene
 * al pasar el cursor, al enfocar y con "reducir movimiento".
 */
export function BrandCarousel({ lang }: { lang: Lang }) {
  const t = copy[lang].brands;

  // Se intercalan marcas de lujo y de uso diario, para que cada cliente se vea reflejado.
  const base: Card[] = [];
  luxuryBrands.forEach((name, i) => {
    base.push({ name, tag: t.luxury });
    base.push({ name: homeBrands[i], tag: t.home });
  });
  const total = base.length;
  const cards = [...base, ...base.slice(0, 6)];

  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const step = useCallback(
    (dir: 1 | -1) => {
      if (dir === 1) {
        setInstant(false);
        setIndex((i) => i + 1);
        // Al llegar a las copias del final, vuelve al inicio sin animar.
        if (index + 1 >= total) {
          later(() => {
            setInstant(true);
            setIndex(0);
          }, 900);
          later(() => setInstant(false), 1000);
        }
      } else if (index === 0) {
        setInstant(true);
        setIndex(total);
        later(() => {
          setInstant(false);
          setIndex(total - 1);
        }, 60);
      } else {
        setInstant(false);
        setIndex((i) => i - 1);
      }
    },
    [index, total],
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => step(1), 3000);
    return () => clearInterval(timer);
  }, [paused, step]);

  return (
    <div
      className="al-carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={t.eyebrow}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button type="button" className="al-carousel-btn" aria-label={t.prev} onClick={() => step(-1)}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f4efe6" strokeWidth="1.5" aria-hidden="true">
          <path d="M15 5 L8 12 L15 19" />
        </svg>
      </button>
      <div className="al-carousel-window">
        <div
          className="al-carousel-track"
          data-instant={instant ? "" : undefined}
          style={{ ["--al-index" as string]: index }}
        >
          {cards.map((c, i) => {
            const logo = brandLogos[c.name];
            return (
              <div key={`${c.name}-${i}`} className="al-brand-card" aria-hidden={i >= total}>
                {logo ? (
                  <Image src={logo} alt={c.name} width={170} height={46} className="al-brand-card-logo" />
                ) : (
                  <span className="al-brand-card-name">{c.name}</span>
                )}
                <span className="al-brand-card-tag">{c.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button type="button" className="al-carousel-btn" aria-label={t.next} onClick={() => step(1)}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f4efe6" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 5 L16 12 L9 19" />
        </svg>
      </button>
    </div>
  );
}
