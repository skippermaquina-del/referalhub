import Image from "next/image";
import type { Palette } from "@/data/yana";

/**
 * Lienzo de marcador de posición.
 *
 * Mientras no haya fotos reales de la obra, dibuja una composición abstracta
 * determinista a partir de `seed` + `palette`: la misma semilla da siempre el
 * mismo cuadro, así que no hay parpadeo entre servidor y cliente. En cuanto una
 * obra tenga `image`, se renderiza la foto y este generativo deja de usarse.
 */

type Subject = {
  slug: string;
  title: string;
  seed: number;
  palette: Palette;
  image?: string;
};

type Props = {
  subject: Subject;
  className?: string;
  /** Pasa `true` sólo en la obra visible al cargar (la de portada). */
  priority?: boolean;
  sizes?: string;
};

/** PRNG determinista (mulberry32): mismo `seed`, misma secuencia. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 1000;

export function Artwork({ subject, className, priority, sizes }: Props) {
  const { slug, title, seed, palette, image } = subject;

  if (image) {
    return (
      <Image
        src={image}
        alt={title}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={className}
        style={{ objectFit: "cover" }}
      />
    );
  }

  const random = rng(seed);
  const pick = (min: number, max: number) => min + random() * (max - min);
  const uid = `art-${slug}`;
  const [deep, mid, light, pale] = palette.layers;

  // Tres decisiones de composición fijan el cuadro: dónde corta el horizonte
  // y de dónde entra la luz. Todo lo demás se cuelga de ahí.
  const horizon = pick(0.44, 0.6) * SIZE;
  const lightX = pick(0.18, 0.82) * SIZE;
  const lightY = pick(0.12, 0.42) * SIZE;

  // Manchas de color: el fondo atmosférico.
  const blobs = [mid, light, mid, pale, light].map((color, i) => ({
    id: `${uid}-b${i}`,
    color,
    cx: pick(-0.1, 1.1) * SIZE,
    cy: pick(-0.05, 1.05) * SIZE,
    rx: pick(0.3, 0.68) * SIZE,
    ry: pick(0.22, 0.5) * SIZE,
    rotate: pick(-40, 40),
    opacity: pick(0.25, 0.5),
  }));

  // Pasadas de espátula: elipses muy aplanadas que se agolpan en el horizonte.
  // Al ir afiladas en las puntas se leen como pincelada y no como barra.
  const knives = Array.from({ length: 14 }, (_, i) => {
    // Se agolpan alrededor del horizonte y se dispersan al alejarse.
    const spread = pick(-1, 1);
    return {
      key: `${uid}-k${i}`,
      cx: pick(0, 1) * SIZE,
      cy: horizon + spread * Math.abs(spread) * 0.42 * SIZE,
      rx: pick(0.08, 0.42) * SIZE,
      ry: pick(1.5, 13),
      rotate: pick(-2.5, 2.5),
      color: [deep, mid, light, pale][Math.floor(pick(0, 3.999))],
      opacity: pick(0.06, 0.3),
    };
  });

  // Trazos finos: el gesto que cruza el cuadro de lado a lado.
  const strokes = Array.from({ length: 4 }, () => {
    const x1 = pick(-0.15, 0.4) * SIZE;
    const y1 = pick(0, 1) * SIZE;
    const x2 = x1 + pick(0.5, 1.15) * SIZE;
    const y2 = y1 + pick(-0.25, 0.25) * SIZE;
    return {
      d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${((x1 + x2) / 2).toFixed(1)} ${(
        (y1 + y2) / 2 +
        pick(-0.2, 0.2) * SIZE
      ).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      width: pick(1, 5),
      opacity: pick(0.08, 0.26),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${title} — imagen de marcador de posición`}
    >
      <defs>
        <linearGradient id={`${uid}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.base} />
          <stop
            offset={`${((horizon / SIZE) * 100).toFixed(1)}%`}
            stopColor={deep}
          />
          <stop offset="100%" stopColor={palette.base} />
        </linearGradient>

        {/* La fuente de luz. Es lo que da profundidad al conjunto. */}
        <radialGradient id={`${uid}-glow`}>
          <stop offset="0%" stopColor={pale} stopOpacity="0.62" />
          <stop offset="40%" stopColor={light} stopOpacity="0.3" />
          <stop offset="100%" stopColor={light} stopOpacity="0" />
        </radialGradient>

        {blobs.map((blob) => (
          <radialGradient key={blob.id} id={blob.id}>
            <stop offset="0%" stopColor={blob.color} stopOpacity={blob.opacity} />
            <stop offset="55%" stopColor={blob.color} stopOpacity={blob.opacity * 0.4} />
            <stop offset="100%" stopColor={blob.color} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* Banda de horizonte, difuminada en los extremos. */}
        <linearGradient id={`${uid}-horizon`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={pale} stopOpacity="0" />
          <stop offset="35%" stopColor={pale} stopOpacity="0.45" />
          <stop offset="70%" stopColor={pale} stopOpacity="0.12" />
          <stop offset="100%" stopColor={pale} stopOpacity="0" />
        </linearGradient>

        <radialGradient id={`${uid}-vignette`}>
          <stop offset="52%" stopColor={palette.base} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.base} stopOpacity="0.55" />
        </radialGradient>

        <filter id={`${uid}-soft`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <filter id={`${uid}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            seed={seed % 1000}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <rect width={SIZE} height={SIZE} fill={`url(#${uid}-ground)`} />

      {blobs.map((blob) => (
        <ellipse
          key={blob.id}
          cx={blob.cx.toFixed(1)}
          cy={blob.cy.toFixed(1)}
          rx={blob.rx.toFixed(1)}
          ry={blob.ry.toFixed(1)}
          fill={`url(#${blob.id})`}
          transform={`rotate(${blob.rotate.toFixed(1)} ${blob.cx.toFixed(1)} ${blob.cy.toFixed(1)})`}
        />
      ))}

      <ellipse
        cx={lightX.toFixed(1)}
        cy={lightY.toFixed(1)}
        rx={(SIZE * 0.55).toFixed(1)}
        ry={(SIZE * 0.42).toFixed(1)}
        fill={`url(#${uid}-glow)`}
      />

      <g filter={`url(#${uid}-soft)`}>
        {knives.map((knife) => (
          <ellipse
            key={knife.key}
            cx={knife.cx.toFixed(1)}
            cy={knife.cy.toFixed(1)}
            rx={knife.rx.toFixed(1)}
            ry={knife.ry.toFixed(1)}
            fill={knife.color}
            opacity={knife.opacity.toFixed(3)}
            transform={`rotate(${knife.rotate.toFixed(2)} ${knife.cx.toFixed(1)} ${knife.cy.toFixed(1)})`}
          />
        ))}

        <rect
          x="0"
          y={(horizon - 1.5).toFixed(1)}
          width={SIZE}
          height="3"
          fill={`url(#${uid}-horizon)`}
        />
      </g>

      <g fill="none" stroke={palette.stroke} strokeLinecap="round">
        {strokes.map((stroke, i) => (
          <path
            key={`${uid}-s${i}`}
            d={stroke.d}
            strokeWidth={stroke.width.toFixed(1)}
            strokeOpacity={stroke.opacity.toFixed(3)}
          />
        ))}
      </g>

      <rect width={SIZE} height={SIZE} fill={`url(#${uid}-vignette)`} />

      {/* Grano: le quita el acabado "digital" a los degradados. */}
      <rect
        width={SIZE}
        height={SIZE}
        filter={`url(#${uid}-grain)`}
        opacity="0.2"
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}
