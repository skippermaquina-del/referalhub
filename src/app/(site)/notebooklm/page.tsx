import type { Metadata } from "next";
import { headers } from "next/headers";
import { categories, offers } from "@/data/offers";
import { isLive, SOURCE_PATH } from "@/lib/notebooklm";
import { CopyField } from "@/components/CopyField";

export const metadata: Metadata = {
  title: "Connect ReferralHub to NotebookLM",
  description:
    "Add the ReferralHub offer catalog to a NotebookLM notebook as a source that stays in sync with the site.",
  robots: { index: false },
};

const promptIdeas = [
  "Which offers pay out fastest, and what does each one require?",
  "Compare the banking bonuses and tell me which needs the smallest direct deposit.",
  "Group every offer by how much effort the requirements take.",
  "Draft a short post about the three biggest cashback-app bonuses.",
];

export default async function NotebookLmPage() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const protocol =
    headerList.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const liveCount = offers.filter(isLive).length;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Connect this catalog to NotebookLM</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        NotebookLM has no public API for pushing data into a notebook, so the connection runs
        the other way: this site publishes its whole catalog as one clean text document that
        NotebookLM can pull in as a source. It covers all {offers.length} offers ({liveCount}{" "}
        with a live referral link) and is generated from the same data the site renders, so it
        never drifts.
      </p>

      <h2 className="mt-10 text-xl font-semibold">1. Add the source</h2>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        In NotebookLM, create a notebook, choose <strong>Add source → Website</strong>, and paste
        this URL:
      </p>
      <div className="mt-3">
        <CopyField value={`${origin}${SOURCE_PATH}`} />
      </div>

      <h2 className="mt-10 text-xl font-semibold">2. Or split it by category</h2>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        One source per category gives tighter citations when you ask about a single vertical.
        Add any of these instead of — or alongside — the full catalog:
      </p>
      <div className="mt-3 space-y-2">
        {categories.map((category) => (
          <div key={category.id}>
            <p className="text-xs font-medium text-neutral-500">{category.label}</p>
            <div className="mt-1">
              <CopyField value={`${origin}${SOURCE_PATH}?category=${category.id}`} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">3. Keep it fresh</h2>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        NotebookLM snapshots a website source when you add it. After you edit{" "}
        <code className="font-mono text-xs">src/data/offers.ts</code> and redeploy, click the
        source in NotebookLM and refresh it to pull the new catalog.
      </p>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        If NotebookLM can&apos;t reach the URL — a local dev server, or a deployment behind
        protection — run <code className="font-mono text-xs">npm run export:notebooklm</code>{" "}
        instead. It writes the same documents to{" "}
        <code className="font-mono text-xs">public/notebooklm/</code> so you can upload them as
        files.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Things to ask once it&apos;s in</h2>
      <ul className="mt-3 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {promptIdeas.map((idea) => (
          <li key={idea} className="rounded-md bg-neutral-500/5 px-3 py-2">
            {idea}
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-neutral-500">
        The document includes the affiliate disclosure and a reminder that bonus terms change,
        so anything NotebookLM writes from it carries that context too.
      </p>
    </main>
  );
}
