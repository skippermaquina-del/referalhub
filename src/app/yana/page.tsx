import { Artwork } from "@/components/yana/Artwork";
import { Reveal } from "@/components/yana/Reveal";
import {
  artist,
  exhibitions,
  process,
  series,
  studioShot,
  works,
} from "@/data/yana";

const [featured, ...rest] = works;

/** Etiqueta pequeña en versalitas que abre cada sección. */
function Eyebrow({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <p
      className={`text-[12px] font-medium uppercase tracking-[0.24em] ${
        tone === "dark" ? "text-white/55" : "text-[#6e6e73]"
      }`}
    >
      {children}
    </p>
  );
}

/** Enlace azul con chevron, el patrón de llamada a la acción de Apple. */
function ChevronLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1 text-[color:var(--yana-accent)] transition-opacity hover:opacity-75"
    >
      {children}
      <span
        aria-hidden
        className="translate-y-[-1px] transition-transform duration-300 group-hover:translate-x-[3px]"
      >
        ›
      </span>
    </a>
  );
}

export default function YanaPage() {
  return (
    <main>
      {/* ---------------------------------------------------------- portada */}
      <section
        id="portada"
        className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
      >
        <div className="absolute inset-0">
          <Artwork
            subject={featured}
            priority
            sizes="100vw"
            className="h-full w-full"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"
        />

        <div className="relative mx-auto w-full max-w-[1024px] px-5 pb-28 pt-32 text-center sm:px-6">
          <Eyebrow>{artist.role}</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.75rem,8.5vw,6rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
            {artist.headline}
          </h1>
          <p className="mx-auto mt-7 max-w-[38ch] text-[clamp(1.0625rem,2.2vw,1.375rem)] leading-[1.45] text-white/70">
            {artist.subhead}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 text-[clamp(1.0625rem,2vw,1.25rem)]">
            <ChevronLink href="#obra">Ver la obra</ChevronLink>
            <ChevronLink href="#contacto">Consultas</ChevronLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ cifras */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-[1024px] grid-cols-2 gap-y-12 px-5 py-16 sm:px-6 md:grid-cols-4">
          {artist.facts.map((fact, index) => (
            <Reveal key={fact.label} delay={index * 90} className="text-center">
              <p className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-none tracking-[-0.03em]">
                {fact.value}
              </p>
              <p className="mt-3 text-[13px] text-white/55">{fact.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- obra */}
      <section id="obra" className="bg-[#f5f5f7] text-[#1d1d1f]">
        <div className="mx-auto max-w-[1024px] px-5 py-24 sm:px-6 sm:py-32">
          <Reveal className="text-center">
            <Eyebrow tone="light">Obra destacada</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[18ch] text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.032em]">
              {featured.title}
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-[1.5] text-[#6e6e73]">
              {featured.note}
            </p>
          </Reveal>

          <Reveal className="mt-14">
            <figure>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-black">
                <Artwork
                  subject={featured}
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="h-full w-full"
                />
              </div>
              <figcaption className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] bg-black/10 sm:grid-cols-3">
                {[
                  { label: "Técnica", value: featured.medium },
                  { label: "Medidas", value: featured.dimensions },
                  { label: "Año", value: String(featured.year) },
                ].map((spec) => (
                  <div key={spec.label} className="bg-[#f5f5f7] px-6 py-6 text-center">
                    <p className="text-[12px] uppercase tracking-[0.16em] text-[#6e6e73]">
                      {spec.label}
                    </p>
                    <p className="mt-2 text-[17px] font-medium">{spec.value}</p>
                  </div>
                ))}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal className="mt-28">
            <h3 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold tracking-[-0.03em]">
              Obra reciente
            </h3>
          </Reveal>

          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {rest.map((work, index) => (
              <Reveal
                key={work.slug}
                as="li"
                delay={(index % 2) * 110}
                className="group overflow-hidden rounded-[22px] bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Artwork
                    subject={work}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="px-6 py-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="text-[19px] font-semibold tracking-[-0.02em]">
                      {work.title}
                    </h4>
                    <span className="shrink-0 text-[14px] text-[#6e6e73]">
                      {work.year}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[14px] text-[#6e6e73]">
                    {work.medium} · {work.dimensions}
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-[13px] text-[#6e6e73]">
                    <span
                      aria-hidden
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        work.available ? "bg-[#1d9e4b]" : "bg-black/25"
                      }`}
                    />
                    {work.available ? "Disponible" : "Colección privada"}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ series */}
      <section id="series" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1024px] px-5 sm:px-6">
          <Reveal>
            <Eyebrow>Series</Eyebrow>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.032em]">
              Tres conjuntos, un mismo intervalo de luz.
            </h2>
          </Reveal>
        </div>

        <div className="yana-scroller mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-1024px)/2))] pb-4">
          {series.map((entry) => (
            <article
              key={entry.slug}
              className="relative aspect-[3/4] w-[78vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[28px] bg-black"
            >
              <Artwork
                subject={entry}
                sizes="(min-width: 640px) 420px, 78vw"
                className="absolute inset-0 h-full w-full"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"
              />
              <div className="relative flex h-full flex-col justify-end p-8">
                <p className="text-[12px] uppercase tracking-[0.2em] text-white/60">
                  {entry.years}
                </p>
                <h3 className="mt-3 text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  {entry.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.45] text-white/70">
                  {entry.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- proceso */}
      <section id="proceso" className="border-t border-white/10 py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1024px] gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>El proceso</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.032em]">
              Entre seis y nueve meses por cuadro.
            </h2>
            <p className="mt-5 max-w-[42ch] text-[17px] leading-[1.55] text-white/60">
              Nada de lo que ocurre en el estudio es rápido, y esa lentitud es
              parte del material.
            </p>
          </div>

          <ol>
            {process.map((item, index) => (
              <Reveal
                key={item.step}
                as="li"
                delay={index * 70}
                className="border-t border-white/10 py-8 first:border-t-0 first:pt-0 lg:first:pt-8 lg:first:border-t"
              >
                <p className="text-[13px] font-medium tabular-nums text-[color:var(--yana-accent)]">
                  {item.step}
                </p>
                <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[17px] leading-[1.55] text-white/60">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ exposiciones */}
      <section id="exposiciones" className="bg-[#f5f5f7] text-[#1d1d1f]">
        <div className="mx-auto max-w-[1024px] px-5 py-24 sm:px-6 sm:py-32">
          <Reveal>
            <Eyebrow tone="light">Trayectoria</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.032em]">
              Exposiciones y colecciones.
            </h2>
          </Reveal>

          <ul className="mt-12 border-t border-black/10">
            {exhibitions.map((exhibition, index) => (
              <Reveal
                key={`${exhibition.year}-${exhibition.title}`}
                as="li"
                delay={index * 55}
                className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-5 border-b border-black/10 py-6 sm:grid-cols-[5rem_1fr_auto] sm:gap-x-8"
              >
                <span className="text-[15px] tabular-nums text-[#6e6e73]">
                  {exhibition.year}
                </span>
                <div>
                  <h3 className="text-[19px] font-medium tracking-[-0.02em]">
                    {exhibition.title}
                  </h3>
                  <p className="mt-1 text-[15px] text-[#6e6e73]">
                    {exhibition.venue} · {exhibition.city}
                  </p>
                </div>
                <span className="col-start-2 mt-3 justify-self-start rounded-full border border-black/15 px-3 py-1 text-[12px] text-[#6e6e73] sm:col-start-3 sm:mt-0 sm:justify-self-end">
                  {exhibition.kind}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------- estudio */}
      <section id="estudio" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1024px] items-center gap-12 px-5 sm:px-6 md:grid-cols-2 md:gap-16">
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-black">
              <Artwork
                subject={studioShot}
                sizes="(min-width: 768px) 480px, 100vw"
                className="h-full w-full"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>El estudio</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.032em]">
              {artist.name}
            </h2>
            {artist.bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="mt-5 text-[17px] leading-[1.55] text-white/60"
              >
                {paragraph}
              </p>
            ))}
            <p className="mt-8 text-[15px] text-white/45">{artist.location}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- contacto */}
      <section
        id="contacto"
        className="border-t border-white/10 py-24 text-center sm:py-32"
      >
        <Reveal className="mx-auto max-w-[1024px] px-5 sm:px-6">
          <Eyebrow>Consultas</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-[16ch] text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            ¿Le interesa una pieza?
          </h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-[17px] leading-[1.55] text-white/60">
            Disponibilidad, precios y visitas al estudio con cita previa.
            Respuesta en dos o tres días laborables.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            <a
              href={`mailto:${artist.email}`}
              className="rounded-full bg-[color:var(--yana-accent)] px-7 py-3 text-[17px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Escribir al estudio
            </a>
            <a
              href={artist.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[17px] text-[color:var(--yana-accent)] transition-opacity hover:opacity-75"
            >
              Instagram
            </a>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- pie */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-[1024px] px-5 py-12 text-[12px] leading-[1.6] text-white/40 sm:px-6">
          <p>
            © {new Date().getFullYear()} {artist.name}. Todas las obras
            reproducidas con permiso de la artista.
          </p>
          <p className="mt-2">
            Maqueta de demostración: los textos, las obras y las imágenes son
            contenido de marcador de posición y deben sustituirse por material
            real antes de publicar.
          </p>
        </div>
      </footer>
    </main>
  );
}
