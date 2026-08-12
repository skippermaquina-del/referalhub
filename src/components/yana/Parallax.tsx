"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Cuánto se retrasa la capa respecto al scroll. 0.1–0.3 da un parallax sutil. */
  strength?: number;
  className?: string;
};

/**
 * Desplaza su contenido más lento que el scroll de la página — el parallax
 * clásico de fondo. El contenedor debe ser más grande que el área visible
 * (ver usos: alto 120–130% y offset negativo) para que el desplazamiento no
 * deje huecos. Se apaga con prefers-reduced-motion.
 */
export function Parallax({ children, strength = 0.25, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        node.style.transform = `translate3d(0, ${(rect.top * strength).toFixed(1)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
