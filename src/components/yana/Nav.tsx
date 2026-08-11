"use client";

import { useEffect, useState } from "react";
import { artist } from "@/data/yana";

const links = [
  { href: "#obra", label: "Obra" },
  { href: "#series", label: "Series" },
  { href: "#proceso", label: "Proceso" },
  { href: "#exposiciones", label: "Exposiciones" },
  { href: "#estudio", label: "Estudio" },
];

export function Nav() {
  // Transparente sobre la portada, translúcida en cuanto se hace scroll.
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el menú móvil abierto, el fondo no debe desplazarse.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open
          ? "border-b border-white/10 bg-black/70 [backdrop-filter:saturate(180%)_blur(20px)]"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-5 sm:px-6"
      >
        <a
          href="#portada"
          className="text-[13px] font-medium tracking-[-0.01em] text-white transition-opacity hover:opacity-70"
        >
          {artist.name}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[12px] text-white/75 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#contacto"
            className="text-[12px] text-[color:var(--yana-accent)] transition-opacity hover:opacity-70"
          >
            Consultas
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="yana-menu-movil"
          className="-mr-2 flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <span aria-hidden className="relative block h-[10px] w-[18px]">
            <span
              className={`absolute left-0 block h-px w-full bg-white transition-transform duration-300 ${
                open ? "top-[5px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-white transition-transform duration-300 ${
                open ? "top-[5px] -rotate-45" : "top-[10px]"
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        id="yana-menu-movil"
        hidden={!open}
        className="border-t border-white/10 bg-black/70 px-5 pb-8 pt-2 [backdrop-filter:saturate(180%)_blur(20px)] md:hidden"
      >
        <ul>
          {[...links, { href: "#contacto", label: "Consultas" }].map((link) => (
            <li key={link.href} className="border-b border-white/10 last:border-b-0">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-4 text-[22px] font-medium tracking-[-0.02em] text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
