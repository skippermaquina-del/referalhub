"use client";

import { useLang } from "@/components/eyeodin/LangProvider";
import { Reveal } from "@/components/eyeodin/Reveal";
import { Scope } from "@/components/eyeodin/Scope";
import { OdinEye } from "@/components/eyeodin/OdinEye";
import {
  company,
  contact,
  figures,
  hero,
  isPending,
  pillars,
  process,
  report,
  services,
} from "@/data/eyeodin";
import type { Localized } from "@/data/eyeodin";

/** Etiqueta monoespaciada que abre cada sección. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eo-label">
      <span className="mr-2.5 inline-block h-px w-6 align-middle bg-[color:var(--eo-sonar)]" />
      {children}
    </p>
  );
}

/**
 * Un dato de contacto. Mientras siga en `REPLACE_ME` se ve la etiqueta
 * punteada: preferible a publicar un teléfono inventado.
 */
function Field({
  label,
  value,
  href,
}: {
  label: Localized;
  value: string;
  href?: (value: string) => string;
}) {
  const { t } = useLang();

  return (
    <div>
      <p className="eo-label mb-2">{t(label)}</p>
      {isPending(value) ? (
        <span className="eo-pending">{t(contact.pendingLabel)}</span>
      ) : href ? (
        <a
          href={href(value)}
          className="text-[15px] text-[color:var(--eo-foam)] underline decoration-[color:var(--eo-sonar)] underline-offset-4 transition-opacity hover:opacity-75"
        >
          {value}
        </a>
      ) : (
        <p className="text-[15px]">{value}</p>
      )}
    </div>
  );
}

