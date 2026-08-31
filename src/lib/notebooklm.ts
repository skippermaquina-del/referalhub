import { categories, offers, type Category, type Offer } from "../data/offers.ts";

/**
 * NotebookLM has no public API for pushing sources into a notebook, so the way
 * to "connect" this site is to hand NotebookLM something it can ingest: one
 * clean, self-describing Markdown document per catalog (or per category).
 *
 * The same builder feeds two consumers:
 *   - `/notebooklm.txt` — a live URL you add as a Website source
 *   - `npm run export:notebooklm` — files under `public/notebooklm/` you can
 *     upload directly when you'd rather not rely on the fetcher
 */

const PENDING_URL = "REPLACE_ME";

export const SOURCE_PATH = "/notebooklm.txt";

export interface CorpusOptions {
  /** Absolute origin of the site, e.g. `https://referalhub.vercel.app`. */
  siteUrl: string;
  /** Limit the document to one category. Omit for the whole catalog. */
  category?: Category;
  /** Pinned so an exported file and the live route can agree on a date. */
  generatedAt?: Date;
}

export function isLive(offer: Offer): boolean {
  return offer.referralUrl !== PENDING_URL;
}

function categoryLabel(id: Category): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

function offerSection(offer: Offer, siteUrl: string): string {
  const lines = [
    `### ${offer.name} — ${offer.bonus}`,
    "",
    `- Offer ID (slug): ${offer.slug}`,
    `- Category: ${categoryLabel(offer.category)} (${offer.category})`,
    `- Bonus: ${offer.bonus}`,
    `- Status: ${
      isLive(offer)
        ? "live — the referral link is published and clickable on the site"
        : "pending — no referral link yet, so the site shows an \"Add your referral link\" badge instead of a button"
    }`,
  ];

  if (isLive(offer)) {
    lines.push(`- Link on ReferralHub: ${siteUrl}/go/${offer.slug}`);
  }

  lines.push(
    `- Featured on the homepage: ${offer.featured ? "yes" : "no"}`,
    "",
    `What it is: ${offer.description}`,
    "",
    `How to earn the bonus: ${offer.requirements}`,
  );

  return lines.join("\n");
}

function summaryTable(list: Offer[]): string {
  const rows = list.map(
    (offer) =>
      `| ${offer.name} | ${categoryLabel(offer.category)} | ${offer.bonus} | ${
        isLive(offer) ? "live" : "pending"
      } |`,
  );

  return [
    "| Offer | Category | Bonus | Status |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

export function buildCorpus({ siteUrl, category, generatedAt }: CorpusOptions): string {
  const scoped = category ? offers.filter((offer) => offer.category === category) : offers;
  const visibleCategories = category ? categories.filter((c) => c.id === category) : categories;
  const liveCount = scoped.filter(isLive).length;
  const date = (generatedAt ?? new Date()).toISOString().slice(0, 10);

  const title = category
    ? `ReferralHub — ${categoryLabel(category)} offers`
    : "ReferralHub — full offer catalog";

  const parts: string[] = [
    `# ${title}`,
    "",
    [
      `Generated: ${date}`,
      `Site: ${siteUrl}`,
      `Live source: ${siteUrl}${SOURCE_PATH}${category ? `?category=${category}` : ""}`,
    ].join("  \n"),
    "",
    "## About this document",
    "",
    [
      "ReferralHub is a curated hub of referral and cashback offers — banking and neobanks,",
      "credit cards, investing and crypto, and everyday cashback apps. This document is",
      "generated automatically from the site's offer data so it always matches what visitors",
      "see. It is meant to be used as a NotebookLM source.",
    ].join(" "),
    "",
    "Terms used below:",
    "",
    "- **Bonus** — what the person signing up (or ReferralHub) gets for a completed referral.",
    "- **Requirements** — what has to happen before the bonus pays out, as published by the company.",
    "- **Live** — the referral link is in place, so the offer is clickable on the site.",
    "- **Pending** — no referral link yet; the offer is listed but cannot be signed up for here.",
    "- **Slug** — the short ID used in the site's URLs (`/go/<slug>` redirects to the referral link).",
    "",
    "## Catalog at a glance",
    "",
    `- Offers in this document: ${scoped.length}`,
    `- Live: ${liveCount}`,
    `- Pending a referral link: ${scoped.length - liveCount}`,
  ];

  if (!category) {
    for (const cat of categories) {
      const count = offers.filter((offer) => offer.category === cat.id).length;
      parts.push(`- ${cat.label}: ${count}`);
    }
  }

  parts.push("", summaryTable(scoped), "");

  for (const cat of visibleCategories) {
    const inCategory = scoped.filter((offer) => offer.category === cat.id);
    if (inCategory.length === 0) continue;

    parts.push(`## ${cat.label}`, "", cat.blurb, "");
    for (const offer of inCategory) {
      parts.push(offerSection(offer, siteUrl), "");
    }
  }

  parts.push(
    "## Affiliate disclosure",
    "",
    [
      "ReferralHub participates in referral and affiliate programs offered by the banks, card",
      "issuers, brokerages, and apps listed above, and may earn a commission or referral bonus",
      "when someone signs up through one of its links, at no additional cost to that person.",
      "Descriptions and opinions are ReferralHub's own and are not reviewed or endorsed by the",
      "companies mentioned.",
    ].join(" "),
    "",
    [
      "Bonus amounts, terms, and eligibility are set by each company and change often — the",
      "figures here are a snapshot from the date at the top of this document and should be",
      "confirmed on the company's official site. Nothing here is financial advice.",
    ].join(" "),
    "",
  );

  return parts.join("\n");
}
