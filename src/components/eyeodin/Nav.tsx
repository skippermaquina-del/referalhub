"use client";

import { useEffect, useState } from "react";
import { company, nav } from "@/data/eyeodin";
import type { Lang } from "@/data/eyeodin";
import { OdinEye } from "./OdinEye";
import { useLang } from "./LangProvider";

/** Conmutador ES/EN. Dos botones en vez de un desplegable: son dos opciones. */
function LangSwitch() {
  const { lang, setLang } = useLang();
  const options: Lang[] = ["es", "en"];

  return (
    <div className="eo-langswitch" role="group" aria-label="Idioma / Language">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className="eo-langswitch-btn"
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLang();
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
    <header className={`eo-nav${scrolled || open ? " eo-nav-solid" : ""}`}>
      <nav
        aria-label={t({ es: "Principal", en: "Main" })}
        className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-7"
      >
        <a href="#portada" className="flex items-center gap-2.5">
          <OdinEye id="nav" className="h-6 w-auto text-[color:var(--eo-foam)]" />
          <span className="eo-wordmark text-[17px] tracking-[0.02em]">{company.name}</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="eo-navlink">
                  {t(item.label)}
                </a>
              </li>
            ))}
          </ul>
          <LangSwitch />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LangSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="eo-nav-mobile"
            aria-label={t({ es: "Menú", en: "Menu" })}
            className="eo-burger"
          >
            <span data-open={open ? "" : undefined} />
            <span data-open={open ? "" : undefined} />
          </button>
        </div>
      </nav>

      {open ? (
        <ul id="eo-nav-mobile" className="eo-nav-mobile md:hidden">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {t(item.label)}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
