/**
 * Máquina de movimiento perpetuo decorativa que recorre toda la página:
 * engranajes, una rueda de bolas, un péndulo de Newton y una canica en un
 * circuito sin fin. Es solo SVG + CSS (sin JS), no recibe clics y se detiene
 * con "reducir movimiento".
 */

/** Contorno de un engranaje con `teeth` dientes. */
function gear(teeth: number, outer: number, inner: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const k = [
      [a, inner],
      [a + step * 0.18, outer],
      [a + step * 0.5, outer],
      [a + step * 0.68, inner],
    ];
    for (const [ang, r] of k) pts.push(`${(Math.cos(ang) * r).toFixed(1)},${(Math.sin(ang) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

const G14 = gear(14, 92, 76);
const G10 = gear(10, 64, 51);
const G7 = gear(7, 44, 34);
const G18 = gear(18, 270, 246);

function Gear({ d, x, y, spokes, dur, rev, delay = 0 }: { d: string; x: number; y: number; spokes: number; dur: number; rev?: boolean; delay?: number }) {
  const r = 20;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="al-k-spin" style={{ animationDuration: `${dur}s`, animationDirection: rev ? "reverse" : "normal", animationDelay: `${delay}s` }}>
        <path d={d} />
        <circle r={r} />
        {Array.from({ length: spokes }, (_, i) => (
          <line key={i} x1="0" y1="0" x2="0" y2={-r - 22} transform={`rotate(${(360 / spokes) * i})`} />
        ))}
      </g>
    </g>
  );
}

function Wheel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="al-k-spin" style={{ animationDuration: "46s" }}>
        <circle r="190" />
        <circle r="168" />
        <circle r="30" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="30" y1="0" x2="168" y2="0" transform={`rotate(${30 * i})`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 8;
          return (
            <g key={i}>
              <circle cx={Math.cos(a) * 120} cy={Math.sin(a) * 120} r="26" />
              <circle className="al-k-ball" cx={Math.cos(a) * 120} cy={Math.sin(a) * 120} r="14" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Cradle({ x, y }: { x: number; y: number }) {
  const balls = [-2, -1, 0, 1, 2];
  const len = 120;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="-90" y1="0" x2="90" y2="0" strokeWidth="5" />
      <line x1="-90" y1="0" x2="-110" y2={len + 60} />
      <line x1="90" y1="0" x2="110" y2={len + 60} />
      {balls.map((b) => {
        const cls = b === -2 ? "al-k-swing-l" : b === 2 ? "al-k-swing-r" : "";
        return (
          <g key={b} className={cls} style={{ transformOrigin: `${b * 36}px 0px` }}>
            <line x1={b * 36} y1="0" x2={b * 36} y2={len} />
            <circle className="al-k-ball" cx={b * 36} cy={len + 18} r="18" />
          </g>
        );
      })}
    </g>
  );
}

const LOOP = "M300 620 C300 520 520 520 600 620 C680 720 900 720 900 620 C900 520 680 520 600 620 C520 720 300 720 300 620 Z";

function Section({ flip }: { flip?: boolean }) {
  return (
    <svg
      className="al-k-sec"
      viewBox="0 0 1200 900"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <Gear d={G14} x={200} y={200} spokes={5} dur={24} />
      <Gear d={G10} x={320} y={290} spokes={4} dur={17.1} rev />
      <Gear d={G7} x={400} y={350} spokes={3} dur={12} delay={-2} />
      <Wheel x={930} y={290} />
      <path d={LOOP} strokeWidth="14" opacity="0.35" />
      <path d={LOOP} />
      <circle className="al-k-ball al-k-glow" r="17">
        <animateMotion dur="9s" repeatCount="indefinite" path={LOOP} />
      </circle>
      <circle className="al-k-ball al-k-glow" r="12">
        <animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite" path={LOOP} />
      </circle>
      <Cradle x={1010} y={640} />
      <Gear d={G14} x={140} y={720} spokes={6} dur={30} rev />
    </svg>
  );
}

export function KineticBackdrop({ sections = 3 }: { sections?: number }) {
  return (
    <>
      <div className="al-k" aria-hidden="true">
        {Array.from({ length: sections }, (_, i) => (
          <Section key={i} flip={i % 2 === 1} />
        ))}
      </div>
      {/* Capa por delante del texto: engranaje enorme y casi transparente que da profundidad. */}
      <div className="al-k-front" aria-hidden="true">
        <svg viewBox="-280 -280 560 560" fill="none" stroke="currentColor" strokeWidth="3">
          <g className="al-k-spin" style={{ animationDuration: "90s" }}>
            <path d={G18} />
            <circle r="60" />
            {Array.from({ length: 6 }, (_, i) => (
              <line key={i} x1="0" y1="0" x2="0" y2="-246" transform={`rotate(${60 * i})`} />
            ))}
          </g>
        </svg>
      </div>
    </>
  );
}
