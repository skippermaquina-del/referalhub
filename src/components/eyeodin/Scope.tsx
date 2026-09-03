import { OdinEye } from "./OdinEye";

/**
 * Imagen de portada: la pantalla de sonar a tamaño completo, con el isotipo
 * en el centro. Los blips están en coordenadas fijas — no son datos, son
 * decoración — y su parpadeo va escalonado desde CSS para que la pantalla
 * parezca viva sin pedir JavaScript.
 */
export function Scope({ className }: { className?: string }) {
  const rings = [188, 148, 108, 68];
  const blips = [
    { cx: 268, cy: 132, delay: 0 },
    { cx: 132, cy: 246, delay: 1.1 },
    { cx: 292, cy: 262, delay: 2.3 },
    { cx: 116, cy: 158, delay: 3.1 },
  ];

  return (
    <div className={`eo-scope ${className ?? ""}`}>
      <svg viewBox="0 0 400 400" className="eo-scope-grid" aria-hidden fill="none">
        <defs>
          <linearGradient id="eo-scope-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--eo-sonar)" stopOpacity="0.42" />
            <stop offset="100%" stopColor="var(--eo-sonar)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="eo-scope-glow">
            <stop offset="0%" stopColor="var(--eo-sonar)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--eo-sonar)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="196" fill="url(#eo-scope-glow)" />

        {rings.map((r) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            stroke="var(--eo-sonar)"
            strokeOpacity={r === 188 ? 0.28 : 0.14}
            strokeWidth="1"
          />
        ))}

        {/* Retícula: los cuatro rumbos. */}
        <path
          d="M200 12V388M12 200H388"
          stroke="var(--eo-sonar)"
          strokeOpacity="0.1"
          strokeWidth="1"
        />

        <path
          d="M200 200L200 12A188 188 0 0 1 333 67Z"
          fill="url(#eo-scope-sweep)"
          className="eo-sweep"
        />

        {blips.map((b) => (
          <g key={`${b.cx}-${b.cy}`} className="eo-blip" style={{ animationDelay: `${b.delay}s` }}>
            <circle cx={b.cx} cy={b.cy} r="9" fill="var(--eo-sonar)" fillOpacity="0.14" />
            <circle cx={b.cx} cy={b.cy} r="3" fill="var(--eo-sonar)" />
          </g>
        ))}
      </svg>

      <OdinEye id="scope" className="eo-scope-eye" />
    </div>
  );
}
