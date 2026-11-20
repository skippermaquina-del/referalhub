"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { copy, heroImages, paths, type Lang } from "@/data/allegiant";
import { scanGallery, scanText } from "@/data/allegiant-stories";
import { useBooking } from "./AllegiantShell";
import { ScanModal } from "./ScanModal";

const SLIDE_MS = 6500;
/** Si un recorrido no termina (no arrancó, red lenta), pasa al siguiente igual. */
const VIDEO_MAX_MS = 12000;

/**
 * Portada a pantalla completa: los ambientes de la casa se alternan solos.
 * Un ambiente puede tener un recorrido en video: se reproduce entero (sin sonido)
 * y al terminar pasa al siguiente. Sin video si la persona pidió menos movimiento
 * o ahorro de datos; ahí queda la foto.
 */
export function Hero({ lang }: { lang: Lang }) {
  const t = copy[lang].hero;
  const { openBook } = useBooking();
  const [room, setRoom] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scan, setScan] = useState(false);
  const [motion, setMotion] = useState(false);
  const [videoOk, setVideoOk] = useState(false);
  const [portrait, setPortrait] = useState(false);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const tall = window.matchMedia("(orientation: portrait)");
    /* eslint-disable react-hooks/set-state-in-effect -- preferencias del navegador, solo en el cliente */
    setMotion(!reduce);
    setVideoOk(!reduce && !saveData);
    setPortrait(tall.matches);
    /* eslint-enable react-hooks/set-state-in-effect */
    const onChange = (e: MediaQueryListEvent) => setPortrait(e.matches);
    tall.addEventListener("change", onChange);
    return () => tall.removeEventListener("change", onChange);
  }, []);

  const next = () => setRoom((r) => (r + 1) % heroImages.length);
  const hasVideo = videoOk && !!heroImages[room].video;

  // Arranca el recorrido desde el principio cada vez que se muestra su ambiente.
  useEffect(() => {
    const v = videos.current[room];
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [room, hasVideo, portrait]);

  useEffect(() => {
    if (paused || !motion) return;
    const timer = setTimeout(next, hasVideo ? VIDEO_MAX_MS : SLIDE_MS);
    return () => clearTimeout(timer);
  }, [paused, motion, room, hasVideo]);

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
      {videoOk &&
        heroImages.map((img, i) =>
          img.video ? (
            <video
              key={`${img.src}-${portrait ? "tall" : "wide"}`}
              ref={(el) => {
                videos.current[i] = el;
              }}
              className="al-hero-img al-hero-video"
              data-active={i === room ? "" : undefined}
              src={portrait ? img.video.tall : img.video.wide}
              poster={portrait ? img.video.tallPoster : img.src}
              muted
              playsInline
              autoPlay={i === room}
              preload={i === room ? "auto" : "metadata"}
              aria-hidden
              onEnded={() => {
                if (!paused) next();
              }}
            />
          ) : null,
        )}
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
          <button type="button" className="al-link" style={{ background: "none", borderTop: 0, borderLeft: 0, borderRight: 0 }} onClick={() => setScan(true)}>
            {scanText[lang].button}
          </button>
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

      {scan && (
        <ScanModal
          story={scanGallery[0].story}
          lang={lang}
          onClose={() => setScan(false)}
          onBook={() => {
            setScan(false);
            openBook();
          }}
        />
      )}
    </section>
  );
}
