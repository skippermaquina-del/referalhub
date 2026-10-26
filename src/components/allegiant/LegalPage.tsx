import type { Lang } from "@/data/allegiant";
import { paths } from "@/data/allegiant";
import { legalLabels, privacy, terms, type Doc } from "@/data/allegiant-legal";
import { AllegiantShell } from "./AllegiantShell";
import { Header } from "./Header";

/** Política de privacidad y términos: misma estructura, distinto texto. */
export function LegalPage({ lang, kind }: { lang: Lang; kind: "privacy" | "terms" }) {
  const doc: Doc = (kind === "privacy" ? privacy : terms)[lang];
  const L = legalLabels[lang];
  const p = paths(lang);
  const other = kind === "privacy" ? "terms" : "privacy";
  const otherHref = lang === "es" ? `/allegiant/es/${other}` : `/allegiant/${other}`;

  return (
    <div lang={lang}>
      <AllegiantShell lang={lang}>
        <Header lang={lang} />
        <main>
          <section className="al-section al-light al-tone-2">
            <article className="al-doc">
              <h1 className="al-h2">{doc.title}</h1>
              <p className="al-doc-updated">
                {L.updatedLabel}: {doc.updated}
              </p>
              <p className="al-doc-intro">{doc.intro}</p>
              {doc.sections.map((s, i) => (
                <section key={i} id={s.h.startsWith("7. SMS") ? "sms" : undefined}>
                  {s.h && <h2 className="al-doc-h">{s.h}</h2>}
                  {s.p?.map((t, j) => (
                    <p key={j}>{t}</p>
                  ))}
                  {s.ul && (
                    <ul>
                      {s.ul.map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <p className="al-doc-links">
                <a href={otherHref}>{other === "privacy" ? L.privacy : L.terms}</a>
                {" · "}
                <a href={p.home}>{L.backHome}</a>
              </p>
            </article>
          </section>
        </main>
      </AllegiantShell>
    </div>
  );
}
