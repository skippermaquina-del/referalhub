import Image from "next/image";
import { Artwork } from "@/components/yana/Artwork";
import { GoldLine } from "@/components/yana/GoldLine";
import { Parallax } from "@/components/yana/Parallax";
import { Reveal } from "@/components/yana/Reveal";
import {
  artist,
  blogPosts,
  collections,
  portraitShot,
  works,
} from "@/data/yana";

const [featured, ...restWorks] = works;

/** Etiqueta pequeña en versalitas que abre cada sección, con el trazo
 * dorado en movimiento del isotipo real como firma. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block">
      <p className="text-[12px] font-medium uppercase tracking-[0.28em] text-[color:var(--yana-accent-dim)]">
        {children}
      </p>
      <GoldLine className="mt-2 h-3 w-16" />
    </div>
  );
}

/** Botón sólido, la llamada a la acción primaria del sitio. */
function SolidLink({
  href,
  children,
  tone = "ink",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "accent";
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full px-7 py-3 text-[14px] font-medium uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-85 ${
        tone === "accent" ? "bg-[color:var(--yana-accent)]" : "bg-[color:var(--yana-ink)]"
      }`}
    >
      {children}
    </a>
  );
}

/** Enlace subrayado en dorado, la llamada a la acción secundaria. */
function GhostLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="border-b border-[color:var(--yana-accent)] pb-0.5 text-[14px] uppercase tracking-[0.06em] text-[color:var(--yana-accent-dim)] transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}

const trustIcons: Record<string, React.ReactNode> = {
  "Obra original": (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M4 12 2 6l6 2 4-6 4 6 6-2-2 6" strokeLinejoin="round" />
      <path d="M4 12h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z" strokeLinejoin="round" />
    </svg>
  ),
  Firmada: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M3 17c3-1 4-4 5-7 1 4 2 6 4 6s2-3 3-6c1 3 2 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Certificado: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 6 5-2.5L16 20l-1.5-6" strokeLinejoin="round" />
    </svg>
  ),
  "Embalaje seguro": (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M3 8 12 4l9 4-9 4-9-4Z" strokeLinejoin="round" />
      <path d="M3 8v8l9 4 9-4V8M12 12v8" strokeLinejoin="round" />
    </svg>
  ),
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.7 14.3c-.3.7-1.6 1.4-2.2 1.5-.6.1-1.3.1-2.1-.1-.5-.1-1.1-.3-1.9-.7-3.3-1.4-5.4-4.7-5.6-4.9-.2-.2-1.3-1.8-1.3-3.4s.8-2.4 1.1-2.7c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5s.8 2 .9 2.1c.1.2.1.4 0 .6-.1.2-.2.4-.3.5l-.5.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1.3.1 1.9.9 2.2 1.1.3.1.5.2.6.3.1.2.1.9-.2 1.6Z" />
    </svg>
  );
}

export default function YanaPage() {
  return (
    <main>
      {/* ---------------------------------------------------------- inicio */}
      <section
        id="inicio"
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <Parallax strength={0.3} className="absolute inset-x-0 -top-[15%] h-[130%]">
            <Artwork
              subject={featured}
              priority
              sizes="100vw"
              className="h-full w-full"
            />
          </Parallax>
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[color:var(--yana-paper)]/25 via-[color:var(--yana-paper)]/10 to-[color:var(--yana-paper)]"
        />

        <div className="relative mx-auto w-full max-w-[900px] px-5 pb-24 pt-32 sm:px-6">
          <span className="yana-script block text-[32px] text-white">
            {artist.name}
          </span>
          <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.32em] text-white/80">
            {artist.brand}
          </span>
          <GoldLine className="mt-5 h-4 w-24" />
          <h1
            className="mt-8 font-[family-name:var(--font-yana-serif)] text-[clamp(2.25rem,6vw,4.25rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-white"
          >
            {artist.headline}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[clamp(1rem,1.6vw,1.1875rem)] leading-[1.55] text-white/85">
            {artist.subhead}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <SolidLink href="#obras" tone="ink">
              Ver obras
            </SolidLink>
            <GhostLink href="#contacto">Consultar una obra</GhostLink>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- confianza */}
      <section className="border-b border-[color:var(--yana-hairline)] bg-[color:var(--yana-paper)]">
        <div className="mx-auto grid max-w-[1152px] grid-cols-2 gap-y-10 px-5 py-14 sm:px-6 md:grid-cols-4">
          {artist.trust.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 80}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="text-[color:var(--yana-accent)]">{trustIcons[item.title]}</span>
              <span>
                <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[color:var(--yana-ink)]">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] text-[color:var(--yana-ink-dim)]">{item.detail}</p>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- obras */}
      <section id="obras" className="bg-[color:var(--yana-paper)]">
        <div className="mx-auto max-w-[1152px] px-5 py-24 sm:px-6 sm:py-32">
          <Reveal className="text-center">
            <Eyebrow>Obras</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[22ch] font-[family-name:var(--font-yana-serif)] text-[clamp(1.875rem,4.5vw,3rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--yana-ink)]">
              Cada pieza es única y no se repite.
            </h2>
            <p className="mx-auto mt-5 max-w-[52ch] text-[16px] leading-[1.6] text-[color:var(--yana-ink-dim)]">
              Trabajo en acrílico y óleo sobre lienzo. Todas las obras que ves
              aquí están disponibles.
            </p>
          </Reveal>

          {/* obra destacada */}
          <Reveal className="mt-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[color:var(--yana-paper-dim)] sm:aspect-[16/11]">
                <Parallax strength={0.12} className="absolute inset-x-0 -top-[10%] h-[120%]">
                  <Artwork
                    subject={featured}
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="h-full w-full"
                  />
                </Parallax>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-yana-serif)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--yana-ink)]">
                  {featured.title}
                </h3>
                <p className="yana-script mt-1 text-[22px] text-[color:var(--yana-accent-dim)]">
                  {featured.tagline}
                </p>
                <p className="mt-5 text-[16px] leading-[1.65] text-[color:var(--yana-ink-dim)]">
                  {featured.note}
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[color:var(--yana-hairline)] pt-6 text-[14px]">
                  {[
                    { label: "Técnica", value: featured.medium },
                    { label: "Medidas", value: featured.dimensions },
                    { label: "Soporte", value: "Bastidor entelado, listo para colgar" },
                    { label: "Firma", value: artist.name },
                  ].map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--yana-accent-dim)]">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 font-medium text-[color:var(--yana-ink)]">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <p className="text-[14px] text-[color:var(--yana-ink-dim)]">
                    Precio:{" "}
                    <span className="font-[family-name:var(--font-yana-serif)] text-[17px] italic text-[color:var(--yana-ink)]">
                      Consultar
                    </span>
                  </p>
                  <SolidLink href={artist.whatsappLink} tone="accent">
                    Consultar por esta obra
                  </SolidLink>
                </div>
              </div>
            </div>
          </Reveal>

          {/* resto de las obras */}
          <ul className="mt-16 grid gap-6 sm:grid-cols-2">
            {restWorks.map((work, index) => (
              <Reveal
                key={work.slug}
                as="li"
                delay={index * 100}
                className="group overflow-hidden rounded-[20px] bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--yana-paper-dim)]">
                  <Artwork
                    subject={work}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-6 py-6">
                  <h4 className="font-[family-name:var(--font-yana-serif)] text-[19px] font-semibold tracking-[-0.01em] text-[color:var(--yana-ink)]">
                    {work.title}
                  </h4>
                  <p className="mt-2 text-[14px] leading-[1.5] text-[color:var(--yana-ink-dim)]">
                    {work.note}
                  </p>
                  <p className="mt-3 text-[13px] text-[color:var(--yana-ink-dim)]">
                    {work.medium} · {work.dimensions}
                  </p>
                  <div className="mt-4">
                    <GhostLink href={artist.whatsappLink}>Consultar</GhostLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- colecciones */}
      <section id="colecciones" className="bg-[color:var(--yana-paper-dim)]">
        <div className="mx-auto max-w-[1152px] px-5 py-24 sm:px-6 sm:py-32">
          <Reveal className="text-center">
            <Eyebrow>Colecciones</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[20ch] font-[family-name:var(--font-yana-serif)] text-[clamp(1.875rem,4.5vw,3rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--yana-ink)]">
              Tres caminos, una misma búsqueda.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {collections.map((entry, index) => (
              <Reveal
                key={entry.slug}
                as="article"
                delay={index * 100}
                className="relative aspect-[3/4] overflow-hidden rounded-[24px] bg-black"
              >
                <Parallax strength={0.1} className="absolute inset-x-0 -top-[8%] h-[116%]">
                  <Artwork
                    subject={entry}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="h-full w-full"
                  />
                </Parallax>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                />
                <div className="relative flex h-full flex-col justify-end p-7">
                  <h3 className="font-[family-name:var(--font-yana-serif)] text-[26px] font-semibold text-white">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.5] text-white/75">
                    {entry.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ sobre mí */}
      <section id="sobre-mi" className="bg-[color:var(--yana-paper)]">
        <div className="mx-auto grid max-w-[1152px] items-center gap-12 px-5 py-24 sm:px-6 sm:py-32 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[color:var(--yana-paper-dim)]">
              <Parallax strength={0.12} className="absolute inset-x-0 -top-[10%] h-[120%]">
                <Artwork
                  subject={portraitShot}
                  sizes="(min-width: 768px) 480px, 100vw"
                  className="h-full w-full"
                />
              </Parallax>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>La artista</Eyebrow>
            <h2 className="mt-5 font-[family-name:var(--font-yana-serif)] text-[clamp(1.875rem,4vw,2.75rem)] font-semibold tracking-[-0.01em] text-[color:var(--yana-ink)]">
              {artist.name}
            </h2>
            {artist.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-[16px] leading-[1.65] text-[color:var(--yana-ink-dim)]"
              >
                {paragraph}
              </p>
            ))}
            <p className="yana-script mt-7 text-[24px] text-[color:var(--yana-accent-dim)]">
              {artist.closing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------------- blog */}
      <section id="blog" className="border-t border-[color:var(--yana-hairline)] bg-[color:var(--yana-paper-dim)]">
        <div className="mx-auto max-w-[1152px] px-5 py-24 sm:px-6 sm:py-32">
          <Reveal className="text-center">
            <Eyebrow>Blog</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[20ch] font-[family-name:var(--font-yana-serif)] text-[clamp(1.875rem,4.5vw,3rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-[color:var(--yana-ink)]">
              Sobre el oficio y sobre la casa.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {blogPosts.map((post, index) => (
              <Reveal
                key={post.slug}
                delay={index * 90}
                className="rounded-[20px] border border-[color:var(--yana-hairline)] bg-[color:var(--yana-paper)] p-8"
              >
                <span className="inline-block rounded-full bg-[color:var(--yana-hairline)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--yana-ink-dim)]">
                  {post.status}
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-yana-serif)] text-[21px] font-semibold text-[color:var(--yana-ink)]">
                  {post.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-[color:var(--yana-ink-dim)]">
                  {post.excerpt}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- contacto */}
      <section
        id="contacto"
        className="bg-gradient-to-br from-[color:var(--yana-navy)] to-[color:var(--yana-navy-deep)] py-24 text-center sm:py-32"
      >
        <Reveal className="mx-auto max-w-[720px] px-5 sm:px-6">
          <Eyebrow>Contacto</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-[18ch] font-[family-name:var(--font-yana-serif)] text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-white">
            ¿Te gustó una obra? Escribime.
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-[1.6] text-[color:var(--yana-navy-ink)]">
            Contame qué obra te interesa y en qué espacio la imaginás. Te
            respondo a la brevedad.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <a
              href={artist.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--yana-accent)] px-7 py-3 text-[14px] font-medium uppercase tracking-[0.06em] text-white transition-opacity hover:opacity-85"
            >
              <WhatsAppIcon />
              Escribime por WhatsApp
            </a>
            <a
              href={artist.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-white/40 pb-0.5 text-[14px] text-white/85 transition-opacity hover:opacity-70"
            >
              {artist.instagramHandle}
            </a>
          </div>
          <p className="mt-6 text-[14px] text-[color:var(--yana-navy-ink-dim)]">
            {artist.whatsapp} · {artist.email}
          </p>
        </Reveal>

        {/* franja de condiciones */}
        <div className="mx-auto mt-20 grid max-w-[1152px] grid-cols-1 gap-y-8 border-t border-white/10 px-5 pt-12 sm:grid-cols-3 sm:px-6">
          {artist.footerTrust.map((item, index) => (
            <Reveal key={item.title} delay={index * 80} className="text-center">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[color:var(--yana-accent)]">
                {item.title}
              </p>
              <p className="mt-2 text-[14px] text-[color:var(--yana-navy-ink)]">{item.detail}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------- pie */}
      <footer className="bg-[color:var(--yana-navy-deep)] py-14 text-center">
        {/* El logo va sobre una placa clara: su tinta es navy y se perdería
            directamente contra el fondo oscuro del pie. */}
        <div className="inline-block rounded-2xl bg-[color:var(--yana-paper)] px-6 py-3">
          <Image
            src="/yana/logo-wordmark.jpg"
            alt={`${artist.name} — ${artist.brand}`}
            width={900}
            height={330}
            className="yana-logo h-9 w-auto"
          />
        </div>
        <p className="mx-auto mt-8 max-w-[46ch] px-5 text-[12px] leading-[1.6] text-[color:var(--yana-navy-ink-dim)]">
          © {new Date().getFullYear()} {artist.name}. Todas las obras y sus
          imágenes son propiedad de la artista.
        </p>
      </footer>
    </main>
  );
}
