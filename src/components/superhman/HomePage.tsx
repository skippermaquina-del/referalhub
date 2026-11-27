import { LeadForm } from "@/components/superhman/LeadForm";
import { business, copy, paths, prices, type Lang } from "@/data/superhman";
import { legalLabels } from "@/data/superhman-legal";

/** El monograma, el mismo trazo que va en la tarjeta y en la van. */
export function Mark({ className = "sh-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 9h18v25h48V9h18v82H74V66H26v25H8Z M50 38 62 44v12l-12 6-12-6V44Z"
      />
    </svg>
  );
}

export function Header({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const p = paths(lang);
  return (
    <header className="sh-top">
      <Mark />
      <a href={p.home} style={{ textDecoration: "none" }}>
        <span className="sh-brand">
          SUPER<i>H</i>MAN
        </span>
      </a>
      <nav>
        <a href={p.other}>{t.nav.es}</a>
        <a className="sh-callbtn" href={`tel:${business.phoneHref}`}>
          {business.phoneDisplay}
        </a>
      </nav>
    </header>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const p = paths(lang);
  return (
    <footer className="sh-foot">
      <div>
        <strong>SUPERHMAN</strong> · {t.footerArea}
      </div>
      <div>{t.scopeNote}</div>
      <div>
        <a href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>
        {" · "}
        <a href={business.whatsapp}>WhatsApp</a>
        {" · "}
        <a href={business.instagram}>Instagram</a>
        {" · "}
        <a href={p.privacy}>{legalLabels[lang].privacy}</a>
      </div>
    </footer>
  );
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <div className="sh-wrap">
      <Header lang={lang} />

      <section className="sh-hero">
        <h1>
          {t.heroTitle} <em>{t.heroTitleAccent}</em>.
        </h1>
        <p className="sh-lead">{t.heroLead}</p>
        <div className="sh-cta">
          <a className="sh-btn" href="#ask">
            {t.heroCta}
          </a>
          <small>
            {t.heroCall}{" "}
            <a href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>
          </small>
        </div>
      </section>

      <section className="sh-sec">
        <div className="sh-eyebrow">{t.pricesTitle}</div>
        <ul className="sh-prices">
          {prices.map((row) => (
            <li key={row.en}>
              <b>{lang === "es" ? row.es : row.en}</b>
              <span>
                <i>{t.from}</i> ${row.from}
              </span>
            </li>
          ))}
        </ul>
        <p className="sh-note">{t.pricesNote}</p>
      </section>

      <section className="sh-sec">
        <h2>{t.stepsTitle}</h2>
        <div className="sh-steps">
          {t.steps.map((s) => (
            <div className="sh-step" key={s.n}>
              <div className="n">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        {/* `insured` sigue en false: la palabra no aparece hasta que exista la póliza. */}
        <div className="sh-trust">
          {(business.insured ? ["Insured", ...t.trust] : [...t.trust]).map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </section>

      <section className="sh-form-sec" id="ask">
        <div className="sh-form-intro">
          <h2>{t.formTitle}</h2>
          <p>{t.formLead}</p>
        </div>
        <LeadForm lang={lang} />
      </section>

      <Footer lang={lang} />
    </div>
  );
}
