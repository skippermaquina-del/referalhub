import { Footer, Header } from "@/components/superhman/HomePage";
import type { Lang } from "@/data/superhman";
import { privacy } from "@/data/superhman-legal";

export function PrivacyPage({ lang }: { lang: Lang }) {
  const doc = privacy[lang];
  return (
    <div className="sh-wrap">
      <Header lang={lang} />
      <article className="sh-legal">
        <h1>{doc.title}</h1>
        <p className="upd">{doc.updated}</p>
        <p className="intro">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((text) => (
              <p key={text.slice(0, 40)}>{text}</p>
            ))}
          </section>
        ))}
      </article>
      <Footer lang={lang} />
    </div>
  );
}
