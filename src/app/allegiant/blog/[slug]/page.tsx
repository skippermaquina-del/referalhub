import { blogPosts } from "@/data/blog";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";
import Link from "next/link";
import { notFound } from "next/navigation";

export const generateStaticParams = () => {
  return blogPosts.map((post) => ({ slug: post.slug }));
};

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title.en} — Allegiant Appliances`,
    description: post.excerpt.en,
    keywords: post.keywords.join(", "),
  };
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const content = post.content.en.split("\n").map((line, idx) => {
    if (line.startsWith("# ")) {
      return (
        <h1 key={idx} style={{ fontSize: 32, fontWeight: 700, margin: "40px 0 20px", color: "var(--al-text)" }}>
          {line.replace("# ", "")}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} style={{ fontSize: 24, fontWeight: 700, margin: "32px 0 16px", color: "var(--al-text)" }}>
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={idx} style={{ marginLeft: 24, marginBottom: 8, lineHeight: 1.6 }}>
          {line.replace("- ", "")}
        </li>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} style={{ fontSize: 18, fontWeight: 600, margin: "24px 0 12px", color: "var(--al-text)" }}>
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.trim() === "") {
      return <div key={idx} style={{ height: 16 }} />;
    }
    return (
      <p key={idx} style={{ margin: "16px 0", lineHeight: 1.7, fontSize: 16, color: "var(--al-muted)" }}>
        {line}
      </p>
    );
  });

  return (
    <div lang="en">
      <AllegiantShell lang="en">
        <Header lang="en" />
        <main>
          <article
            style={{
              maxWidth: 800,
              margin: "60px auto",
              padding: "0 20px",
            }}
          >
            <Link
              href="/allegiant/blog"
              style={{
                fontSize: 14,
                color: "var(--al-accent)",
                textDecoration: "none",
                marginBottom: 40,
                display: "inline-block",
              }}
            >
              ← Back to blog
            </Link>

            <header style={{ marginBottom: 40 }}>
              <h1 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 16px", color: "var(--al-text)" }}>
                {post.title.en}
              </h1>
              <div style={{ display: "flex", gap: 24, fontSize: 14, color: "var(--al-faint)" }}>
                <span>{post.publishedAt}</span>
                <span>{post.readTime} minute read</span>
              </div>
            </header>

            <div style={{ fontSize: 16, lineHeight: 1.8, color: "var(--al-muted)" }}>
              {content}
            </div>

            {post.brands.length > 0 && (
              <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid var(--al-line-3)" }}>
                <h3 style={{ fontSize: 14, color: "var(--al-faint)", textTransform: "uppercase", marginBottom: 12 }}>
                  Brands mentioned in this article
                </h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {post.brands.map((brand) => (
                    <span
                      key={brand}
                      style={{
                        fontSize: 13,
                        padding: "6px 12px",
                        backgroundColor: "var(--al-bg-2)",
                        borderRadius: 4,
                        color: "var(--al-accent)",
                        fontWeight: 600,
                      }}
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: 60,
                padding: 32,
                backgroundColor: "var(--al-bg-2)",
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 12px", color: "var(--al-text)" }}>
                Need help with your appliance?
              </h3>
              <p style={{ margin: "0 0 20px", color: "var(--al-muted)" }}>
                Contact Allegiant Appliances for professional repair and maintenance.
              </p>
              <a
                href="/allegiant#contact"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  backgroundColor: "var(--al-accent)",
                  color: "var(--al-bg)",
                  textDecoration: "none",
                  borderRadius: 4,
                  fontWeight: 600,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Book a repair
              </a>
            </div>
          </article>
        </main>
      </AllegiantShell>
    </div>
  );
}
