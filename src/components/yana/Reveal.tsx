"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Retardo en ms, para escalonar varios elementos de una misma fila. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "figure" | "article";
};

/**
 * Aparición al entrar en pantalla: sube y funde, una sola vez.
 * `prefers-reduced-motion` se atiende en yana.css, que deja el contenido
 * visible sin transición: aquí no hace falta comprobarlo.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      data-visible={visible ? "" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`yana-reveal${className ? ` ${className}` : ""}`}
    >
      {children}
    </Tag>
  );
}
