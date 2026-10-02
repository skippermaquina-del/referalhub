"use client";

import { useBooking } from "./AllegiantShell";

/** Botón que abre el panel de reserva, para usarlo desde secciones del servidor. */
export function BookButton({
  children,
  className = "al-btn",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openBook } = useBooking();
  return (
    <button type="button" className={className} onClick={openBook}>
      {children}
    </button>
  );
}
