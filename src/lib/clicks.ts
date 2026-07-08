const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Click counts are stored in Upstash Redis (free tier) so they survive
 * across serverless invocations on Vercel. Without the two env vars set,
 * this silently no-ops so local dev and builds work with zero setup —
 * see README for how to enable real counting.
 */
export async function recordClick(slug: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;

  try {
    await fetch(`${UPSTASH_URL}/incr/clicks:${slug}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
  } catch {
    // Tracking must never block the redirect.
  }
}

export async function getClickCounts(slugs: string[]): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  if (!UPSTASH_URL || !UPSTASH_TOKEN || slugs.length === 0) {
    return counts;
  }

  try {
    const res = await fetch(`${UPSTASH_URL}/mget/${slugs.map((s) => `clicks:${s}`).join("/")}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    const data = await res.json();
    (data.result as (string | null)[]).forEach((value, i) => {
      counts[slugs[i]] = value ? Number(value) : 0;
    });
  } catch {
    // Leave counts empty if Redis is unreachable.
  }

  return counts;
}

export function isTrackingConfigured(): boolean {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}
