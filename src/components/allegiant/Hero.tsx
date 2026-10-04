"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { copy, heroImages, paths, type Lang } from "@/data/allegiant";
import { useBooking } from "./AllegiantShell";

/** Portada a pantalla completa: los ambientes de la casa se alternan solos. */
export function Hero({ lang }: { lang: Lang }) {
  const t = copy[lang].hero;
  const { openBook } = useBooking();
  const [room, setRoom] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = setInterval(() => setRoom((r) => (r + 1) % heroImages.length), 6500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section id="top" className="al-hero">
      {heroImages.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt[lang]}
          fill
          sizes="100vw"
          priority={i === 0}
          className="al-hero-img"
          data-active={i === room ? "" : undefined}
          aria-hidden={i !== room}
        />
      ))}
      <div className="al-hero-shade" />
      <div className="al-hero-shade-bottom" />

      <div className="al-hero-body">
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h1 className="al-hero-title">
          {t.h1a} <em>{t.h1b}</em> {t.h1c}
        </h1>
        <p className="al-hero-p">{t.p}</p>
        <div className="al-hero-actions">
          <a className="al-link" href={paths(lang).tour}>{t.tour}</a>
        </div>
      </div>

      <div
        className="al-hero-rooms"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {t.rooms.map((name, i) => (
          <button
            key={name}
            type="button"
            className="al-hero-room"
            aria-current={i === room}
            onClick={() => setRoom(i)}
          >
            {name}
          </button>
        ))}
      </div>
    </section>
  );
}
