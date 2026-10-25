"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { business } from "@/data/allegiant";

/**
 * HERO — video fotorrealista (hero.mp4, 24.9 s, sin audio).
 *
 * Montaje: escáner de rayos X → viaje por las piezas → válvula con fuga →
 * reparación → heladera limpia. Las etiquetas se sincronizan con
 * `video.currentTime`; al terminar queda la tarjeta final con la llamada a la acción.
 */

const DURATION = 24.9;
const END_AT = 20.7;

const CY = "#38d6ff";
const GREEN = "#3dffb0";
const RED = "#ff4d4d";
const AMBER = "#ffb020";

type Phase = {
  id: string;
  a: number;
  b: number;
  title: string;
  note?: string;
  status?: { label: string; color: string };
  step?: number;
};

const TOTAL_STEPS = 6;

const phases: Phase[] = [
  { id: "intro", a: 0.2, b: 2.2, title: "Ever wonder what's inside?" },
  { id: "scan", a: 2.2, b: 5.6, title: "X-ray scan", note: "Looking inside without opening a single panel.", status: { label: "SCANNING", color: CY } },
  { id: "board", a: 5.6, b: 7.0, step: 1, title: "Main control board", note: "The brain: temperatures, fans and defrost cycles.", status: { label: "NORMAL", color: GREEN } },
  { id: "filter", a: 7.0, b: 8.0, step: 2, title: "Water filter", note: "Cleans the line that feeds ice and water.", status: { label: "NORMAL", color: GREEN } },
  { id: "ice", a: 8.0, b: 9.4, step: 3, title: "Ice maker", note: "Fills, freezes and ejects the cubes.", status: { label: "NORMAL", color: GREEN } },
  { id: "fan", a: 9.4, b: 10.4, step: 4, title: "Evaporator fan", note: "Pushes cold air through both compartments.", status: { label: "NORMAL", color: GREEN } },
  { id: "comp", a: 10.4, b: 11.4, step: 5, title: "Compressor", note: "Pumps refrigerant around the cooling loop.", status: { label: "NORMAL", color: GREEN } },
  { id: "fault", a: 11.4, b: 14.3, step: 6, title: "Water inlet valve", note: "Worn seal — water leaking behind the unit.", status: { label: "FAULT DETECTED", color: RED } },
  { id: "fix", a: 14.3, b: 19.3, step: 6, title: "Water inlet valve", note: "Swapping in a factory-spec part.", status: { label: "REPAIRING", color: AMBER } },
  { id: "done", a: 19.3, b: END_AT, step: 6, title: "Water inlet valve", note: "New valve fitted. Water flows, leak gone.", status: { label: "REPAIRED ✓", color: GREEN } },
];

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const still = reduced || failed;

  // Lee el reloj del video cuadro a cuadro.
  useEffect(() => {
    if (still) return;
    let raf = 0;
    const loop = () => {
      const v = ref.current;
      if (v) setT((prev) => (Math.abs(prev - v.currentTime) > 0.04 ? v.currentTime : prev));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [still]);

  const time = still ? DURATION : t;
  const phase = phases.find((p) => time >= p.a && time < p.b) ?? null;
  const endA = still ? 1 : Math.min(1, Math.max(0, (time - END_AT) / 0.7));
  const ended = time >= DURATION - 0.05;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (ended) {
      v.currentTime = 0;
      void v.play();
    } else if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  };

  return (
    <section
      className="relative h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden bg-[#03060d] text-white"
      aria-label="Video: an X-ray look inside a refrigerator, a faulty water valve and its repair"
    >
      <h1 className="sr-only">{business.headline}</h1>

      {/* Video */}
      <div className="absolute inset-0 flex justify-end md:pr-[5%]">
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/allegiant/hero-end.jpg" alt="" className="h-full w-full object-cover md:aspect-[464/688] md:w-auto md:object-contain" />
        ) : (
          <video
            ref={ref}
            className="h-full w-full object-cover md:aspect-[464/688] md:w-auto md:object-contain [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
            poster="/allegiant/hero-poster.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setFailed(true)}
            aria-hidden
          >
            <source src="/allegiant/hero.mp4" type="video/mp4" />
            <source src="/allegiant/hero.webm" type="video/webm" />
          </video>
        )}
      </div>

      {/* Degradados para legibilidad */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 md:bg-gradient-to-r md:from-[#03060d] md:via-[#03060d]/60 md:to-transparent" />

      {/* Fondo extra para leer la tarjeta final sobre el video (móvil) */}
      <div className="pointer-events-none absolute inset-0 bg-black/70 md:hidden" style={{ opacity: endA }} />

      {/* Marca */}
      <div className="absolute left-5 top-4 flex items-center gap-2 font-mono text-[12px] font-bold uppercase tracking-[0.25em] text-white/80 md:left-[6%] md:top-6">
        <span className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-red-500" : "bg-white/40"}`} />
        Allegiant · Internal scan
      </div>

      {/* Texto sincronizado */}
      {!still && endA < 1 && phase && (
        <div
          key={phase.id}
          className="al-fade absolute inset-x-4 bottom-24 md:inset-x-auto md:bottom-auto md:left-[6%] md:top-1/2 md:w-[40%] md:max-w-md md:-translate-y-1/2"
        >
          {phase.id === "intro" ? (
            <p className="text-[34px] font-extrabold leading-tight md:text-[52px]">{phase.title}</p>
          ) : (
            <div className="rounded-2xl border bg-[#05101c]/80 p-5 backdrop-blur" style={{ borderColor: phase.status?.color }}>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[12px] tracking-[0.2em] text-white/60">
                  {phase.step ? `${String(phase.step).padStart(2, "0")} / ${String(TOTAL_STEPS).padStart(2, "0")}` : "SCAN"}
                </span>
                {phase.status && (
                  <span className="rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wider" style={{ color: phase.status.color, background: `${phase.status.color}2e` }}>
                    {phase.status.label}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[26px] font-extrabold leading-tight md:text-[32px]">{phase.title}</p>
              <p className="mt-1 text-[16px] text-white/75">{phase.note}</p>
            </div>
          )}
        </div>
      )}

      {/* Tarjeta final */}
      <div
        className="absolute inset-x-5 bottom-24 z-10 text-center md:inset-x-auto md:bottom-auto md:left-[6%] md:top-1/2 md:w-[40%] md:max-w-xl md:-translate-y-1/2 md:text-left"
        style={{ opacity: endA, transform: `translateY(${(1 - endA) * 24}px)`, pointerEvents: endA > 0.6 ? "auto" : "none" }}
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">{business.name}</p>
        <p className="mt-3 text-[34px] font-extrabold leading-[1.05] md:text-[54px]">{business.headline}</p>
        <p className="mt-4 text-[16px] text-white/80 md:text-[18px]">
          Whatever&apos;s inside, we fix it. Residential &amp; Commercial · Licensed &amp; Insured · {business.discount}.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row md:justify-start sm:justify-center">
          <a href="#book" className="inline-flex items-center justify-center rounded-lg bg-[color:var(--al-orange)] px-7 py-4 text-[15px] font-bold uppercase tracking-wide text-white hover:bg-[color:var(--al-orange-dim)]">
            Book Service
          </a>
          <a href={business.phoneHref} className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-7 py-4 text-[15px] font-bold text-white hover:border-white">
            Call {business.phone}
          </a>
        </div>
      </div>

      {/* Controles + progreso */}
      {!still && (
        <>
          <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
            <div className="h-full bg-[color:var(--al-orange)]" style={{ width: `${(time / DURATION) * 100}%` }} />
          </div>
          <button
            type="button"
            onClick={toggle}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white backdrop-blur hover:border-[color:var(--al-orange)] md:bottom-5 md:right-5 md:top-auto"
            aria-label={ended ? "Replay video" : playing ? "Pause video" : "Play video"}
          >
            {ended ? "Replay ↺" : playing ? "Pause" : "Play"}
          </button>
        </>
      )}
    </section>
  );
}
