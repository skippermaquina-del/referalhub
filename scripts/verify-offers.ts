import { mkdir, writeFile } from "node:fs/promises";
import { offers, type Offer } from "../src/data/offers.ts";
import { askPerplexity } from "./lib/perplexity.ts";

type Status = "current" | "changed" | "ended" | "unclear";

interface Answer {
  status: Status;
  current_bonus: string;
  current_requirements: string;
  summary: string;
}

const schema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["current", "changed", "ended", "unclear"] },
    current_bonus: { type: "string" },
    current_requirements: { type: "string" },
    summary: { type: "string" },
  },
  required: ["status", "current_bonus", "current_requirements", "summary"],
  additionalProperties: false,
};

const systemPrompt = `You verify whether referral and sign-up bonuses advertised on a deals site are still accurate.

Only trust the provider's own site, its official help centre, or reputable deal trackers. Never guess: if the live sources do not clearly state the current bonus, answer with status "unclear".

Choose status:
- "current": the live bonus matches what the site lists (small wording differences are fine).
- "changed": the offer still exists but the amount or the requirements differ.
- "ended": the referral or sign-up bonus is no longer offered.
- "unclear": sources disagree or none of them state the current terms.

Keep "summary" to one or two plain sentences. Leave "current_bonus" and "current_requirements" as empty strings when the sources do not state them.`;

function buildUserPrompt(offer: Offer): string {
  const today = new Date().toISOString().slice(0, 10);
  return `Today is ${today}. Check the current new-customer referral/sign-up bonus for ${offer.name}.

Our site currently lists:
- Bonus: ${offer.bonus}
- Requirements: ${offer.requirements}

Is that still accurate today?`;
}

const ICONS: Record<Status, string> = {
  current: "✅",
  changed: "⚠️",
  ended: "❌",
  unclear: "❓",
};

async function main() {
  const sections: string[] = [];
  const needsAttention: string[] = [];

  for (const offer of offers) {
    console.log(`Checking ${offer.name}...`);

    try {
      const { data, sources } = await askPerplexity<Answer>({
        system: systemPrompt,
        user: buildUserPrompt(offer),
        schema,
        label: offer.name,
      });

      if (data.status !== "current") {
        needsAttention.push(`${ICONS[data.status]} ${offer.name} (${offer.slug})`);
      }

      const lines = [
        `## ${ICONS[data.status]} ${offer.name}`,
        "",
        `- **Status:** ${data.status}`,
        `- **Listed in offers.ts:** ${offer.bonus}`,
        `- **Found live:** ${data.current_bonus || "—"}`,
        `- **Live requirements:** ${data.current_requirements || "—"}`,
        "",
        data.summary,
      ];

      if (sources.length > 0) {
        lines.push("", "Sources:");
        lines.push(...sources.slice(0, 5).map((s) => `- [${s.title}](${s.url})`));
      }

      sections.push(lines.join("\n"));
    } catch (error) {
      console.error(`  Failed: ${(error as Error).message}`);
      sections.push(`## ❓ ${offer.name}\n\nCheck failed: ${(error as Error).message}`);
      needsAttention.push(`❓ ${offer.name} (${offer.slug}) — check failed`);
    }
  }

  const header = [
    `# Offer bonus audit — ${new Date().toISOString().slice(0, 10)}`,
    "",
    needsAttention.length === 0
      ? "Every listed bonus matched its live sources."
      : `${needsAttention.length} of ${offers.length} offers need a look:\n\n${needsAttention
          .map((line) => `- ${line}`)
          .join("\n")}`,
  ].join("\n");

  await mkdir("scripts/output", { recursive: true });
  const filename = `scripts/output/offer-audit-${new Date().toISOString().slice(0, 10)}.md`;
  await writeFile(filename, `${header}\n\n---\n\n${sections.join("\n\n---\n\n")}\n`);

  console.log(`\nDone. ${needsAttention.length} offer(s) need attention. Saved to ${filename}`);
}

main();
