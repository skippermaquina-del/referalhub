"use client";

import { business, copy, paths, type Lang } from "@/data/allegiant";
import { useBooking } from "./AllegiantShell";
import { PowerMark } from "./PowerMark";

const power = {
  en: { on: "Turn the logo on", off: "Turn the logo off" },
  es: { on: "Encender el logo", off: "Apagar el logo" },
};

/** Cabecera fija: el botón de reservar y el teléfono quedan siempre a la vista. */
export function Header({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const p = paths(lang);
  const { openBook } = useBooking();

  return (
    <header className="al-header">
      <div className="al-brand">
        <div className="al-brand-mark">
          <PowerMark compact label={power[lang]} />
        </div>
        <a href="#top" className="al-brand-name">Allegiant</a>
      </div>
      <nav className="al-nav" aria-label="Principal">
        <a className="al-nav-text" href="#marques">{t.nav.brands}</a>
        <a className="al-nav-text" href="#reviews">{t.nav.reviews}</a>
        <a className="al-nav-text" href="#faq">{t.nav.faq}</a>
        <a className="al-nav-text" href={p.tour}>{t.nav.tour}</a>
        <div className="al-lang">
          <a href={paths("en").home} hrefLang="en" aria-current={lang === "en"} aria-label="English">EN</a>
          <a href={paths("es").home} hrefLang="es" aria-current={lang === "es"} aria-label="Español">ES</a>
        </div>
        <a className="al-nav-text" href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>
        <button type="button" className="al-nav-book" onClick={openBook}>{t.nav.book}</button>
      </nav>
    </header>
  );
}
