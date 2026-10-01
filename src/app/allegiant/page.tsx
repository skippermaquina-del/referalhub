import Image from "next/image";
import QRCode from "qrcode";
import { LeadForm } from "@/components/allegiant/LeadForm";
import { brands, business, faqs, reasons, services, steps, vcard } from "@/data/allegiant";

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg bg-[color:var(--al-orange)] px-7 py-4 text-[15px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[color:var(--al-orange-dim)]";
const btnGhost =
  "inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-7 py-4 text-[15px] font-bold tracking-wide text-white transition-colors hover:border-white";
const section = "px-5 py-16 md:py-24";
const wrap = "mx-auto max-w-6xl";
const h2 = "text-[32px] font-extrabold leading-tight md:text-[44px]";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange-dim)]">
      {children}
    </p>
  );
}

export default async function AllegiantPage() {
  const qr = await QRCode.toString(vcard, {
    type: "svg",
    margin: 1,
    color: { dark: "#1b2f57", light: "#ffffff" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    description: business.subhead,
    telephone: business.phone,
    areaServed: business.area,
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title },
    })),
  };

  return (
    <main className="pb-20 md:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[color:var(--al-black)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <Image src="/allegiant/logo-icon.jpg" alt="" width={40} height={40} className="rounded-full" />
            <span className="text-[14px] font-extrabold uppercase tracking-[0.2em]">
              Allegiant <span className="text-[color:var(--al-orange)]">Appliances</span>
            </span>
          </a>
          <nav className="hidden items-center gap-8 text-[14px] font-semibold md:flex">
            <a href="#services" className="hover:text-[color:var(--al-orange)]">Services</a>
            <a href="#why" className="hover:text-[color:var(--al-orange)]">Why us</a>
            <a href="#faq" className="hover:text-[color:var(--al-orange)]">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href={business.phoneHref} className="hidden text-[14px] font-bold lg:block">{business.phone}</a>
            <a href="#book" className="rounded-lg bg-[color:var(--al-orange)] px-4 py-2.5 text-[13px] font-bold uppercase tracking-wide">
              Book Service
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="bg-[color:var(--al-black)] px-5 py-16 text-white md:py-28">
        <div className={`${wrap} grid items-center gap-12 md:grid-cols-[1.2fr_0.8fr]`}>
          <div>
            <p className="mb-5 inline-block rounded-full border border-[color:var(--al-orange)] px-4 py-1.5 text-[13px] font-bold uppercase tracking-widest text-[color:var(--al-orange)]">
              {business.discount} · scan to save contact
            </p>
            <h1 className="text-[38px] font-extrabold leading-[1.05] md:text-[64px]">
              {business.headline}
            </h1>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-white/75">{business.subhead}</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#book" className={btnPrimary}>Book Service</a>
              <a href={business.phoneHref} className={btnGhost}>Call {business.phone}</a>
            </div>
            <p className="mt-6 text-[14px] font-semibold text-white/60">
              Residential &amp; Commercial · Licensed &amp; Insured · {business.area}
            </p>
          </div>
          <div className="flex justify-center">
            <Image src="/allegiant/logo-full.jpg" alt="Allegiant Appliances Inc" width={440} height={390} priority className="h-auto w-full max-w-[380px]" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={section}>
        <div className={wrap}>
          <Eyebrow>What we repair</Eyebrow>
          <h2 className={h2}>Every appliance in your home or business.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <a key={s.title} href="#book" className="group flex flex-col rounded-xl border border-[color:var(--al-hairline)] bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                <h3 className="text-[22px] font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 text-[16px] leading-relaxed text-[color:var(--al-ink-dim)]">{s.note}</p>
                <span className="mt-5 text-[14px] font-bold text-[color:var(--al-orange-dim)] group-hover:underline">Request repair →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="bg-[color:var(--al-navy)] px-5 py-14 text-white">
        <div className={`${wrap} text-center`}>
          <h2 className="text-[28px] font-extrabold md:text-[36px]">We service all major brands.</h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[18px] font-bold tracking-wide text-white/70">
            {brands.map((b) => (<li key={b}>{b}</li>))}
          </ul>
        </div>
      </section>

      {/* Why us + steps */}
      <section id="why" className={section}>
        <div className={`${wrap} grid gap-14 md:grid-cols-2`}>
          <div>
            <Eyebrow>Why Allegiant</Eyebrow>
            <h2 className={h2}>Trust the person who shows up.</h2>
            <ul className="mt-8 grid gap-6">
              {reasons.map((r) => (
                <li key={r.title} className="flex gap-4">
                  <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-[color:var(--al-orange)]" />
                  <div>
                    <h3 className="text-[19px] font-bold">{r.title}</h3>
                    <p className="text-[16px] text-[color:var(--al-ink-dim)]">{r.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className={h2}>Three steps to a working appliance.</h2>
            <ol className="mt-8 grid gap-6">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5 rounded-xl bg-white p-6 shadow-sm">
                  <span className="text-[36px] font-extrabold leading-none text-[color:var(--al-orange)]">{i + 1}</span>
                  <div>
                    <h3 className="text-[19px] font-bold">{s.title}</h3>
                    <p className="text-[16px] text-[color:var(--al-ink-dim)]">{s.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Discount QR */}
      <section className="bg-[color:var(--al-black)] px-5 py-16 text-white md:py-20">
        <div className={`${wrap} grid items-center gap-10 md:grid-cols-[1fr_auto]`}>
          <div>
            <Eyebrow>Exclusive offer</Eyebrow>
            <h2 className={h2}>Save Vadim&apos;s contact, get 20% off.</h2>
            <p className="mt-4 max-w-xl text-[18px] text-white/70">
              Scan the code with your phone to save the contact. Show it when you book and get 20% off labor or maintenance.
            </p>
          </div>
          <div
            role="img"
            aria-label="QR code to save Vadim's contact"
            className="mx-auto w-52 rounded-2xl bg-white p-3"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
        </div>
      </section>

      {/* Service area */}
      <section className={section}>
        <div className={`${wrap} text-center`}>
          <Eyebrow>Service area</Eyebrow>
          <h2 className={h2}>{business.area}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[18px] text-[color:var(--al-ink-dim)]">
            Not sure if we cover your address? Call or text and Vadim will let you know right away.
          </p>
        </div>
      </section>

      {/* Booking */}
      <section id="book" className="bg-[color:var(--al-cream)] px-5 pb-16 md:pb-24">
        <div className={`${wrap} grid gap-10 rounded-2xl bg-[color:var(--al-navy)] p-7 text-white md:grid-cols-[0.9fr_1.1fr] md:p-12`}>
          <div>
            <h2 className={h2}>Book your repair.</h2>
            <p className="mt-4 text-[18px] text-white/75">Tell us what&apos;s wrong — Vadim will reply with the next available time.</p>
            <a href={business.phoneHref} className="mt-8 inline-block text-[26px] font-extrabold text-[color:var(--al-orange)]">{business.phone}</a>
          </div>
          <div className="rounded-xl bg-[color:var(--al-cream)] p-6 text-[color:var(--al-ink)]">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${section} pt-0`}>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className={h2}>Common questions.</h2>
          <div className="mt-8 divide-y divide-[color:var(--al-hairline)] border-y border-[color:var(--al-hairline)]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none text-[18px] font-bold marker:hidden">{f.q}</summary>
                <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--al-ink-dim)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[color:var(--al-black)] px-5 py-10 text-center text-[14px] text-white/60">
        <p className="font-bold text-white">{business.name}</p>
        <p className="mt-1">Residential &amp; Commercial · Licensed &amp; Insured · {business.area}</p>
        <p className="mt-1"><a href={business.phoneHref} className="text-[color:var(--al-orange)]">{business.phone}</a></p>
        <p className="mt-4">© {new Date().getFullYear()} {business.name}</p>
      </footer>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-px bg-white/20 md:hidden">
        <a href={business.phoneHref} className="bg-[color:var(--al-navy)] py-4 text-center text-[15px] font-bold text-white">Call now</a>
        <a href="#book" className="bg-[color:var(--al-orange)] py-4 text-center text-[15px] font-bold text-white">Book service</a>
      </div>
    </main>
  );
}
