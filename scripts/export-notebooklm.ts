import { mkdir, writeFile } from "node:fs/promises";
import { categories } from "../src/data/offers.ts";
import { buildCorpus } from "../src/lib/notebooklm.ts";

/**
 * Writes the same documents `/notebooklm.txt` serves to `public/notebooklm/`,
 * for when you'd rather upload files to NotebookLM than point it at a URL
 * (local dev, a protected preview deployment, or a snapshot you want to keep).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://referalhub.vercel.app";
const OUT_DIR = "public/notebooklm";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const generatedAt = new Date();

  const documents = [
    { file: "referralhub-all-offers.md", corpus: buildCorpus({ siteUrl: SITE_URL, generatedAt }) },
    ...categories.map((category) => ({
      file: `referralhub-${category.id}.md`,
      corpus: buildCorpus({ siteUrl: SITE_URL, category: category.id, generatedAt }),
    })),
  ];

  for (const { file, corpus } of documents) {
    await writeFile(`${OUT_DIR}/${file}`, corpus);
    console.log(`  ${OUT_DIR}/${file} (${corpus.split("\n").length} lines)`);
  }

  console.log(
    `\nListo! ${documents.length} sources in ${OUT_DIR}/ — upload them in NotebookLM with` +
      ` "Add source", or point it at ${SITE_URL}/notebooklm.txt instead.`,
  );
}

main();
