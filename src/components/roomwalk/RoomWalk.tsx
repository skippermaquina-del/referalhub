"use client";

import { useEffect, useRef } from "react";
import { createRoomWalk } from "@roomwalk/roomwalk.js";
import type { RoomWalkOptions } from "@roomwalk/roomwalk.js";

type Props = {
  children: React.ReactNode;
  options?: RoomWalkOptions;
  className?: string;
};

/**
 * Monta el motor de roomwalk sobre unas secciones ya renderizadas en el
 * servidor. El HTML se envía completo y en orden; el paseo es una mejora
 * encima, así que sin JS la página sigue leyéndose como una pila de secciones.
 *
 * El motor mueve el DOM de sitio (los paneles se van a las paredes). Aquí eso
 * es seguro porque el árbol es estático: React no vuelve a reconciliarlo. Si
 * lo usas con contenido que cambia de estado, envuelve los hijos en `memo` o
 * vuelve a montar el paseo tras el cambio.
 */
export function RoomWalk({ children, options, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Se congelan las opciones del primer render: cambiarlas obligaría a
  // reconstruir el piso entero, y no es algo que se quiera a mitad de scroll.
  const frozen = useRef(options);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const walk = createRoomWalk(node, frozen.current);
    // En desarrollo React monta, desmonta y vuelve a montar: `destroy` deja el
    // DOM como estaba, así que la segunda pasada encuentra el original intacto.
    return () => walk.destroy();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
