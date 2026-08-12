"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { artist } from "@/data/yana";

const links = [
  { href: "#obras", label: "Obras" },
  { href: "#colecciones", label: "Colecciones" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#blog", label: "Blog" },
  { href: "#contacto", label: "Contacto" },
];

/** Ícono de Instagram, trazo simple para que respire junto a la tipografía. */
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
          ? "border-b border-[color:var(--yana-hairline)] bg-[color:var(--yana-paper)]/85 [backdrop-filter:saturate(180%)_blur(20px)]"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-[1152px] items-center justify-between px-5 sm:px-6"
      >
        <a
          href="#inicio"
          className="rounded-lg bg-[color:var(--yana-paper)]/95 px-2.5 py-1.5 shadow-[0_1px_2px_rgba(22,32,58,0.08)] transition-opacity hover:opacity-75"
        >
          <Image
            src="/yana/logo-wordmark.jpg"
            alt={`${artist.name} — ${artist.brand}`}
            width={900}
            height={330}
            priority
            className="yana-logo h-8 w-auto sm:h-9"
          />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] uppercase tracking-[0.08em] text-[color:var(--yana-ink-dim)] transition-colors hover:text-[color:var(--yana-ink)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={artist.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[color:var(--yana-ink)] transition-opacity hover:opacity-65"
          >
            <InstagramIcon />
          </a>
          <a
            href={artist.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[color:var(--yana-accent)] px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-85"
          >
            Escribime
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
              className={`absolute left-0 block h-px w-full bg-[color:var(--yana-ink)] transition-transform duration-300 ${
                open ? "top-[5px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-[color:var(--yana-ink)] transition-transform duration-300 ${
                open ? "top-[5px] -rotate-45" : "top-[10px]"
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        id="yana-menu-movil"
        hidden={!open}
        className="border-t border-[color:var(--yana-hairline)] bg-[color:var(--yana-paper)]/95 px-5 pb-8 pt-2 [backdrop-filter:saturate(180%)_blur(20px)] md:hidden"
      >
        <ul>
          {[...links, { href: "#inicio-whatsapp", label: "Escribime" }].map((link) =>
            link.href === "#inicio-whatsapp" ? (
              <li key={link.href} className="pt-4">
                <a
                  href={artist.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-[color:var(--yana-accent)] py-3 text-center text-[15px] font-medium uppercase tracking-[0.06em] text-white"
                >
                  {link.label}
                </a>
              </li>
            ) : (
              <li
                key={link.href}
                className="border-b border-[color:var(--yana-hairline)] last:border-b-0"
              >
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-[20px] font-medium tracking-[-0.01em] text-[color:var(--yana-ink)]"
                >
                  {link.label}
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </header>
  );
}
