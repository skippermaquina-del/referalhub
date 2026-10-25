"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { business } from "@/data/allegiant";
import type { Story } from "@/data/allegiant-stories";

/**
 * Reproductor de una "historia" en video (rayos X → falla → reparación).
 * Las etiquetas se sincronizan con `video.currentTime`; al terminar queda la
 * tarjeta final con la llamada a la acción.
 *  - variant "hero": ocupa la primera pantalla y arranca solo.
 *  - variant "section": va dentro de la página, arranca al verse y se pausa al salir.
 */

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function StoryVideo({ story, variant }: { story: Story; variant: "hero" | "section" }) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(variant === "hero");
  const [failed, setFailed] = useState(false);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const still = reduced || failed;
  const hero = variant === "hero";
  const { phases, duration, endAt } = story;

  // Reloj del video, cuadro a cuadro.
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

  // En sección: precarga al acercarse, reproduce al verse y pausa al salir.
  useEffect(() => {
    if (hero || still) return;
    const el = wrap.current;
    const v = ref.current;
    if (!el || !v) return;
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.preload = "auto";
      },
      { rootMargin: "500px" },
    );
    const vis = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.ended) void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.4 },
    );
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, [hero, still]);

  const time = still ? duration : t;
  const phase = phases.find((p) => time >= p.a && time < p.b) ?? null;
  const endA = still ? 1 : Math.min(1, Math.max(0, (time - endAt) / 0.7));
  const ended = time >= duration - 0.05;

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

  const size = hero ? "h-[calc(100svh-4rem)] min-h-[560px]" : "h-[88svh] min-h-[600px] md:h-[720px]";

  return (
    <section
      ref={wrap}
      className={`relative ${size} w-full overflow-hidden bg-[#03060d] text-white`}
      aria-label={`Video: an X-ray look inside a ${story.label.toLowerCase()}, a fault and its repair`}
    >
      {hero && <h1 className="sr-only">{business.headline}</h1>}

      {/* Video */}
      <div className="absolute inset-0 flex justify-end md:pr-[5%]">
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.endImage} alt="" className="h-full w-full object-cover md:w-auto md:object-contain" style={{ aspectRatio: story.aspect }} />
        ) : (
          <video
            ref={ref}
            className="h-full w-full object-cover md:w-auto md:object-contain [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
            style={{ aspectRatio: story.aspect }}
            poster={story.poster}
            autoPlay={hero}
            muted
            playsInline
            preload={hero ? "auto" : "none"}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={(e) => e.currentTarget.error && setFailed(true)}
            aria-hidden
          >
            <source src={story.mp4} type="video/mp4" />
            {/* Último formato: si también falla no queda alternativa → imagen fija. */}
            <source src={story.webm} type="video/webm" onError={() => setFailed(true)} />
          </video>
        )}
      </div>

      {/* Degradados para legibilidad */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 md:bg-gradient-to-r md:from-[#03060d] md:via-[#03060d]/60 md:to-transparent" />
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
                  {phase.step ? `${String(phase.step).padStart(2, "0")} / ${String(story.totalSteps).padStart(2, "0")}` : "SCAN"}
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
        <p className="mt-3 text-[34px] font-extrabold leading-[1.05] md:text-[54px]">{story.endTitle ?? business.headline}</p>
        <p className="mt-4 text-[16px] text-white/80 md:text-[18px]">
          {story.endBody ?? "Whatever's inside, we fix it."} Residential &amp; Commercial · Licensed &amp; Insured · {business.discount}.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
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
            <div className="h-full bg-[color:var(--al-orange)]" style={{ width: `${(time / duration) * 100}%` }} />
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
