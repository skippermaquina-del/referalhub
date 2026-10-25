"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { paths, type Lang } from "@/data/allegiant";

export function BlogList({ lang }: { lang: Lang }) {
  const p = paths(lang);

  const labels = {
    en: {
      title: "Repair tips & guides",
      subtitle: "Learn how to care for your appliances and troubleshoot common problems.",
      readMore: "Read article",
      minutes: "min read",
    },
    es: {
      title: "Consejos y guías de reparación",
      subtitle: "Aprende cómo cuidar tus electrodomésticos y solucionar problemas comunes.",
      readMore: "Leer artículo",
      minutes: "min de lectura",
    },
  };

  const t = labels[lang];
  const locale = lang === "es" ? "es" : "en";

  return (
    <section className="al-blog-list" style={{ padding: "80px 20px" }}>
      <div className="al-grid12">
        <div style={{ gridColumn: "1 / span 12", marginBottom: 56 }}>
          <h2 className="al-h2">{t.title}</h2>
          <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--al-muted)", marginTop: 16, maxWidth: 600 }}>
            {t.subtitle}
          </p>
        </div>

        {blogPosts.map((post) => (
          <article
            key={post.slug}
            style={{
              gridColumn: "1 / span 12",
              paddingBottom: 40,
              borderBottom: "1px solid var(--al-line-3)",
              marginBottom: 40,
            }}
          >
            <Link href={`${p.home}/blog/${post.slug}`} style={{ textDecoration: "none" }}>
              <h3
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  margin: "0 0 12px",
                  color: "var(--al-text)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--al-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--al-text)";
                }}
              >
                {post.title[locale]}
              </h3>
            </Link>

            <div style={{ display: "flex", gap: 24, marginBottom: 16, fontSize: 14, color: "var(--al-faint)" }}>
              <span>{post.publishedAt}</span>
              <span>{post.readTime} {t.minutes}</span>
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--al-muted)", margin: "0 0 20px", maxWidth: 800 }}>
              {post.excerpt[locale]}
            </p>

            {post.brands.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {post.brands.slice(0, 3).map((brand) => (
                  <span
                    key={brand}
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                      backgroundColor: "var(--al-bg-2)",
                      borderRadius: 4,
                      color: "var(--al-accent)",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            )}

            <Link
              href={`${p.home}/blog/${post.slug}`}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--al-accent)",
                textDecoration: "none",
                display: "inline-block",
                borderBottom: "2px solid var(--al-accent)",
              }}
            >
              {t.readMore} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
