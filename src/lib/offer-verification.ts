import type { Offer } from "../data/offers";
import { askPerplexity, isPerplexityConfigured, type PerplexitySource } from "./perplexity";

/** How long a verification result is reused before we pay for another search. */
const CACHE_TTL_SECONDS = 12 * 60 * 60;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type FreshnessStatus = "current" | "changed" | "ended" | "unclear";

export interface OfferVerification {
  slug: string;
  status: FreshnessStatus;
  /** What `src/data/offers.ts` claims today. */
  listedBonus: string;
  /** What Perplexity found advertised right now, if it could tell. */
  currentBonus: string | null;
  currentRequirements: string | null;
  summary: string;
  sources: PerplexitySource[];
  checkedAt: string;
}

interface ModelAnswer {
  status: FreshnessStatus;
  current_bonus: string;
  current_requirements: string;
  summary: string;
}

const answerSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["current", "changed", "ended", "unclear"] },
    current_bonus: { type: "string" },
    current_requirements: { type: "string" },
    summary: { type: "string" },
  },
  required: ["status", "current_bonus", "current_requirements", "summary"],
  additionalProperties: false,
} as const;

const systemPrompt = `You verify whether referral and sign-up bonuses advertised on a deals site are still accurate.

Only trust the provider's own site, its official help centre, or reputable deal trackers. Never guess: if the live sources do not clearly state the current bonus, answer with status "unclear".

Choose status:
- "current": the live bonus matches what the site lists (small wording differences are fine).
- "changed": the offer still exists but the amount or the requirements differ.
- "ended": the referral or sign-up bonus is no longer offered.
- "unclear": sources disagree or none of them state the current terms.

Keep "summary" to one or two plain sentences a visitor would understand. Leave "current_bonus" and "current_requirements" as empty strings when the sources do not state them.`;

function buildUserPrompt(offer: Offer): string {
  const today = new Date().toISOString().slice(0, 10);
  return `Today is ${today}. Check the current new-customer referral/sign-up bonus for ${offer.name}.

Our site currently lists:
- Bonus: ${offer.bonus}
- Requirements: ${offer.requirements}

Is that still accurate today?`;
}

function cacheKey(slug: string): string {
  return `bonus-check:${slug}`;
}

/** In-memory fallback so this works in local dev without Upstash configured. */
const memoryCache = new Map<string, { expiresAt: number; value: OfferVerification }>();

async function readCache(slug: string): Promise<OfferVerification | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    const hit = memoryCache.get(slug);
    if (!hit || hit.expiresAt < Date.now()) return null;
    return hit.value;
  }

  try {
    const res = await fetch(`${UPSTASH_URL}/get/${cacheKey(slug)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    const body = await res.json();
    return body.result ? (JSON.parse(body.result) as OfferVerification) : null;
  } catch {
    return null;
  }
}

async function writeCache(slug: string, value: OfferVerification): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    memoryCache.set(slug, { expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000, value });
    return;
  }

  try {
    await fetch(`${UPSTASH_URL}/set/${cacheKey(slug)}?EX=${CACHE_TTL_SECONDS}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      body: JSON.stringify(value),
      cache: "no-store",
    });
  } catch {
    // A missed cache write only costs an extra search later.
  }
}

/** Runs a live check, ignoring any cached result. */
export async function checkOffer(offer: Offer): Promise<OfferVerification> {
  const { data, sources } = await askPerplexity<ModelAnswer>({
    system: systemPrompt,
    user: buildUserPrompt(offer),
    schema: answerSchema,
    recency: "year",
  });

  return {
    slug: offer.slug,
    status: data.status,
    listedBonus: offer.bonus,
    currentBonus: data.current_bonus.trim() || null,
    currentRequirements: data.current_requirements.trim() || null,
    summary: data.summary.trim(),
    sources,
    checkedAt: new Date().toISOString(),
  };
}

/** Cached check — what the site should call, so one search serves every visitor. */
export async function verifyOffer(offer: Offer): Promise<OfferVerification> {
  const cached = await readCache(offer.slug);
  if (cached) return cached;

  const result = await checkOffer(offer);
  await writeCache(offer.slug, result);
  return result;
}

export { isPerplexityConfigured };
