"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { business } from "@/data/allegiant";

/**
 * HERO — "Inside your refrigerator" (15 s)
 *
 * Una sola línea de tiempo (t en segundos) gobierna todo. Cada fotograma es
 * una función pura de t, así que la animación se puede reproducir, pausar,
 * arrastrar y también renderizar cuadro a cuadro a MP4 (?capture=1).
 *
 *  0.0– 1.6  Plano exterior: nevera de acero, reflejo, polvo en suspensión
 *  1.6– 3.2  Escáner de rayos X barre la nevera de arriba a abajo
 *  3.2– 9.6  Viaje de pieza a pieza siguiendo el agua y el refrigerante
 *  9.6–12.4  Fallo en la válvula de entrada de agua → reparación → resuelto
 * 12.4–13.4  Escáner inverso: la nevera vuelve a cerrarse
 * 13.4–15.0  Tarjeta final con llamada a la acción
 */

const DURATION = 15;
const CY = "#38d6ff";
const GREEN = "#3dffb0";
const RED = "#ff4d4d";
const AMBER = "#ffb020";
const ORANGE = "#f26b21";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const out = (x: number) => 1 - Math.pow(1 - x, 3);

type Part = {
  id: string;
  name: string;
  note: string;
  x: number;
  y: number;
  t0: number;
  t1: number;
  zoom: number;
};

const parts: Part[] = [
  { id: "board", name: "Main control board", note: "The brain: temperatures, fans and defrost cycles.", x: 750, y: 102, t0: 3.2, t1: 4.6, zoom: 2.3 },
  { id: "filter", name: "Water filter", note: "Cleans the line that feeds ice and water.", x: 801, y: 188, t0: 4.6, t1: 5.9, zoom: 2.4 },
  { id: "ice", name: "Ice maker", note: "Fills, freezes and ejects the cubes.", x: 517, y: 132, t0: 5.9, t1: 7.2, zoom: 2.3 },
  { id: "fan", name: "Evaporator fan", note: "Pushes cold air through both compartments.", x: 640, y: 545, t0: 7.2, t1: 8.5, zoom: 2.1 },
  { id: "comp", name: "Compressor", note: "Pumps refrigerant around the cooling loop.", x: 507, y: 628, t0: 8.5, t1: 9.6, zoom: 2.4 },
  { id: "valve", name: "Water inlet valve", note: "", x: 780, y: 638, t0: 9.6, t1: 12.4, zoom: 2.8 },
];

const VALVE_FAULT = 10.0;
const VALVE_FIX = 11.05;
const VALVE_DONE = 11.7;

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/** Cámara: keyframes con pausas en cada pieza. */
function camera(t: number, portrait: boolean) {
  const base = portrait ? 1.08 : 0.98;
  const k: { t: number; s: number; x: number; y: number }[] = [
    { t: 0, s: base * 0.86, x: 640, y: 360 },
    { t: 3.2, s: base, x: 640, y: 360 },
  ];
  for (const p of parts) {
    k.push({ t: p.t0 + 0.65, s: p.zoom, x: p.x, y: p.y });
    k.push({ t: p.t1 - 0.05, s: p.zoom, x: p.x, y: p.y });
  }
  k.push({ t: 13.2, s: portrait ? 0.78 : 0.9, x: portrait ? 640 : 900, y: portrait ? 470 : 360 });
  k.push({ t: 15, s: portrait ? 0.8 : 0.92, x: portrait ? 640 : 900, y: portrait ? 470 : 360 });
  if (t <= k[0].t) return k[0];
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i];
    const b = k[i + 1];
    if (t <= b.t) {
      const e = io(seg(t, a.t, b.t));
      return { s: lerp(a.s, b.s, e), x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e) };
    }
  }
  return k[k.length - 1];
}

