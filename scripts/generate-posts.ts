import { mkdir, writeFile } from "node:fs/promises";
import { offers, type Offer } from "../src/data/offers.ts";
import { generateText } from "./lib/gemini.ts";

function buildPrompt(offer: Offer): string {
  return `Escribí un caption corto y casual para Instagram/Facebook (en español, tono informal "vos") promocionando esta oferta de referido. Mencioná el bonus, un emoji relevante, terminá con "Link en mi bio 👆" (no incluyas la URL real), y agregá 3-5 hashtags relevantes.

Oferta: ${offer.name}
Bonus: ${offer.bonus}
Descripción: ${offer.description}
Requisitos: ${offer.requirements}`;
}

async function main() {
  const readyOffers = offers.filter((offer) => offer.referralUrl !== "REPLACE_ME");
  const sections: string[] = [];

  for (const offer of readyOffers) {
    console.log(`Generando caption para ${offer.name}...`);
    const caption = await generateText(buildPrompt(offer), offer.name);
    sections.push(`## ${offer.name}\n\n${caption}`);
  }

  await mkdir("scripts/output", { recursive: true });
  const filename = `scripts/output/social-posts-${new Date().toISOString().slice(0, 10)}.md`;
  await writeFile(filename, sections.join("\n\n---\n\n") + "\n");
  console.log(`\nListo! Guardado en ${filename}`);
}

main();