export default function EyeOdinPage() {
  const { t } = useLang();

  return (
    <main>
      {/* ---------- Portada ---------- */}
      <section id="portada" className="eo-hero px-5 pt-28 pb-20 sm:px-7 sm:pt-36 sm:pb-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>{t(hero.eyebrow)}</Eyebrow>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="eo-display mt-7 text-[clamp(2.5rem,6.2vw,4.4rem)]">
                {t(hero.title)}
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 max-w-[38ch] text-[17px] leading-relaxed text-[color:var(--eo-foam-dim)]">
                {t(hero.body)}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-3.5">
                <a href="#contacto" className="eo-btn">
                  {t(hero.primaryCta)}
                </a>
                <a href="#informe" className="eo-btn eo-btn-ghost">
                  {t(hero.secondaryCta)}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="mx-auto w-full max-w-[440px]">
            <Scope />
          </Reveal>
        </div>
      </section>

      {/* ---------- Cifras ---------- */}
      <section className="px-5 sm:px-7">
        <div className="mx-auto grid max-w-[1180px] gap-px overflow-hidden rounded-2xl border border-[color:var(--eo-line)] bg-[color:var(--eo-line)] sm:grid-cols-3">
          {figures.map((figure, index) => (
            <Reveal
              key={t(figure.label)}
              delay={index * 90}
              className="bg-[color:var(--eo-abyss)] px-7 py-9"
            >
              <p className="eo-figure text-[2rem]">
                {isPending(figure.value) ? (
                  <span className="eo-pending">{t(contact.pendingLabel)}</span>
                ) : (
                  figure.value
                )}
              </p>
              <p className="mt-3 text-[13.5px] text-[color:var(--eo-foam-faint)]">
                {t(figure.label)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Servicios ---------- */}
      <section id="servicios" className="px-5 py-24 sm:px-7 sm:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <Eyebrow>{t({ es: "Servicios", en: "Services" })}</Eyebrow>
            <h2 className="eo-display mt-6 max-w-[20ch] text-[clamp(1.9rem,4vw,3rem)]">
              {t({
                es: "Seis maneras de mirar el mismo barco.",
                en: "Six ways of looking at the same boat.",
              })}
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal as="li" key={service.slug} delay={(index % 3) * 90} className="eo-card">
                <h3 className="eo-display text-[1.35rem] leading-snug">{t(service.title)}</h3>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-[color:var(--eo-foam-dim)]">
                  {t(service.body)}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Proceso ---------- */}
      <section id="proceso" className="eo-hairline px-5 py-24 sm:px-7 sm:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <Eyebrow>{t({ es: "Proceso", en: "Process" })}</Eyebrow>
            <h2 className="eo-display mt-6 max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)]">
              {t({
                es: "De la llamada al plan, en cuatro pasos.",
                en: "From the first call to the plan, in four steps.",
              })}
            </h2>
          </Reveal>

          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {process.map((step, index) => (
              <Reveal as="li" key={step.title.en} delay={index * 90}>
                <p className="eo-step-num">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mt-4 h-px w-full bg-[color:var(--eo-line)]" />
                <h3 className="eo-display mt-5 text-[1.3rem]">{t(step.title)}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--eo-foam-dim)]">
                  {t(step.body)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- El informe ---------- */}
      <section id="informe" className="eo-hairline px-5 py-24 sm:px-7 sm:py-32">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <Eyebrow>{t({ es: "El informe", en: "The report" })}</Eyebrow>
            <h2 className="eo-display mt-6 text-[clamp(1.9rem,4vw,3rem)]">{t(report.title)}</h2>
            <p className="mt-6 max-w-[36ch] text-[16px] leading-relaxed text-[color:var(--eo-foam-dim)]">
              {t(report.body)}
            </p>
          </Reveal>

          <ul className="grid gap-px overflow-hidden rounded-2xl border border-[color:var(--eo-line)] bg-[color:var(--eo-line)]">
            {report.items.map((item, index) => (
              <Reveal
                as="li"
                key={item.en}
                delay={index * 70}
                className="flex gap-4 bg-[color:var(--eo-abyss)] px-6 py-5"
              >
                <span className="eo-figure mt-0.5 shrink-0 text-[12px] text-[color:var(--eo-sonar)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[15px] leading-relaxed">{t(item)}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Criterio ---------- */}
      <section id="criterio" className="eo-hairline px-5 py-24 sm:px-7 sm:py-32">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <Eyebrow>{t({ es: "Criterio", en: "Approach" })}</Eyebrow>
            <h2 className="eo-display mt-6 max-w-[24ch] text-[clamp(1.9rem,4vw,3rem)]">
              {t({
                es: "Un informe vale lo que vale su independencia.",
                en: "A survey is worth exactly what its independence is worth.",
              })}
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {pillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.title.en} delay={index * 90}>
                <OdinEye id={`pillar-${index}`} className="h-7 w-auto text-[color:var(--eo-brass)]" />
                <h3 className="eo-display mt-5 text-[1.4rem]">{t(pillar.title)}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--eo-foam-dim)]">
                  {t(pillar.body)}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Contacto ---------- */}
      <section id="contacto" className="eo-hairline px-5 py-24 sm:px-7 sm:py-32">
        <div className="mx-auto grid max-w-[1180px] gap-14 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
          <Reveal>
            <Eyebrow>{t({ es: "Contacto", en: "Contact" })}</Eyebrow>
            <h2 className="eo-display mt-6 text-[clamp(2rem,4.4vw,3.2rem)]">{t(contact.title)}</h2>
            <p className="mt-6 max-w-[38ch] text-[16px] leading-relaxed text-[color:var(--eo-foam-dim)]">
              {t(contact.body)}
            </p>
          </Reveal>

          <Reveal delay={120} className="grid gap-8 sm:grid-cols-2 lg:content-start">
            <Field
              label={contact.emailLabel}
              value={contact.email}
              href={(value) => `mailto:${value}`}
            />
            <Field
              label={contact.phoneLabel}
              value={contact.phone}
              href={(value) => `tel:${value.replace(/[^+\d]/g, "")}`}
            />
            <Field label={contact.baseLabel} value={contact.base} />
            <Field
              label={contact.instagramLabel}
              value={contact.instagram}
              href={(value) => `https://instagram.com/${value.replace(/^@/, "")}`}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- Pie ---------- */}
      <footer className="eo-hairline px-5 py-12 sm:px-7">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <OdinEye id="footer" className="h-5 w-auto text-[color:var(--eo-foam-faint)]" />
            <span className="eo-wordmark text-[15px]">{company.name}</span>
          </div>
          <p className="text-[13px] text-[color:var(--eo-foam-faint)]">
            {t(company.tagline)}
          </p>
          <p className="eo-figure text-[12px] text-[color:var(--eo-foam-faint)]">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
