"use client";

import { useState } from "react";
import type { Lang } from "@/data/allegiant";
import { toolsCopy } from "@/data/allegiant-tools";

/** Serpentín vertical en zigzag entre (x, y1) y (x, y2). */
function coil(x: number, y1: number, y2: number, turns: number, w: number) {
  const h = (y2 - y1) / turns;
  let d = `M${x} ${y1}`;
  for (let i = 0; i < turns; i++) {
    const y = y1 + i * h;
    const dir = i % 2 === 0 ? 1 : -1;
    d += `C${x + dir * w} ${y + h * 0.1} ${x + dir * w} ${y + h * 0.9} ${x} ${y + h}`;
  }
  return d;
}

const COND = coil(630, 380, 120, 7, 44); // sube por la derecha
const EVAP = coil(170, 120, 380, 7, 44); // baja por la izquierda

/** Lado caliente: sale del compresor, sube por el condensador y llega a la válvula. */
const HOT = `M470 440 H630 V380 ${COND.slice(COND.indexOf("C"))} V90 H440`;
/** Lado frío: sale de la válvula, baja por el evaporador y vuelve al compresor. */
const COLD = `M360 90 H170 V120 ${EVAP.slice(EVAP.indexOf("C"))} V440 H330`;

const BLOBS = Array.from({ length: 26 }, (_, i) => ({
  x: 586 + ((i * 37) % 88),
  y: 126 + ((i * 53) % 250),
  r: 7 + ((i * 11) % 9),
}));

/**
 * Ciclo de refrigeración animado: el refrigerante recorre el circuito y se ve
 * por qué las bobinas sucias lo complican. Es una explicación cualitativa.
 */
export function RefrigerationCycle({ lang }: { lang: Lang }) {
  const t = toolsCopy[lang].cycle;
  const [dirty, setDirty] = useState(false);
  const speed = dirty ? 11 : 6;

  return (
    <div className="al-cycle" data-dirty={dirty ? "" : undefined}>
      <div className="al-cycle-head">
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h2 className="al-h2">{t.title}</h2>
        <p>{t.intro}</p>
      </div>

      <figure className="al-cycle-fig">
        <svg viewBox="0 0 800 520" role="img" aria-label={t.alt}>
          <defs>
            <linearGradient id="al-cy-hot" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#ff7a2f" />
              <stop offset="1" stopColor="#ff3d2e" />
            </linearGradient>
            <linearGradient id="al-cy-cold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6fd3ff" />
              <stop offset="1" stopColor="#2f7dff" />
            </linearGradient>
          </defs>

          {/* Interior frío (izquierda) y cocina (derecha) */}
          <rect x="60" y="60" width="220" height="380" rx="18" className="al-cy-room-cold" />
          <rect x="520" y="60" width="220" height="380" rx="18" className="al-cy-room-hot" />
          <text x="170" y="480" className="al-cy-tag al-cy-tag-cold">{t.coldLabel}</text>
          <text x="630" y="480" className="al-cy-tag al-cy-tag-hot">{t.hotLabel}</text>

          {/* Tubería */}
          <path d={HOT} className="al-cy-pipe al-cy-pipe-hot" />
          <path d={COLD} className="al-cy-pipe al-cy-pipe-cold" />
          <path d={HOT} className="al-cy-flow al-cy-flow-hot" style={{ animationDuration: `${speed / 3}s` }} />
          <path d={COLD} className="al-cy-flow al-cy-flow-cold" style={{ animationDuration: `${speed / 3}s` }} />

          {/* Polvo sobre el condensador */}
          <g className="al-cy-dust">
            {BLOBS.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r={b.r} />
            ))}
          </g>

          {/* Partículas de refrigerante */}
          {[0, 1, 2, 3].map((i) => (
            <circle key={`h${i}-${dirty}`} r="7" className="al-cy-dot al-cy-dot-hot">
              <animateMotion dur={`${speed}s`} begin={`${-(speed / 4) * i}s`} repeatCount="indefinite" path={HOT} />
            </circle>
          ))}
          {[0, 1, 2, 3].map((i) => (
            <circle key={`c${i}-${dirty}`} r="7" className="al-cy-dot al-cy-dot-cold">
              <animateMotion dur={`${speed}s`} begin={`${-(speed / 4) * i}s`} repeatCount="indefinite" path={COLD} />
            </circle>
          ))}

          {/* Compresor */}
          <g transform="translate(400 440)">
            <rect x="-70" y="-38" width="140" height="76" rx="38" className="al-cy-comp" />
            <g className="al-cy-comp-core">
              <circle r="20" />
              <line x1="-20" y1="0" x2="20" y2="0" />
              <line x1="0" y1="-20" x2="0" y2="20" />
            </g>
          </g>
          <text x="400" y="506" className="al-cy-label">{t.parts.compressor}</text>

          {/* Válvula de expansión */}
          <g transform="translate(400 90)">
            <path d="M-36 -22 L0 0 L-36 22 Z M36 -22 L0 0 L36 22 Z" className="al-cy-valve" />
            <line x1="0" y1="0" x2="0" y2="-34" className="al-cy-valve-stem" />
            <circle cy="-40" r="7" className="al-cy-valve-knob" />
          </g>
          <text x="400" y="42" className="al-cy-label">{t.parts.valve}</text>

          {/* Etiquetas de componentes */}
          <text x="630" y="42" className="al-cy-label">{t.parts.condenser}</text>
          <text x="170" y="42" className="al-cy-label">{t.parts.evaporator}</text>

          {/* Calor que sale (derecha) y entra (izquierda) */}
          <g className="al-cy-heat">
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M700 ${190 + i * 70} h34 m-10 -9 l10 9 l-10 9`} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>
          <text x="690" y="425" className="al-cy-mini al-cy-mini-hot">{t.heatOut}</text>
          <g className="al-cy-cool">
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M72 ${190 + i * 70} h34 m-10 -9 l10 9 l-10 9`} style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>
          <text x="110" y="425" className="al-cy-mini al-cy-mini-cold">{t.coldIn}</text>
        </svg>
        <figcaption>{dirty ? t.dirtyNote : t.cleanNote}</figcaption>
      </figure>

      <button type="button" className="al-btn-line al-cycle-btn" onClick={() => setDirty((d) => !d)} aria-pressed={dirty}>
        {dirty ? t.cleanBtn : t.dirtyBtn}
      </button>

      <ol className="al-cycle-steps">
        {t.steps.map((s, i) => (
          <li key={s.name}>
            <span>{i + 1}</span>
            <div>
              <strong>{s.name}</strong>
              <p>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
