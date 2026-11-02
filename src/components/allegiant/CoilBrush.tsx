"use client";

import { useEffect, useRef, useState } from "react";

const W = 560;
const H = 240;
const BRUSH = 54;
const RM = "(prefers-reduced-motion: reduce)";

/** Generador pseudoaleatorio con semilla, para que el polvo siempre se vea igual. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paintDust(ctx: CanvasRenderingContext2D, dust: number) {
  const rand = rng(7);
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(118,110,98,${0.2 + dust * 0.3})`;
  ctx.fillRect(0, 0, W, H);
  const colors = ["#8a8478", "#a39d90", "#6f6a60", "#b8b2a3", "#7b7568"];
  for (let i = 0; i < Math.floor(3200 * dust); i++) {
    ctx.globalAlpha = 0.25 + rand() * 0.55;
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    ctx.beginPath();
    ctx.arc(rand() * W, rand() * H, 2 + rand() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.4;
  for (let i = 0; i < Math.floor(90 * dust); i++) {
    const x = rand() * W;
    const y = rand() * H;
    ctx.strokeStyle = colors[Math.floor(rand() * colors.length)];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 30 * (rand() - 0.5), y + 40 * rand(), x + 50 * (rand() - 0.5), y + 60 * rand(), x + 40 * (rand() - 0.5), y + 70 * rand());
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** Porcentaje de polvo que queda (muestreando 1 de cada 16 píxeles). */
function dustLeft(ctx: CanvasRenderingContext2D) {
  const data = ctx.getImageData(0, 0, W, H).data;
  let n = 0;
  for (let i = 3; i < data.length; i += 16 * 4) if (data[i] > 40) n++;
  return n;
}

/**
 * Bobinas del condensador cubiertas de polvo: se limpian arrastrando el dedo o
 * el mouse. Informa qué fracción (0–1) del polvo ya se quitó.
 */
export function CoilBrush({
  dust,
  alt,
  cleanLabel,
  dustLabel,
  onClean,
  cleaned,
}: {
  dust: number;
  alt: string;
  cleanLabel: string;
  dustLabel: string;
  onClean: (fraction: number) => void;
  cleaned: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const start = useRef(1);
  const last = useRef<{ x: number; y: number } | null>(null);
  const lastMeasure = useRef(0);
  const raf = useRef(0);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    paintDust(ctx, dust);
    start.current = Math.max(1, dustLeft(ctx));
    return () => cancelAnimationFrame(raf.current);
  }, [dust]);

  function measure() {
    const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    onClean(Math.min(1, Math.max(0, 1 - dustLeft(ctx) / start.current)));
  }

  function stroke(ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = BRUSH;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function point(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = point(e);
    setDrawing(true);
    const ctx = e.currentTarget.getContext("2d");
    if (ctx) stroke(ctx, last.current, last.current);
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!last.current) return;
    const ctx = e.currentTarget.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const p = point(e);
    stroke(ctx, last.current, p);
    last.current = p;
    const now = performance.now();
    if (now - lastMeasure.current > 120) {
      lastMeasure.current = now;
      measure();
    }
  }

  function onUp() {
    last.current = null;
    setDrawing(false);
    measure();
  }

  function autoClean() {
    const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    if (window.matchMedia(RM).matches) {
      ctx.clearRect(0, 0, W, H);
      onClean(1);
      return;
    }
    cancelAnimationFrame(raf.current);
    const rows = [30, 90, 150, 210];
    const total = 1800;
    const t0 = performance.now();
    let prev = { x: -BRUSH, y: rows[0] };
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / total);
      const pos = k * rows.length;
      const row = Math.min(rows.length - 1, Math.floor(pos));
      const f = pos - row;
      const x = (row % 2 === 0 ? f : 1 - f) * (W + BRUSH * 2) - BRUSH;
      const next = { x, y: rows[row] };
      if (Math.abs(next.y - prev.y) > 1) prev = { x: next.x, y: next.y };
      stroke(ctx, prev, next);
      prev = next;
      measure();
      if (k < 1) raf.current = requestAnimationFrame(tick);
      else {
        ctx.clearRect(0, 0, W, H);
        onClean(1);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }

  const left = 1 - cleaned;
  const heat = Math.min(1, left * (0.3 + dust * 0.7));

  return (
    <div className="al-brush">
      <div
        className="al-brush-stage"
        data-drawing={drawing ? "" : undefined}
        style={{ boxShadow: `0 0 ${Math.round(heat * 46)}px rgba(255,70,30,${(heat * 0.55).toFixed(2)})` }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="al-brush-coil" aria-hidden="true">
          <rect width={W} height={H} fill="#0b1527" />
          {Array.from({ length: 70 }, (_, i) => (
            <line key={i} x1={i * 8 + 4} y1="0" x2={i * 8 + 4} y2={H} stroke="#5d79b0" strokeWidth="1.3" opacity="0.55" />
          ))}
          {[28, 88, 148, 208].map((y, i) => (
            <path
              key={y}
              d={`M-10 ${y} H${W + 10}`}
              stroke="#c87941"
              strokeWidth="13"
              strokeLinecap="round"
              opacity={0.95 - i * 0.04}
            />
          ))}
          {[28, 88, 148, 208].map((y) => (
            <path key={`h${y}`} d={`M-10 ${y - 4} H${W + 10}`} stroke="#e8a56b" strokeWidth="3" opacity="0.5" />
          ))}
        </svg>
        <div className="al-brush-heat" style={{ opacity: heat }} aria-hidden="true" />
        <canvas
          ref={canvas}
          width={W}
          height={H}
          className="al-brush-dust"
          role="img"
          aria-label={alt}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </div>
      <div className="al-brush-meter">
        <span>{dustLabel}</span>
        <div className="al-brush-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(cleaned * 100)}>
          <i style={{ width: `${Math.round(cleaned * 100)}%` }} />
        </div>
        <strong>{Math.round(cleaned * 100)}%</strong>
      </div>
      <button type="button" className="al-btn-line" onClick={autoClean}>
        {cleanLabel}
      </button>
    </div>
  );
}
