"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Versión pequeña (cabecera): sin resplandor grande. */
  compact?: boolean;
  label: { on: string; off: string };
};

/**
 * El isotipo de Allegiant como botón de encendido: arranca apagado, se
 * enciende solo (el aro se dibuja, la "A" pasa a blanco, se prende el punto)
 * y se apaga o enciende con un clic sobre el propio logo.
 */
export function PowerMark({ compact = false, label }: Props) {
  const [on, setOn] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setOn(true), 1200);
    const beat = setInterval(() => setPulse((p) => !p), 1900);
    return () => {
      clearTimeout(start);
      clearInterval(beat);
    };
  }, []);

  const glow = on ? (pulse ? (compact ? 10 : 34) : compact ? 4 : 14) : 0;

  return (
    <button
      type="button"
      className="al-power"
      aria-pressed={on}
      aria-label={on ? label.off : label.on}
      onClick={() => setOn((v) => !v)}
    >
      <svg
        viewBox="0 0 1000 1000"
        fill="none"
        aria-hidden="true"
        style={{ filter: `drop-shadow(0 0 ${glow}px rgba(242,111,33,0.6))` }}
      >
        <circle
          className="al-power-disc"
          cx="500"
          cy="500"
          r="290"
          fill={on ? "#1c2f58" : "#0f1a30"}
        />
        <path
          d="M350 184 A350 350 0 1 0 650 184"
          stroke="#16233f"
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          className="al-power-arc"
          d="M350 184 A350 350 0 1 0 650 184"
          pathLength="100"
          stroke="#f26f21"
          strokeWidth="28"
          strokeLinecap="round"
          style={{ strokeDashoffset: on ? 0 : 100 }}
        />
        <path
          className="al-power-a"
          d="M500 192 L368 708 M500 192 L632 708"
          strokeWidth="62"
          strokeLinecap="round"
          stroke={on ? "#ffffff" : "#34456b"}
        />
        <circle
          className="al-power-dot"
          cx="500"
          cy="550"
          r="45"
          fill={on ? "#f26f21" : "#4a3326"}
        />
      </svg>
    </button>
  );
}
