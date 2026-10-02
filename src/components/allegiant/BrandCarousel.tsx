"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { brandLogos, copy, homeBrands, luxuryBrands, type Lang } from "@/data/allegiant";

type Card = { name: string; tag: string };

/**
 * Carrusel horizontal de marcas, en modo manual: se desplaza con el dedo
 * (desplazamiento nativo), arrastrando con el mouse, con el teclado (flechas,
 * cuando tiene el foco) o con los botones. No avanza solo.
 */
export function BrandCarousel({ lang }: { lang: Lang }) {
  const t = copy[lang].brands;

  // Se intercalan marcas de lujo y de uso diario, para que cada cliente se vea reflejado.
  const cards: Card[] = [];
  luxuryBrands.forEach((name, i) => {
    cards.push({ name, tag: t.luxury });
    cards.push({ name: homeBrands[i], tag: t.home });
  });

  const scroller = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".al-brand-card");
    const gap = parseFloat(getComputedStyle(el.firstElementChild as Element).columnGap) || 20;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  // Arrastre con mouse (en pantallas táctiles el desplazamiento ya es nativo).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !scroller.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !scroller.current) return;
    scroller.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className="al-carousel" role="group" aria-roledescription="carousel" aria-label={t.eyebrow}>
      <button
        type="button"
        className="al-carousel-btn"
        aria-label={t.prev}
        disabled={atStart}
        onClick={() => scrollByCards(-1)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M15 5 L8 12 L15 19" />
        </svg>
      </button>
      <div
        ref={scroller}
        className="al-carousel-window"
        data-dragging={dragging ? "" : undefined}
        tabIndex={0}
        role="region"
        aria-label={t.eyebrow}
        onScroll={updateEdges}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="al-carousel-track">
          {cards.map((c) => {
            const logo = brandLogos[c.name];
            return (
              <div key={c.name} className="al-brand-card">
                {logo ? (
                  <Image src={logo} alt={c.name} width={170} height={46} draggable={false} className="al-brand-card-logo" />
                ) : (
                  <span className="al-brand-card-name">{c.name}</span>
                )}
                <span className="al-brand-card-tag">{c.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        className="al-carousel-btn"
        aria-label={t.next}
        disabled={atEnd}
        onClick={() => scrollByCards(1)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M9 5 L16 12 L9 19" />
        </svg>
      </button>
    </div>
  );
}
