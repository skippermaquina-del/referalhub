"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { luxuryBrands, homeBrands, copy, brandLogos, type Lang } from "@/data/allegiant";

type Brand = { name: string; tag: string };

/**
 * Fila manual y sin fin: se arrastra con el dedo o el mouse y da la vuelta
 * sin cortes. La lista va duplicada y la posición se reduce al ancho de una copia.
 */
function LoopRow({ brands, offset }: { brands: Brand[]; offset: number }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let setWidth = 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastTime = 0;
    let frame = 0;

    const apply = () => {
      if (!setWidth) return;
      x = -((((-x) % setWidth) + setWidth) % setWidth);
      track.style.transform = `translate3d(${x}px,0,0)`;
    };

    const measure = () => {
      setWidth = track.scrollWidth / 2;
      x = -offset * (setWidth / brands.length);
      apply();
    };

    const coast = (time: number) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;
      x += velocity * dt;
      velocity *= Math.pow(0.94, dt / 16);
      apply();
      frame = Math.abs(velocity) > 0.02 ? requestAnimationFrame(coast) : 0;
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastTime = e.timeStamp;
      velocity = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      track.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dt = Math.max(e.timeStamp - lastTime, 1);
      velocity = 0.8 * velocity + 0.2 * (dx / dt);
      lastX = e.clientX;
      lastTime = e.timeStamp;
      x += dx;
      apply();
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      lastTime = performance.now();
      if (Math.abs(velocity) > 0.05) frame = requestAnimationFrame(coast);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
    };
  }, [brands.length, offset]);

  return (
    <div className="al-carousel-continuous-row">
      <div ref={trackRef} className="al-carousel-continuous-track">
        {[...brands, ...brands].map((brand, idx) => (
          <div key={idx} className="al-carousel-continuous-card" aria-hidden={idx >= brands.length}>
            {brandLogos[brand.name] ? (
              <Image
                src={brandLogos[brand.name]}
                alt={brand.name}
                width={180}
                height={80}
                draggable={false}
                className="al-carousel-continuous-logo"
              />
            ) : (
              <span className="al-carousel-continuous-name">{brand.name}</span>
            )}
            <span className="al-carousel-continuous-tag">{brand.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContinuousCarousel({ lang }: { lang: Lang }) {
  const t = copy[lang].brands;

  const allBrands: Brand[] = [];
  for (let i = 0; i < luxuryBrands.length; i++) {
    allBrands.push({ name: luxuryBrands[i], tag: t.luxury });
    allBrands.push({ name: homeBrands[i], tag: t.home });
  }

  const row1 = allBrands.slice(0, 8);
  const row2 = allBrands.slice(8, 16);
  const row3 = allBrands.slice(16, 24);

  return (
    <section className="al-carousel-continuous">
      <div className="al-grid12 al-section-head" style={{ marginBottom: 48 }}>
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h2 className="al-h2">{t.h2}</h2>
      </div>

      <LoopRow brands={row1} offset={0} />
      <LoopRow brands={row2} offset={2.5} />
      <LoopRow brands={row3} offset={1} />

      <div className="al-all-brands" style={{ marginTop: 48 }}>
        <span className="al-all-brands-plus" aria-hidden="true">+</span>
        <span className="al-all-brands-text">{t.all}</span>
      </div>
    </section>
  );
}
