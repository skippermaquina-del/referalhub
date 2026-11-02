import type { Lang } from "@/data/allegiant";
import { diagramSpots, type ApplianceId } from "@/data/allegiant-tools";

const VB_W = 300;
const VB_H = 340;

/** Dibujo de línea de cada aparato (estilo plano técnico). */
function Drawing({ appliance }: { appliance: ApplianceId }) {
  switch (appliance) {
    case "fridge":
      return (
        <>
          <rect x="85" y="12" width="130" height="316" rx="10" />
          <line x1="85" y1="196" x2="215" y2="196" />
          <line x1="99" y1="40" x2="99" y2="150" strokeWidth="5" strokeLinecap="round" />
          <line x1="99" y1="214" x2="99" y2="256" strokeWidth="5" strokeLinecap="round" />
          <rect x="169" y="54" width="36" height="44" rx="4" strokeDasharray="4 3" />
          <rect x="97" y="294" width="106" height="22" rx="3" />
          {[107, 119, 131, 143, 155, 167, 179, 191].map((x) => (
            <line key={x} x1={x} y1="298" x2={x} y2="312" />
          ))}
        </>
      );
    case "dishwasher":
      return (
        <>
          <rect x="40" y="30" width="220" height="290" rx="10" />
          <rect x="52" y="42" width="196" height="26" rx="4" />
          {[76, 96, 116].map((x) => (
            <circle key={x} cx={x} cy="55" r="4" />
          ))}
          <rect x="52" y="80" width="196" height="226" rx="6" />
          <line x1="90" y1="135" x2="210" y2="135" strokeWidth="5" strokeLinecap="round" />
          {[104, 124, 144, 164, 184, 196].map((x) => (
            <circle key={x} cx={x} cy="135" r="1.8" />
          ))}
          <line x1="64" y1="236" x2="236" y2="236" />
          {[70, 86, 102, 118, 134, 150, 166, 182, 198, 214, 230].map((x) => (
            <line key={x} x1={x} y1="236" x2={x} y2="268" />
          ))}
          <ellipse cx="150" cy="290" rx="24" ry="8" />
        </>
      );
    case "washer":
      return (
        <>
          <rect x="50" y="24" width="200" height="292" rx="10" />
          <rect x="62" y="36" width="176" height="34" rx="5" />
          <circle cx="212" cy="53" r="9" />
          <circle cx="150" cy="190" r="76" />
          <circle cx="150" cy="190" r="58" fill="rgba(8,16,30,0.85)" />
          <path d="M120 190 q15 -22 30 0 t30 0" />
          <rect x="100" y="282" width="100" height="22" rx="3" />
          <rect x="60" y="316" width="24" height="8" rx="2" />
          <rect x="216" y="316" width="24" height="8" rx="2" />
        </>
      );
    case "dryer":
      return (
        <>
          <rect x="50" y="24" width="200" height="292" rx="10" />
          <rect x="62" y="36" width="176" height="34" rx="5" />
          <circle cx="212" cy="53" r="9" />
          <circle cx="150" cy="190" r="76" />
          <circle cx="150" cy="190" r="58" fill="rgba(8,16,30,0.85)" />
          {[0, 60, 120].map((deg) => (
            <line key={deg} x1="150" y1="150" x2="150" y2="230" transform={`rotate(${deg} 150 190)`} strokeDasharray="3 5" />
          ))}
          <rect x="250" y="48" width="38" height="18" rx="3" />
          <line x1="262" y1="48" x2="262" y2="66" />
          <line x1="276" y1="48" x2="276" y2="66" />
          <rect x="100" y="282" width="100" height="22" rx="3" />
        </>
      );
    case "oven":
      return (
        <>
          <rect x="40" y="24" width="220" height="296" rx="10" />
          {[82, 130, 170, 218].map((x) => (
            <ellipse key={x} cx={x} cy="52" rx="17" ry="7" />
          ))}
          {[70, 110, 150, 190, 230].map((x) => (
            <circle key={x} cx={x} cy="86" r="7" />
          ))}
          <rect x="56" y="106" width="188" height="200" rx="6" />
          <line x1="72" y1="120" x2="228" y2="120" strokeWidth="5" strokeLinecap="round" />
          <rect x="74" y="136" width="152" height="124" rx="4" fill="rgba(8,16,30,0.85)" />
          <path d="M88 236 h124" strokeDasharray="6 4" />
        </>
      );
  }
}

/**
 * Plano técnico animado: línea de barrido, y un punto que late sobre la pieza
 * donde mirar según el síntoma elegido.
 */
export function ApplianceDiagram({
  appliance,
  symptomId,
  lang,
  label,
  whereToLook,
}: {
  appliance: ApplianceId;
  symptomId: string;
  lang: Lang;
  label: string;
  whereToLook: string;
}) {
  const spot = diagramSpots[appliance][symptomId];
  const left = spot ? (spot.x / VB_W) * 100 : 0;
  const top = spot ? (spot.y / VB_H) * 100 : 0;

  return (
    <figure className="al-diagram" aria-label={label}>
      <div className="al-diagram-scan" aria-hidden="true" />
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={label}
        fill="rgba(28,47,88,0.35)"
        stroke="#6f8cc4"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <Drawing appliance={appliance} />
        {spot && (
          <g key={`${appliance}-${symptomId}`} className="al-diagram-spot" stroke="none">
            <circle className="al-diagram-ring" cx={spot.x} cy={spot.y} r="10" fill="rgba(242,111,33,0.45)" />
            <circle cx={spot.x} cy={spot.y} r="7" fill="#f26f21" />
            <circle cx={spot.x} cy={spot.y} r="2.6" fill="#fff" />
          </g>
        )}
      </svg>
      {spot && (
        <figcaption
          key={`cap-${appliance}-${symptomId}`}
          className="al-diagram-tag"
          style={{ left: `${Math.min(70, Math.max(30, left))}%`, top: `${Math.max(4, top - 15)}%` }}
        >
          <small>{whereToLook}</small>
          {spot.part[lang]}
        </figcaption>
      )}
    </figure>
  );
}