function Blades({ cx, cy, r, angle }: { cx: number; cy: number; r: number; angle: number }) {
  return (
    <g transform={`rotate(${angle} ${cx} ${cy})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          transform={`rotate(${i * 72} ${cx} ${cy})`}
          d={`M${cx} ${cy} C${cx + r * 0.55} ${cy - r * 0.15} ${cx + r * 0.7} ${cy - r * 0.85} ${cx + r * 0.1} ${cy - r * 0.95} C${cx - r * 0.1} ${cy - r * 0.5} ${cx - r * 0.05} ${cy - r * 0.2} ${cx} ${cy}Z`}
          fill="#0b4a66"
          stroke={CY}
          strokeWidth={1.4}
        />
      ))}
      <circle cx={cx} cy={cy} r={7} fill="#06222e" stroke={CY} strokeWidth={2} />
    </g>
  );
}

export function HeroXray() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dims, setDims] = useState({ w: 1280, h: 720 });
  const box = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const captureRef = useRef(false);

  // Tamaño del contenedor → orientación del lienzo.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      const ratio = r.width / Math.max(r.height, 1);
      const next = ratio < 0.9
        ? { w: Math.round(clamp(1000 * ratio, 420, 760)), h: 1000 }
        : { w: 1280, h: 720 };
      setDims((d) => (d.w === next.w && d.h === next.h ? d : next));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Modo captura: el reloj lo controla un script externo.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("capture")) return;
    captureRef.current = true;
    (window as unknown as { __setT?: (v: number) => void }).__setT = (v) => setT(clamp(v, 0, DURATION));
    document.documentElement.setAttribute("data-capture-ready", "1");
  }, []);

  // Reloj de reproducción.
  useEffect(() => {
    if (!playing || reduced) return;
    if (captureRef.current) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let stop = false;
      setT((prev) => {
        const n = Math.min(DURATION, prev + dt);
        if (n >= DURATION) stop = true;
        return n;
      });
      if (stop) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced]);

  const replay = useCallback(() => {
    setT(0);
    setPlaying(true);
  }, []);

  const time = reduced ? 14.6 : t;
  const { w: W, h: H } = dims;
  const portrait = W < H;
  const cam = camera(time, portrait);
  const cx = W / 2;
  const cy = portrait ? H * 0.42 : H * 0.46;
  const rot = Math.sin(time * 0.7) * 0.6;
  const project = (px: number, py: number) => ({ x: cx + (px - cam.x) * cam.s, y: cy + (py - cam.y) * cam.s });

  // Escáner: sentido directo (1.6–3.2) e inverso (12.4–13.4).
  let scanY = 40;
  let scanning = false;
  if (time >= 1.6 && time < 3.2) {
    scanY = 40 + 640 * io(seg(time, 1.6, 3.2));
    scanning = true;
  } else if (time >= 3.2 && time < 12.4) {
    scanY = 700;
  } else if (time >= 12.4 && time < 13.4) {
    scanY = 700 - 660 * io(seg(time, 12.4, 13.4));
    scanning = true;
  }

  const act = (p: Part) => {
    const end = p.id === "valve" ? 12.2 : p.t1;
    return seg(time, p.t0 + 0.3, p.t0 + 0.7) * (1 - seg(time, end - 0.25, end));
  };
  const activePart = parts.find((p) => time >= p.t0 && time < p.t1) ?? null;
  const valveBroken = time >= VALVE_FAULT && time < VALVE_FIX;
  const valveFixed = time >= VALVE_DONE;
  const fixing = time >= VALVE_FIX && time < VALVE_DONE;

  const dim = (id: string) => {
    const p = parts.find((q) => q.id === id)!;
    return 0.38 + 0.62 * act(p);
  };

  // Estado del HUD.
  let status = { label: "ANALYZING", color: AMBER };
  let note = activePart?.note ?? "";
  if (activePart?.id === "valve") {
    if (time < VALVE_FAULT) {
      note = "Checking flow and seals…";
    } else if (valveBroken) {
      status = { label: "FAULT DETECTED", color: RED };
      note = "Worn solenoid seal — water leaking behind the unit.";
    } else if (fixing) {
      status = { label: "REPAIRING", color: AMBER };
      note = "Swapping the valve with a factory-spec part.";
    } else {
      status = { label: "REPAIRED ✓", color: GREEN };
      note = "New valve fitted. Water flows, leak gone.";
    }
  } else if (activePart) {
    status = { label: "NORMAL", color: GREEN };
  }
  const typed = (s: string, t0: number) => s.slice(0, Math.max(0, Math.floor((time - t0) * 42)));
  const idx = activePart ? parts.indexOf(activePart) : -1;

  const endA = out(seg(time, 13.3, 14.1));
  const introA = (1 - seg(time, 1.0, 1.6)) * out(seg(time, 0.15, 0.7));
  const scanA = seg(time, 1.6, 1.9) * (1 - seg(time, 3.0, 3.3));

  // Estado hover de agua.
  const flowSpeed = valveFixed ? 140 : 70;
  const waterDash = -(time * flowSpeed);
  const fanAngle = time * 720;

  const card = portrait
    ? { x: 30, y: H - 330, w: W - 60, h: 200 }
    : { x: 60, y: H - 250, w: 400, h: 170 };
  const activeScr = activePart ? project(activePart.x, activePart.y) : null;
  const a = activePart ? act(activePart) : 0;

  return (
    <section
      ref={box}
      className="relative h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden bg-[#05070d] text-white"
      aria-label="Animated X-ray tour of a refrigerator and its repairable parts"
    >
      <h1 className="sr-only">{business.headline}</h1>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="A refrigerator is scanned with X-rays, revealing its control board, water filter, ice maker, fan, compressor and a leaking water valve that is then repaired."
      >
        <defs>
          <radialGradient id="hx-bg" cx="50%" cy="46%" r="75%">
            <stop offset="0%" stopColor="#10224a" />
            <stop offset="55%" stopColor="#070d1d" />
            <stop offset="100%" stopColor="#03050a" />
          </radialGradient>
          <linearGradient id="hx-steel" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#aab4c2" />
            <stop offset="18%" stopColor="#e4e9f0" />
            <stop offset="45%" stopColor="#9aa5b4" />
            <stop offset="70%" stopColor="#d6dce5" />
            <stop offset="100%" stopColor="#8794a6" />
          </linearGradient>
          <linearGradient id="hx-body" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#062a3a" stopOpacity={0.92} />
            <stop offset="100%" stopColor="#031a24" stopOpacity={0.96} />
          </linearGradient>
          <linearGradient id="hx-sweep" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity={0} />
            <stop offset="50%" stopColor="#fff" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="hx-scan" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={CY} stopOpacity={0} />
            <stop offset="100%" stopColor={CY} stopOpacity={0.5} />
          </linearGradient>
          <radialGradient id="hx-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={CY} stopOpacity={0.35} />
            <stop offset="100%" stopColor={CY} stopOpacity={0} />
          </radialGradient>
          <filter id="hx-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="hx-ext">
            <rect x={380} y={scanY} width={520} height={760 - scanY} />
          </clipPath>
          <clipPath id="hx-int">
            <rect x={380} y={0} width={520} height={scanY} />
          </clipPath>
        </defs>

        <rect width={W} height={H} fill="url(#hx-bg)" />

        {/* Polvo en suspensión (espacio pantalla) */}
        {Array.from({ length: 30 }, (_, i) => {
          const x = (i * 137) % W;
          const y = (((i * 61) % H) + time * (8 + (i % 5) * 3)) % H;
          return <circle key={i} cx={x} cy={H - y} r={0.8 + (i % 3) * 0.6} fill="#9fd8ff" opacity={0.12 + (i % 4) * 0.07} />;
        })}

        {/* MUNDO */}
        <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${cam.s}) translate(${-cam.x} ${-cam.y})`}>
          {/* Suelo */}
          <ellipse cx={640} cy={676} rx={360} ry={26} fill="url(#hx-floor)" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${640 + (i - 4) * 90} 668 L${640 + (i - 4) * 260} 900`} stroke="#1c3a6b" strokeWidth={1} opacity={0.35} />
          ))}
          {[690, 720, 765, 830].map((y) => (
            <path key={y} d={`M180 ${y} H1100`} stroke="#1c3a6b" strokeWidth={1} opacity={0.3} />
          ))}

          {/* INTERIOR (rayos X) */}
          <g clipPath="url(#hx-int)">
            <rect x={440} y={60} width={400} height={600} rx={18} fill="url(#hx-body)" />
            <rect x={440} y={60} width={400} height={600} rx={18} fill="none" stroke={CY} strokeWidth={2} opacity={0.8} />
            {/* divisiones */}
            <path d="M440 428H840" stroke={CY} strokeWidth={2} opacity={0.5} />
            <path d="M640 60V428" stroke={CY} strokeWidth={1.5} opacity={0.3} strokeDasharray="6 6" />
            {[200, 290, 370].map((y) => (
              <path key={y} d={`M600 ${y}H820`} stroke={CY} strokeWidth={2} opacity={0.22} />
            ))}
            {[210, 300, 380].map((y) => (
              <path key={y} d={`M455 ${y}H585`} stroke={CY} strokeWidth={2} opacity={0.18} />
            ))}
            {/* botellas silueta */}
            {[620, 690, 745].map((x, i) => (
              <rect key={x} x={x} y={i % 2 ? 330 : 240} width={20} height={i % 2 ? 40 : 52} rx={6} fill="#0c3b50" opacity={0.7} />
            ))}
            {/* cajón congelador: cestas */}
            <path d="M460 470H820M460 520H820" stroke={CY} strokeWidth={1.5} opacity={0.2} />

            {/* Refrigerante: compresor → evaporador */}
            <path
              d="M545 624 H585 V585 H600 M690 560 H740 V610 H590 V650 H560"
              fill="none"
              stroke={ORANGE}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="10 12"
              strokeDashoffset={-waterDash * 0.8}
              opacity={0.55 + 0.35 * Math.max(act(parts[3]), act(parts[4]))}
            />

            {/* Línea de agua: válvula → filtro → ice maker */}
            <path
              d="M780 622 V596 H826 V215 M826 160 V75 H517 V94"
              fill="none"
              stroke={CY}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="4 12"
              strokeDashoffset={waterDash}
              opacity={valveBroken ? 0.28 : 0.85}
              filter="url(#hx-glow)"
            />
            <path d="M517 172 V230" stroke={CY} strokeWidth={4} strokeDasharray="4 10" strokeDashoffset={waterDash} opacity={valveBroken ? 0.2 : 0.7} />

            {/* PLACA CONTROL */}
            <g opacity={dim("board")} filter={act(parts[0]) > 0.5 ? "url(#hx-glow)" : undefined}>
              <rect x={700} y={84} width={100} height={38} rx={4} fill="#0b3a3a" stroke={GREEN} strokeWidth={2} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <path key={i} d={`M${706 + i * 16} 90 V116`} stroke={GREEN} strokeWidth={1} opacity={0.5} />
              ))}
              <rect x={712} y={94} width={22} height={14} rx={2} fill="#0b2a2a" stroke={GREEN} />
              <rect x={742} y={94} width={14} height={14} rx={2} fill="#0b2a2a" stroke={GREEN} />
              <rect x={764} y={100} width={26} height={10} rx={2} fill="#0b2a2a" stroke={GREEN} />
              <circle cx={792} cy={90} r={2.6} fill={Math.sin(time * 9) > 0 ? GREEN : "#0b4a3a"} />
            </g>

            {/* FILTRO */}
            <g opacity={dim("filter")} filter={act(parts[1]) > 0.5 ? "url(#hx-glow)" : undefined}>
              <rect x={790} y={150} width={22} height={70} rx={8} fill="#0b3a52" stroke={CY} strokeWidth={2} />
              {[165, 178, 191, 204].map((y) => (
                <path key={y} d={`M793 ${y}H809`} stroke={CY} strokeWidth={1.2} opacity={0.6} />
              ))}
              <rect x={794} y={150 + 70 * (1 - 0.65 - 0.1 * Math.sin(time * 4))} width={14} height={4} fill={CY} opacity={0.3} />
            </g>

            {/* ICE MAKER */}
            <g opacity={dim("ice")} filter={act(parts[2]) > 0.5 ? "url(#hx-glow)" : undefined}>
              <rect x={470} y={94} width={95} height={78} rx={8} fill="#0b3a52" stroke={CY} strokeWidth={2} />
              {[0, 1, 2].map((r) =>
                [0, 1, 2, 3].map((c) => {
                  const grow = clamp(act(parts[2]) * 1.4 - r * 0.2 - c * 0.05);
                  return (
                    <rect key={`${r}${c}`} x={478 + c * 21} y={104 + r * 21} width={14} height={14} rx={3} fill="#bfefff" opacity={0.25 + 0.6 * grow} transform={`translate(0 ${Math.sin(time * 3 + c) * 0.8})`} />
                  );
                })
              )}
              <path d="M470 160H565" stroke={CY} strokeWidth={2} opacity={0.6} />
            </g>

            {/* VENTILADOR + EVAPORADOR */}
            <g opacity={dim("fan")} filter={act(parts[3]) > 0.5 ? "url(#hx-glow)" : undefined}>
              <path
                d="M545 500 H735 V514 H545 V528 H735 V542 H545 V556 H735 V570 H545 V584 H735"
                fill="none"
                stroke="#2f86a8"
                strokeWidth={3}
                strokeLinejoin="round"
                opacity={0.8}
              />
              <circle cx={640} cy={545} r={56} fill="#06222e" stroke={CY} strokeWidth={2} />
              <Blades cx={640} cy={545} r={50} angle={fanAngle} />
            </g>

            {/* COMPRESOR */}
            <g opacity={dim("comp")} filter={act(parts[4]) > 0.5 ? "url(#hx-glow)" : undefined} transform={`translate(${Math.sin(time * 55) * 0.7 * act(parts[4])} 0)`}>
              <rect x={470} y={598} width={74} height={58} rx={16} fill="#0b3a52" stroke={CY} strokeWidth={2} />
              <path d="M484 612 C500 604 514 620 530 612 M484 628 C500 620 514 636 530 628 M484 644 C500 636 514 652 530 644" fill="none" stroke={ORANGE} strokeWidth={2.4} opacity={0.9} />
            </g>

            {/* VÁLVULA DE AGUA */}
            <g opacity={dim("valve")}>
              {/* charco */}
              <ellipse cx={782} cy={664} rx={valveBroken ? 10 + (time - VALVE_FAULT) * 26 : valveFixed ? 6 : 10 + (VALVE_FIX - VALVE_FAULT) * 26} ry={4} fill={CY} opacity={valveFixed ? 0.15 : 0.45} />
              <rect
                x={756}
                y={620}
                width={50}
                height={34}
                rx={8}
                fill={valveFixed ? "#0f5a40" : valveBroken ? "#5a1414" : "#0b3a52"}
                stroke={valveFixed ? GREEN : valveBroken ? RED : CY}
                strokeWidth={2.5}
                filter="url(#hx-glow)"
              />
              {[0, 1, 2].map((i) => (
                <ellipse key={i} cx={781} cy={628 + i * 9} rx={16} ry={3.5} fill="none" stroke={valveFixed ? GREEN : valveBroken ? RED : CY} strokeWidth={1.6} />
              ))}
              <rect x={766} y={654} width={10} height={9} fill="#2f86a8" />
              <rect x={786} y={654} width={10} height={9} fill="#2f86a8" />
              {valveBroken && !fixing && (
                <>
                  <path d="M790 622 l-6 9 l7 3 l-5 10" fill="none" stroke={RED} strokeWidth={2.2} />
                  <circle cx={781} cy={637} r={28 + 10 * Math.sin(time * 10)} fill="none" stroke={RED} strokeWidth={2} opacity={0.6 - 0.3 * Math.sin(time * 10)} />
                  {[0, 1, 2, 3].map((i) => {
                    const ph = (time * 2.2 + i * 0.27) % 1;
                    return <circle key={i} cx={772 + i * 7} cy={660 + ph * 14} r={2.4} fill="#7fdcff" opacity={1 - ph} />;
                  })}
                </>
              )}
              {fixing && (
                <g transform={`rotate(${Math.sin(seg(time, VALVE_FIX, VALVE_DONE) * Math.PI * 4) * 22} 830 610)`}>
                  <path d="M830 610 L800 626" stroke="#d6dce5" strokeWidth={5} strokeLinecap="round" />
                  <circle cx={834} cy={607} r={9} fill="none" stroke="#d6dce5" strokeWidth={4} />
                </g>
              )}
              {time >= VALVE_DONE - 0.05 && time < VALVE_DONE + 0.7 && (
                <>
                  <circle cx={781} cy={637} r={lerp(8, 70, out(seg(time, VALVE_DONE - 0.05, VALVE_DONE + 0.7)))} fill="none" stroke={GREEN} strokeWidth={3} opacity={1 - seg(time, VALVE_DONE - 0.05, VALVE_DONE + 0.7)} />
                  {Array.from({ length: 10 }, (_, i) => {
                    const ang = (i / 10) * Math.PI * 2;
                    const r0 = lerp(12, 48, out(seg(time, VALVE_DONE - 0.05, VALVE_DONE + 0.6)));
                    return <circle key={i} cx={781 + Math.cos(ang) * r0} cy={637 + Math.sin(ang) * r0} r={2.4} fill={GREEN} opacity={1 - seg(time, VALVE_DONE, VALVE_DONE + 0.6)} />;
                  })}
                </>
              )}
              {valveFixed && <path d="M770 638 l8 9 l16 -18" fill="none" stroke={GREEN} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
            </g>
          </g>

          {/* Contorno fantasma de la carcasa sobre el escáner */}
          <rect x={440} y={60} width={400} height={600} rx={18} fill="none" stroke={CY} strokeWidth={1.5} opacity={scanY >= 690 ? 0.35 : 0.1} />

          {/* EXTERIOR (acero) */}
          <g clipPath="url(#hx-ext)">
            <rect x={440} y={60} width={400} height={600} rx={18} fill="url(#hx-steel)" />
            <rect x={440} y={60} width={400} height={600} rx={18} fill="none" stroke="#6d7888" strokeWidth={2} />
            {/* puertas */}
            <path d="M640 60V428" stroke="#5c6676" strokeWidth={3} />
            <path d="M440 428H840" stroke="#5c6676" strokeWidth={3} />
            <rect x={440} y={430} width={400} height={230} rx={0} fill="#000" opacity={0.04} />
            {/* dispenser */}
            <rect x={472} y={176} width={96} height={134} rx={10} fill="#1b2230" stroke="#4b5568" strokeWidth={2} />
            <rect x={482} y={188} width={76} height={34} rx={5} fill="#06222e" />
            <text x={520} y={212} textAnchor="middle" fill={CY} fontSize={19} fontWeight={700} fontFamily="monospace">38°F</text>
            <rect x={496} y={238} width={48} height={56} rx={6} fill="#0b0f18" />
            {/* asas */}
            <rect x={618} y={130} width={9} height={190} rx={4.5} fill="#5c6676" />
            <rect x={653} y={130} width={9} height={190} rx={4.5} fill="#5c6676" />
            <rect x={560} y={446} width={160} height={9} rx={4.5} fill="#5c6676" />
            {/* placa */}
            <rect x={612} y={72} width={56} height={12} rx={3} fill="#7b8696" opacity={0.7} />
            {/* barrido de luz */}
            <rect x={lerp(380, 900, seg(time, 0.2, 1.7))} y={60} width={90} height={600} fill="url(#hx-sweep)" opacity={0.5 * (1 - seg(time, 1.5, 1.7))} transform="skewX(-14)" />
          </g>

          {/* Línea de escáner */}
          {scanning && (
            <g>
              <rect x={380} y={scanY - 70} width={520} height={70} fill="url(#hx-scan)" opacity={time < 6 ? 0.9 : 0.6} />
              <rect x={380} y={scanY - 2} width={520} height={4} fill="#eaffff" filter="url(#hx-glow)" />
            </g>
          )}
        </g>

        {/* HUD (espacio pantalla) */}
        {activePart && activeScr && a > 0.01 && (
          <g opacity={a}>
            {/* retícula */}
            {[
              [-1, -1],
              [1, -1],
              [1, 1],
              [-1, 1],
            ].map(([sx, sy], i) => {
              const R = (activePart.id === "valve" ? 56 : 62) + 4 * Math.sin(time * 6);
              const px = activeScr.x + sx * R;
              const py = activeScr.y + sy * R;
              return <path key={i} d={`M${px} ${py - sy * 18} V${py} H${px - sx * 18}`} fill="none" stroke={status.color} strokeWidth={3} />;
            })}
            <circle cx={activeScr.x} cy={activeScr.y} r={4} fill={status.color} />
            {/* línea guía */}
            <path
              d={`M${activeScr.x} ${activeScr.y + 4} L${card.x + (portrait ? card.w / 2 : card.w)} ${card.y}`}
              stroke={status.color}
              strokeWidth={1.5}
              strokeDasharray="6 6"
              opacity={0.7}
              fill="none"
            />
          </g>
        )}

        {activePart && (
          <g opacity={out(seg(time, activePart.t0 + 0.25, activePart.t0 + 0.7)) * (1 - seg(time, (activePart.id === "valve" ? 12.2 : activePart.t1) - 0.2, activePart.id === "valve" ? 12.4 : activePart.t1))}>
            <rect x={card.x} y={card.y} width={card.w} height={card.h} rx={14} fill="#05101c" opacity={0.82} stroke={status.color} strokeWidth={1.5} />
            <text x={card.x + 24} y={card.y + 34} fill="#9fb4d0" fontSize={portrait ? 20 : 15} letterSpacing={3} fontFamily="monospace">
              {String(idx + 1).padStart(2, "0")} / {String(parts.length).padStart(2, "0")}
            </text>
            <rect x={card.x + card.w - (portrait ? 230 : 176)} y={card.y + 14} width={portrait ? 206 : 154} height={portrait ? 34 : 28} rx={14} fill={status.color} opacity={0.18} />
            <text x={card.x + card.w - (portrait ? 127 : 99)} y={card.y + (portrait ? 38 : 33)} textAnchor="middle" fill={status.color} fontSize={portrait ? 18 : 13} fontWeight={800} letterSpacing={1.5}>
              {status.label}
            </text>
            <text x={card.x + 24} y={card.y + (portrait ? 92 : 78)} fill="#fff" fontSize={portrait ? 40 : 30} fontWeight={800}>
              {typed(activePart.name, activePart.t0 + 0.3)}
            </text>
            <foreignObject x={card.x + 24} y={card.y + (portrait ? 108 : 92)} width={card.w - 48} height={card.h - (portrait ? 118 : 100)}>
              <p style={{ margin: 0, color: "#c6d4ea", fontSize: portrait ? 22 : 16, lineHeight: 1.35 }}>{note}</p>
            </foreignObject>
          </g>
        )}

        {/* Título de apertura */}
        <g opacity={introA}>
          <text x={W / 2} y={portrait ? H - 220 : H - 130} textAnchor="middle" fill="#fff" fontSize={portrait ? 44 : 44} fontWeight={800}>
            Ever wonder what&apos;s inside?
          </text>
        </g>
        <g opacity={scanA}>
          <text x={W / 2} y={portrait ? H - 220 : H - 130} textAnchor="middle" fill={CY} fontSize={portrait ? 30 : 24} fontWeight={700} letterSpacing={6} fontFamily="monospace">
            SCANNING…
          </text>
        </g>

        {/* Marca superior */}
        <g opacity={0.95}>
          <circle cx={36} cy={36} r={5} fill={Math.sin(time * 6) > 0 ? RED : "#5a1414"} />
          <text x={52} y={41} fill="#d6e2f5" fontSize={13} fontWeight={700} letterSpacing={3} fontFamily="monospace">
            ALLEGIANT · INTERNAL SCAN
          </text>
        </g>

        {/* Barra de progreso con marcas por pieza */}
        <g>
          <rect x={30} y={H - 38} width={W - 60} height={3} rx={1.5} fill="#ffffff" opacity={0.15} />
          <rect x={30} y={H - 38} width={(W - 60) * (time / DURATION)} height={3} rx={1.5} fill={ORANGE} />
          {parts.map((p) => (
            <rect key={p.id} x={30 + ((W - 60) * p.t0) / DURATION - 1} y={H - 42} width={2} height={11} fill="#fff" opacity={time >= p.t0 ? 0.8 : 0.25} />
          ))}
        </g>

        {/* Viñeta + líneas de escaneo */}
        <rect width={W} height={H} fill="url(#hx-bg)" opacity={0} />
        {Array.from({ length: Math.ceil(H / 6) }, (_, i) => (
          <rect key={i} x={0} y={i * 6} width={W} height={1} fill="#000" opacity={0.1} />
        ))}
      </svg>

      {/* Controles */}
      <div className="hx-controls absolute bottom-16 right-5 z-10 flex items-center gap-3 md:bottom-5">
        <span className="font-mono text-[12px] text-white/60" aria-hidden>
          {`00:${String(Math.floor(time)).padStart(2, "0")} / 00:15`}
        </span>
        <button
          type="button"
          onClick={() => (playing ? setPlaying(false) : time >= DURATION ? replay() : setPlaying(true))}
          className="rounded-full border border-white/30 px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white hover:border-[color:var(--al-orange)]"
          aria-label={playing ? "Pause animation" : time >= DURATION ? "Replay animation" : "Play animation"}
        >
          {playing ? "Pause" : time >= DURATION ? "Replay ↺" : "Play"}
        </button>
        <input
          type="range"
          min={0}
          max={DURATION}
          step={0.05}
          value={time}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value));
          }}
          className="hidden w-40 accent-[color:var(--al-orange)] md:block"
          aria-label="Animation timeline"
        />
      </div>

      {/* Tarjeta final */}
      <div
        className={`absolute z-10 ${portrait ? "inset-x-0 bottom-24 px-6 text-center" : "right-[6%] top-1/2 w-[38%] max-w-xl -translate-y-1/2"}`}
        style={{ opacity: reduced ? 1 : endA, transform: `translateY(${(1 - endA) * 24}px)`, pointerEvents: endA > 0.6 ? "auto" : "none" }}
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">{business.name}</p>
        <p className="mt-3 text-[34px] font-extrabold leading-[1.05] md:text-[56px]">{business.headline}</p>
        <p className="mt-4 text-[16px] text-white/75 md:text-[18px]">
          Whatever&apos;s inside, we fix it. Residential &amp; Commercial · Licensed &amp; Insured · {business.discount}.
        </p>
        <div className={`mt-6 flex flex-col gap-3 sm:flex-row ${portrait ? "justify-center" : ""}`}>
          <a href="#book" className="inline-flex items-center justify-center rounded-lg bg-[color:var(--al-orange)] px-7 py-4 text-[15px] font-bold uppercase tracking-wide text-white hover:bg-[color:var(--al-orange-dim)]">
            Book Service
          </a>
          <a href={business.phoneHref} className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-7 py-4 text-[15px] font-bold text-white hover:border-white">
            Call {business.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
