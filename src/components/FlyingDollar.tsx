"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const QUERIES = ["(pointer: fine)", "(prefers-reduced-motion: reduce)"];

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function shouldFly() {
  return window.matchMedia(QUERIES[0]).matches && !window.matchMedia(QUERIES[1]).matches;
}

// A winged gold dollar coin that trails the mouse. It doesn't replace the
// real cursor (that would hurt click precision), and it only runs on devices
// with a fine pointer and no reduced-motion preference — so phones and
// motion-sensitive visitors never see it. Over links and buttons it flaps
// faster and grows a little, nudging attention toward the CTAs.
export function FlyingDollar() {
  // Server snapshot is false, so SSR and hydration render nothing.
  const enabled = useSyncExternalStore(subscribe, shouldFly, () => false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let excited = false;
    let visible = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        // Start right next to the cursor instead of flying in from the corner.
        pos.x = target.x;
        pos.y = target.y;
        visible = true;
        el.style.opacity = "1";
      }
      const next = !!(e.target as Element | null)?.closest?.("a, button");
      if (next !== excited) {
        excited = next;
        el.dataset.excited = String(excited);
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = "0";
    };

    const tick = () => {
      // Ease toward a point just below-right of the cursor so it trails it.
      const dx = target.x + 34 - pos.x;
      const dy = target.y + 30 - pos.y;
      pos.x += dx * 0.12;
      pos.y += dy * 0.12;
      const tilt = Math.max(-25, Math.min(25, dx * 0.6));
      const bob = Math.sin(performance.now() / 260) * 3;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y + bob}px, 0) rotate(${tilt}deg)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      data-excited="false"
      className="flying-dollar pointer-events-none fixed left-0 top-0 z-[60] opacity-0 transition-opacity duration-300"
    >
      <svg viewBox="0 0 64 40" width="48" height="30" className="-translate-x-1/2 -translate-y-1/2 drop-shadow">
        <g className="flying-dollar-wing flying-dollar-wing-left">
          <path d="M22 20 C14 8, 4 8, 1 12 C6 13, 8 16, 6 18 C10 18, 12 21, 10 23 C15 23, 19 23, 22 22 Z" fill="#fff" stroke="#d4d4d4" strokeWidth="1" />
        </g>
        <g className="flying-dollar-wing flying-dollar-wing-right">
          <path d="M42 20 C50 8, 60 8, 63 12 C58 13, 56 16, 58 18 C54 18, 52 21, 54 23 C49 23, 45 23, 42 22 Z" fill="#fff" stroke="#d4d4d4" strokeWidth="1" />
        </g>
        <circle cx="32" cy="21" r="12" fill="#E8C878" stroke="#A8883E" strokeWidth="2" />
        <circle cx="32" cy="21" r="8.5" fill="none" stroke="#C9A95E" strokeWidth="1" />
        <text x="32" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fill="#7a5e1e" fontFamily="Arial, sans-serif">
          $
        </text>
      </svg>
    </div>
  );
}
