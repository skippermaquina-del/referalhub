import { mkdir, writeFile } from "node:fs/promises";
import { offers, type Offer } from "../src/data/offers.ts";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY. Add it to .env.local first.");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateCaption(offer: Offer): Promise<string> {
  const prompt = `Escribí un caption corto y casual para Instagram/Facebook (en español, tono informal "vos") promocionando esta oferta de referido. Mencioná el bonus, un emoji relevante, terminá con "Link en mi bio 👆" (no incluyas la URL real), y agregá 3-5 hashtags relevantes.

Oferta: ${offer.name}
Bonus: ${offer.bonus}
Descripción: ${offer.description}
Requisitos: ${offer.requirements}`;

  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      },
    );

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "(sin respuesta)";
    }

    const isRetryable = res.status === 503 || res.status === 429;
    const body = await res.text();
    if (!isRetryable || attempt === maxAttempts) {
      throw new Error(`Gemini API error for ${offer.name}: ${res.status} ${body}`);
    }

    const backoffMs = 2000 * attempt;
    console.log(`  ${offer.name}: ${res.status}, reintentando en ${backoffMs / 1000}s...`);
    await sleep(backoffMs);
  }

  throw new Error(`Unreachable`);
}

async function main() {
  const readyOffers = offers.filter((offer) => offer.referralUrl !== "REPLACE_ME");
  const sections: string[] = [];

  for (const offer of readyOffers) {
    console.log(`Generando caption para ${offer.name}...`);
    const caption = await generateCaption(offer);
    sections.push(`## ${offer.name}\n\n${caption}`);
  }

  await mkdir("scripts/output", { recursive: true });
  const filename = `scripts/output/social-posts-${new Date().toISOString().slice(0, 10)}.md`;
  await writeFile(filename, sections.join("\n\n---\n\n") + "\n");
  console.log(`\nListo! Guardado en ${filename}`);
}

main();
