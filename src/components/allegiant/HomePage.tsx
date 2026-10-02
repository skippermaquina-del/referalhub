import { business, copy, paths, serviceAreas, type Lang } from "@/data/allegiant";
import { AllegiantShell } from "./AllegiantShell";
import { BookButton } from "./BookButton";
import { BrandCarousel } from "./BrandCarousel";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Ribbon } from "./Ribbon";

function Star() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#f26f21" aria-hidden="true">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
    </svg>
  );
}

/** Datos estructurados para Google: solo lo que el negocio ha confirmado. */
function structuredData(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    description: copy[lang].meta.description,
    telephone: business.phoneDisplay,
    areaServed: serviceAreas.map((name) => ({ "@type": "City", name })),
    knowsLanguage: ["en", "es"],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: business.weekdayHours.opens,
      closes: business.weekdayHours.closes,
    },
    ...(business.reviewStats
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: business.reviewStats.rating,
            reviewCount: business.reviewStats.count,
          },
        }
      : {}),
  };
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const p = paths(lang);
  const stats = business.reviewStats;

  const trust: { big: string; small: string }[] = [
    { big: `${business.yearsInArea}+`, small: t.trust.years },
    { big: t.trust.licensed, small: t.trust.licensedSmall },
  ];
  if (stats) trust.push({ big: stats.rating, small: `${t.trust.rating} · ${stats.count} ${t.trust.reviews}` });
  if (business.registrationNumber) {
    trust.push({ big: business.registrationNumber, small: t.trust.registration });
  }

  return (
    <div lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(lang)) }}
      />
      <AllegiantShell lang={lang}>
        {business.offerEnabled && <Ribbon lang={lang} />}
        <Header lang={lang} />
        <main>
          <Hero lang={lang} />

          {/* Barra de confianza: solo datos confirmados */}
          <section className="al-trust" aria-label={t.why.eyebrow}>
            {trust.map((item) => (
              <div key={item.small} className="al-trust-item">
                <div className="al-trust-big">{item.big}</div>
                <div className="al-trust-small">{item.small}</div>
              </div>
            ))}
          </section>

          <section id="marques" className="al-section al-section-line">
            <div className="al-grid12 al-section-head">
              <div className="al-eyebrow">{t.brands.eyebrow}</div>
              <h2 className="al-h2">{t.brands.h2}</h2>
            </div>
            <BrandCarousel lang={lang} />
            <div className="al-all-brands">
              <span className="al-all-brands-plus" aria-hidden="true">+</span>
              <span className="al-all-brands-text">{t.brands.all}</span>
            </div>
          </section>

          <section className="al-section" style={{ paddingBottom: 40 }}>
            <div className="al-grid12 al-section-head">
              <div className="al-eyebrow">{t.why.eyebrow}</div>
              <h2 className="al-h2">{t.why.h2}</h2>
            </div>
            <div className="al-why">
              {t.why.items.map((item) => (
                <div key={item.n} className="al-why-item">
                  <div className="al-num">{item.n}</div>
                  <h3 className="al-why-title">{item.t}</h3>
                  <p className="al-why-text">{item.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="savoir" className="al-section">
            <div className="al-services">
              {t.services.items.map((item) => (
                <div key={item.n} className="al-service">
                  <span className="al-num">{item.n}</span>
                  <h3>{item.t}</h3>
                  <p>{item.p}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="al-section al-grid12 al-teaser">
            <div style={{ gridColumn: "1 / span 6" }}>
              <div className="al-eyebrow">{t.tourTeaser.eyebrow}</div>
              <h2>
                {t.tourTeaser.h2a} <em>{t.tourTeaser.h2b}</em>
              </h2>
            </div>
            <div style={{ gridColumn: "8 / span 5" }}>
              <p style={{ margin: "0 0 40px", fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)" }}>
                {t.tourTeaser.p}
              </p>
              <a className="al-btn-line" href={p.tour}>{t.tourTeaser.cta}</a>
            </div>
          </section>

          <section id="reviews" className="al-section al-grid12 al-reviews">
            <div style={{ gridColumn: "1 / span 6" }}>
              <div className="al-eyebrow" style={{ marginBottom: 28 }}>{t.reviews.eyebrow}</div>
              <h2 className="al-h2">{t.reviews.h2}</h2>
            </div>
            <div style={{ gridColumn: "8 / span 5" }}>
              {stats && (
                <div className="al-stars" aria-label={`${stats.rating} / 5`}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} />
                  ))}
                  <span>
                    {stats.rating} · {stats.count} {t.trust.reviews}
                  </span>
                </div>
              )}
              <p style={{ margin: "28px 0 40px", fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)" }}>
                {t.reviews.p}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "center" }}>
                <a className="al-btn" href={business.reviewsUrl} target="_blank" rel="noopener noreferrer">
                  {t.reviews.read}
                </a>
                <a className="al-link" href={business.writeReviewUrl} target="_blank" rel="noopener noreferrer">
                  {t.reviews.write}
                </a>
              </div>
            </div>
          </section>

          {business.testimonials.length > 0 && (
            <section className="al-section" style={{ paddingBottom: 40 }}>
              <h2 className="al-h2" style={{ marginBottom: 56 }}>{t.reviews.testimonials}</h2>
              <div className="al-testimonials">
                {business.testimonials.map((q) => (
                  <figure key={q.who} className="al-quote">
                    <div className="al-stars" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} />
                      ))}
                    </div>
                    <blockquote>“{q.text}”</blockquote>
                    <figcaption>{q.who}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          <section id="faq" className="al-section al-faq">
            <div className="al-grid12">
              <div className="al-eyebrow" style={{ gridColumn: "1 / span 4", paddingTop: 12 }}>{t.faq.eyebrow}</div>
              <div style={{ gridColumn: "5 / span 8" }}>
                <h2 className="al-h2" style={{ marginBottom: 48 }}>{t.faq.h2}</h2>
                <div className="al-faq-list">
                  {t.faq.items.map((item) => (
                    <details key={item.q}>
                      <summary>
                        <span>{item.q}</span>
                        <span className="al-faq-icon" aria-hidden="true">
                          <span className="al-faq-plus">+</span>
                          <span className="al-faq-minus">–</span>
                        </span>
                      </summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="al-section al-section-line">
            <div className="al-grid12 al-section-head" style={{ marginBottom: 56 }}>
              <div className="al-eyebrow">{t.areas.eyebrow}</div>
              <h2 className="al-h2">{t.areas.h2}</h2>
            </div>
            <ul className="al-chips" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {serviceAreas.map((area) => (
                <li key={area} className="al-chip">{area}</li>
              ))}
            </ul>
          </section>

          <section id="contact" className="al-contact">
            <div className="al-eyebrow">{t.contact.eyebrow}</div>
            <h2>{t.contact.h2}</h2>
            <div className="al-contact-actions">
              <BookButton>{t.nav.book}</BookButton>
              <a className="al-phone-btn" href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>
            </div>
          </section>
        </main>

        <footer className="al-footer">
          <div className="al-grid12">
            <div style={{ gridColumn: "1 / span 5" }}>
              <div className="al-brand">
                <svg viewBox="0 0 1000 1000" width="48" height="48" fill="none" aria-hidden="true">
                  <circle cx="500" cy="500" r="290" fill="#1c2f58" />
                  <path d="M350 184 A350 350 0 1 0 650 184" stroke="#f26f21" strokeWidth="40" strokeLinecap="round" />
                  <path d="M500 192 L368 708 M500 192 L632 708" stroke="#fff" strokeWidth="64" strokeLinecap="round" />
                  <circle cx="500" cy="550" r="45" fill="#f26f21" />
                </svg>
                <span className="al-brand-name" style={{ fontSize: 18 }}>Allegiant</span>
              </div>
              <p style={{ margin: "26px 0 0", maxWidth: 380, fontSize: 15, lineHeight: 1.8, color: "var(--al-muted)" }}>
                {t.footer.blurb}
              </p>
            </div>
            <div style={{ gridColumn: "7 / span 3" }}>
              <div className="al-footer-col-title">{t.footer.contact}</div>
              <div className="al-footer-links">
                <a href={`tel:${business.phoneHref}`}>{business.phoneDisplay}</a>
                <span>{t.footer.where}</span>
                <span>{t.footer.hours}</span>
                {business.registrationNumber && (
                  <span>
                    {t.trust.registration} #{business.registrationNumber}
                  </span>
                )}
              </div>
            </div>
            <div style={{ gridColumn: "10 / span 3" }}>
              <div className="al-footer-col-title">{t.footer.explore}</div>
              <div className="al-footer-links">
                <a href="#marques">{t.nav.brands}</a>
                <a href="#reviews">{t.nav.reviews}</a>
                <a href="#faq">{t.nav.faq}</a>
                <a href={p.tour}>{t.nav.tour}</a>
                <a href={business.reviewsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--al-accent)" }}>
                  {t.footer.google}
                </a>
              </div>
            </div>
          </div>
          <p className="al-legal">{t.footer.legal}</p>
          <div className="al-footer-bottom">
            <span>© {new Date().getFullYear()} {business.name}</span>
            <span>{t.footer.mid}</span>
          </div>
        </footer>
      </AllegiantShell>
    </div>
  );
}
