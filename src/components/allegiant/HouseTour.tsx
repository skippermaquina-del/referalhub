"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Recorrido 2.5D por la casa, controlado por scroll.
 * La cámara viaja por 6 electrodomésticos; en la heladera una "lente de
 * rayos X" revela la válvula dañada y luego la muestra reparada.
 */

const stations = [
  { key: "fridge", x: 300, name: "Refrigerator", line: "Not cooling, leaking or icing up?" },
  { key: "ice", x: 800, name: "Ice maker", line: "No ice, or ice that tastes off?" },
  { key: "micro", x: 1300, name: "Microwave", line: "Dead, sparking or not heating?" },
  { key: "dish", x: 1800, name: "Dishwasher", line: "Leaking, not draining or not cleaning?" },
  { key: "washer", x: 2350, name: "Washer", line: "Won't drain, spin or start?" },
  { key: "dryer", x: 2800, name: "Dryer", line: "Taking forever, or not heating?" },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};

const ORANGE = "#f26b21";
const NAVY = "#1b2f57";

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

export function HouseTour() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - (window.innerHeight - 64);
      setP(clamp(-r.top / Math.max(span, 1)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (reduced) {
    return (
      <section className="bg-[color:var(--al-black)] px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[32px] font-extrabold">If it&apos;s in your home, we repair it.</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stations.map((s) => (
              <li key={s.key} className="rounded-xl border border-white/20 p-5">
                <h3 className="text-[20px] font-bold">{s.name}</h3>
                <p className="text-white/70">{s.line}</p>
                <p className="mt-2 text-[13px] font-bold uppercase tracking-widest text-[color:var(--al-orange)]">We repair it ✓</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  // Posición de la cámara a lo largo de las estaciones.
  const n = stations.length;
  const t = p * (n - 1);
  const i = Math.min(Math.floor(t), n - 2);
  const f = t - i;
  // En la heladera la cámara se queda más tiempo (rayos X).
  const eased = i === 0 ? smooth((f - 0.8) / 0.2) : smooth((f - 0.25) / 0.5);
  const camX = stations[i].x + (stations[i + 1].x - stations[i].x) * eased;
  const active = p >= 1 ? n - 1 : eased > 0.5 ? i + 1 : i;

  // Rayos X solo en la primera estación.
  const xr = t < 1 ? smooth(t / 0.35) * (1 - smooth((t - 0.75) / 0.25)) : 0;
  const repaired = t > 0.6 && t < 1.2;
  const showXray = active === 0;
  const scale = 1.25 + 0.55 * xr;
  const lensR = 10 + xr * 190;

  let caption = stations[active].line;
  let tag = "We repair it ✓";
  if (active === 0 && xr > 0.35) {
    if (repaired) {
      caption = "Valve replaced. Cold again.";
    } else {
      caption = "X-ray: a worn water inlet valve is leaking.";
      tag = "Common cause";
    }
  }

  return (
    <div ref={ref} className="relative h-[560vh] bg-[color:var(--al-black)]" aria-label="Scroll tour of appliances Allegiant repairs">
      <div className="sticky top-16 h-[calc(100svh-4rem)] overflow-hidden">
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Illustrated house with a refrigerator, ice maker, microwave, dishwasher, washer and dryer"
        >
          <defs>
            <clipPath id="lens">
              <circle cx={stations[0].x + 20} cy={470} r={lensR} />
            </clipPath>
          </defs>
          <g transform={`translate(600 330) scale(${scale}) translate(${-camX} -400)`}>
            {/* Paredes y piso */}
            <rect x={-400} y={-100} width={2150} height={620} fill="#111a30" />
            <rect x={1750} y={-100} width={1700} height={620} fill="#14233f" />
            <rect x={-400} y={520} width={3800} height={400} fill="#0b1120" />
            <rect x={-400} y={516} width={3800} height={4} fill={ORANGE} opacity={0.7} />
            {/* Ventana */}
            <rect x={1000} y={120} width={180} height={150} rx={6} fill="#1b2f57" stroke="#2c4577" strokeWidth={4} />
            <path d="M1090 120v150M1000 195h180" stroke="#2c4577" strokeWidth={3} />
            {/* Mesón de cocina */}
            <rect x={640} y={440} width={1310} height={80} fill={NAVY} />
            <rect x={640} y={432} width={1310} height={10} fill="#2c4577" />
            {/* Separación lavandería */}
            <rect x={1950} y={-100} width={6} height={620} fill="#0b1120" />

            {stations.map((s, idx) => {
              const on = active === idx;
              const stroke = on ? ORANGE : "#3a4f7d";
              const sw = on ? 4 : 2.5;
              const x = s.x;
              switch (s.key) {
                case "fridge":
                  return (
                    <g key={s.key}>
                      {/* cuerpo */}
                      <rect x={x - 90} y={190} width={180} height={330} rx={10} fill="#c9d3e3" stroke={stroke} strokeWidth={sw} opacity={showXray ? 1 - xr * 0.85 : 1} />
                      <path d={`M${x - 90} 330h180`} stroke="#8d9bb5" strokeWidth={3} opacity={1 - xr * 0.85} />
                      <rect x={x + 62} y={225} width={8} height={70} rx={4} fill="#7b8aa6" opacity={1 - xr * 0.85} />
                      <rect x={x + 62} y={355} width={8} height={90} rx={4} fill="#7b8aa6" opacity={1 - xr * 0.85} />
                      {/* lente de rayos X */}
                      <g clipPath="url(#lens)">
                        <rect x={x - 90} y={190} width={180} height={330} rx={10} fill="#06222e" />
                        {[250, 310, 370, 430].map((y) => (
                          <path key={y} d={`M${x - 80} ${y}h160`} stroke="#1e5a73" strokeWidth={3} />
                        ))}
                        {[-60, -25, 15, 50].map((dx, k) => (
                          <rect key={dx} x={x + dx - 8} y={k % 2 ? 330 : 270} width={16} height={k % 2 ? 40 : 50} rx={4} fill="#14465c" />
                        ))}
                        {/* compresor */}
                        <rect x={x - 70} y={462} width={56} height={44} rx={8} fill="#14465c" stroke="#2f86a8" strokeWidth={2} />
                        {/* tubería al válvula */}
                        <path d={`M${x - 14} 484 C${x + 10} 484 ${x + 8} 470 ${x + 30} 470`} fill="none" stroke="#2f86a8" strokeWidth={4} />
                        {/* válvula */}
                        <rect x={x + 30} y={458} width={34} height={26} rx={6} fill={repaired ? "#1f7a4d" : "#7a1f1f"} stroke={repaired ? "#3ddc97" : "#ff4d4d"} strokeWidth={3} />
                        {!repaired && (
                          <>
                            <circle cx={x + 47} cy={471} r={26} fill="none" stroke="#ff4d4d" strokeWidth={2} opacity={0.8}>
                              <animate attributeName="r" values="22;34;22" dur="1.2s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.9;0;0.9" dur="1.2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx={x + 40} cy={496} r={3} fill="#5ec8ff">
                              <animate attributeName="cy" values="490;512;490" dur="1.1s" repeatCount="indefinite" />
                            </circle>
                          </>
                        )}
                        {repaired && <path d={`M${x + 38} 471l7 7 12-14`} fill="none" stroke="#3ddc97" strokeWidth={4} strokeLinecap="round" />}
                      </g>
                      {xr > 0.02 && (
                        <circle cx={x + 20} cy={470} r={lensR} fill="none" stroke={ORANGE} strokeWidth={3} strokeDasharray="10 8" />
                      )}
                    </g>
                  );
                case "ice":
                  return (
                    <g key={s.key}>
                      <rect x={x - 60} y={400} width={120} height={120} rx={8} fill="#c9d3e3" stroke={stroke} strokeWidth={sw} />
                      <rect x={x - 46} y={414} width={92} height={50} rx={6} fill="#9fd8f0" opacity={0.85} />
                      {[-30, -8, 14, 30].map((dx) => (
                        <rect key={dx} x={x + dx - 8} y={430} width={14} height={14} rx={3} fill="#e8f7ff" />
                      ))}
                      <rect x={x - 46} y={478} width={92} height={10} rx={5} fill="#7b8aa6" />
                    </g>
                  );
                case "micro":
                  return (
                    <g key={s.key}>
                      <rect x={x - 90} y={332} width={180} height={100} rx={8} fill="#2a2f3a" stroke={stroke} strokeWidth={sw} />
                      <rect x={x - 76} y={344} width={110} height={76} rx={6} fill="#0b1120" stroke="#4b5568" strokeWidth={2} />
                      <rect x={x + 46} y={346} width={32} height={22} rx={3} fill="#1b2f57" />
                      {[0, 1, 2].map((k) => (
                        <circle key={k} cx={x + 52 + k * 10} cy={388} r={3.5} fill={ORANGE} />
                      ))}
                    </g>
                  );
                case "dish":
                  return (
                    <g key={s.key}>
                      <rect x={x - 80} y={390} width={160} height={130} rx={8} fill="#c9d3e3" stroke={stroke} strokeWidth={sw} />
                      <rect x={x - 80} y={390} width={160} height={24} rx={8} fill="#2a2f3a" />
                      <rect x={x - 50} y={426} width={100} height={8} rx={4} fill="#7b8aa6" />
                      <circle cx={x + 60} cy={402} r={4} fill={ORANGE} />
                    </g>
                  );
                case "washer":
                case "dryer":
                  return (
                    <g key={s.key}>
                      <rect x={x - 80} y={340} width={160} height={180} rx={10} fill="#c9d3e3" stroke={stroke} strokeWidth={sw} />
                      <rect x={x - 80} y={340} width={160} height={30} rx={10} fill="#2a2f3a" />
                      <circle cx={x - 40} cy={355} r={6} fill={ORANGE} />
                      <circle cx={x} cy={445} r={52} fill="#0b1120" stroke="#7b8aa6" strokeWidth={6} />
                      <circle cx={x} cy={445} r={36} fill={s.key === "washer" ? "#1e5a73" : "#3a2a1a"} opacity={0.9} />
                    </g>
                  );
              }
            })}
          </g>
        </svg>

        {/* Texto superpuesto */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 to-transparent px-5 pb-10 pt-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">
              Walk through the house
            </p>
            <h2 className="mt-2 max-w-xl text-[28px] font-extrabold leading-tight text-white md:text-[44px]">
              If it&apos;s in your home, we repair it.
            </h2>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-5 pb-20 pt-16 md:pb-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[14px] font-bold uppercase tracking-widest text-white/60">{stations[active].name}</p>
              <p className="mt-1 text-[24px] font-extrabold leading-tight text-white md:text-[34px]">{caption}</p>
              <p className="mt-2 inline-block rounded-full bg-[color:var(--al-orange)] px-4 py-1.5 text-[13px] font-bold uppercase tracking-wide text-white">{tag}</p>
            </div>
            <div className="pointer-events-auto flex items-center gap-4">
              <ol className="hidden gap-2 md:flex" aria-hidden>
                {stations.map((s, k) => (
                  <li key={s.key} className={`h-2 w-8 rounded-full ${k === active ? "bg-[color:var(--al-orange)]" : "bg-white/25"}`} />
                ))}
              </ol>
              <a href="#book" className="rounded-lg bg-white px-5 py-3 text-[14px] font-bold uppercase tracking-wide text-[color:var(--al-navy)]">
                Book this repair
              </a>
            </div>
          </div>
          {p < 0.03 && (
            <p className="mt-4 text-center text-[13px] font-semibold text-white/60">Scroll to walk through ↓</p>
          )}
        </div>
      </div>
    </div>
  );
}
