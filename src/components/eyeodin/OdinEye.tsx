/**
 * Isotipo: el ojo de Odín leído como un sonar. El párpado es la almendra
 * clásica del ojo; el iris son los anillos concéntricos de una pantalla de
 * radar, con un barrido que gira. Sin estado ni hooks, para que pueda
 * renderizarse en el servidor; el `id` lo pasa quien lo usa porque el mismo
 * mark aparece varias veces en la página y los `clipPath` no pueden chocar.
 */
export function OdinEye({
  id,
  className,
  title,
}: {
  id: string;
  className?: string;
  title?: string;
}) {
  const clip = `${id}-iris`;
  const fade = `${id}-sweep`;

  return (
    <svg
      viewBox="0 0 64 40"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="32" cy="20" r="10.6" />
        </clipPath>
        <linearGradient id={fade} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--eo-sonar)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--eo-sonar)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Párpado. Dos arcos simétricos que se cierran en los lagrimales. */}
      <path
        d="M1.6 20C13 5.4 51 5.4 62.4 20C51 34.6 13 34.6 1.6 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <g clipPath={`url(#${clip})`}>
        {/* Anillos del iris: la escala de distancia del sonar. */}
        <circle cx="32" cy="20" r="10.6" fill="var(--eo-abyss)" />
        <circle cx="32" cy="20" r="8.4" stroke="var(--eo-sonar)" strokeOpacity="0.3" strokeWidth="0.7" />
        <circle cx="32" cy="20" r="5.6" stroke="var(--eo-sonar)" strokeOpacity="0.38" strokeWidth="0.7" />
        {/* Barrido. Gira sobre el centro del iris. */}
        <path d="M32 20L32 8.4A11.6 11.6 0 0 1 42.4 15Z" fill={`url(#${fade})`} className="eo-sweep" />
      </g>

      {/* Pupila y su reflejo, ya sin recortar, para que pisen los anillos. */}
      <circle cx="32" cy="20" r="3.5" fill="currentColor" />
      <circle cx="30.4" cy="18.4" r="1.05" fill="var(--eo-foam)" fillOpacity="0.85" />
      <circle cx="32" cy="20" r="10.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
