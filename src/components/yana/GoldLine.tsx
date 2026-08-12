type Props = { className?: string };

/**
 * El trazo dorado en movimiento, eco del pincelazo del isotipo real
 * (public/yana/logo.jpg). Se desliza en bucle continuo; la animación se
 * define en yana.css y se apaga con prefers-reduced-motion.
 */
export function GoldLine({ className }: Props) {
  return (
    <svg
      viewBox="0 0 240 16"
      className={`yana-goldline ${className ?? ""}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="yana-goldline-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="35%" stopColor="var(--yana-accent)" />
          <stop offset="50%" stopColor="#f4e0ad" />
          <stop offset="65%" stopColor="var(--yana-accent)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M2 8c20-6 40 6 60 0s40-6 60 0 40 6 60 0 40-6 56 0"
        fill="none"
        stroke="url(#yana-goldline-gradient)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
