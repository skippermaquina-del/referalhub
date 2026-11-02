"use client";

import { useEffect, useRef, useState } from "react";

const RM = "(prefers-reduced-motion: reduce)";

/**
 * Short del canal, alojado en el sitio (no el reproductor de YouTube, que
 * muestra una miniatura borrosa): arranca en silencio y en bucle cuando entra
 * en pantalla y se pausa al salir. Con movimiento reducido no arranca solo.
 */
export function ChannelVideo({
  label,
  sound,
  src = "/allegiant/video/short.mp4",
  poster = "/allegiant/video/short-poster.jpg",
  hasSound = true,
}: {
  label: string;
  sound: { on: string; off: string };
  src?: string;
  poster?: string;
  hasSound?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia(RM).matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <div className="al-video-frame">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      {hasSound && (
        <button
          type="button"
          className="al-video-sound"
          onClick={toggleSound}
          aria-label={muted ? sound.on : sound.off}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#f4efe6"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" />
            {muted ? (
              <path d="M17 9 L22 14 M22 9 L17 14" />
            ) : (
              <path d="M17 8 Q20 12 17 16 M19.5 6 Q24 12 19.5 18" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
