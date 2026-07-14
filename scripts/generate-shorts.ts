import { mkdir, writeFile } from "node:fs/promises";
import { offers, type Offer } from "../src/data/offers.ts";
import { generateText } from "./lib/gemini.ts";

function buildPrompt(offer: Offer): string {
  return `Escribí un guion para un YouTube Short (30-45 segundos) sobre esta oferta de referido. Es para hablar a cámara, en español, tono cercano y natural, primera persona, como si le contaras algo útil a un amigo (no un aviso corporativo).

Estructura exacta:
GANCHO (0-3s): una frase que enganche en los primeros 3 segundos.
DESARROLLO: explicá el beneficio, el bonus y qué hay que hacer para conseguirlo.
CIERRE: llamado a la acción mencionando "el link está en mi bio" (no incluyas la URL real).

Agregá sugerencias de texto en pantalla entre corchetes, ej: [TEXTO EN PANTALLA: $100 gratis], en los momentos clave. Al final agregá una línea "TÍTULO SUGERIDO:" con un título corto para el video y una línea "HASHTAGS:" con 3-5 hashtags.

Oferta: ${offer.name}
Bonus: ${offer.bonus}
Descripción: ${offer.description}
Requisitos: ${offer.requirements}`;
}

async function main() {
  const readyOffers = offers.filter((offer) => offer.referralUrl !== "REPLACE_ME");
  const sections: string[] = [];

  for (const offer of readyOffers) {
    console.log(`Generando guion para ${offer.name}...`);
    const script = await generateText(buildPrompt(offer), offer.name);
    sections.push(`## ${offer.name}\n\n${script}`);
  }

  await mkdir("scripts/output", { recursive: true });
  const filename = `scripts/output/youtube-shorts-${new Date().toISOString().slice(0, 10)}.md`;
  await writeFile(filename, sections.join("\n\n---\n\n") + "\n");
  console.log(`\nListo! Guardado en ${filename}`);
}

main();
