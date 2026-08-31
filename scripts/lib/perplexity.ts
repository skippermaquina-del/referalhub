const apiKey = process.env.PERPLEXITY_API_KEY;
const model = process.env.PERPLEXITY_MODEL ?? "sonar";

if (!apiKey) {
  console.error("Missing PERPLEXITY_API_KEY. Add it to .env.local first.");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Source {
  title: string;
  url: string;
}

export interface Answer<T> {
  data: T;
  sources: Source[];
}

/**
 * Same shape as src/lib/perplexity.ts, kept standalone so the generate/verify
 * scripts can run under `node --env-file` without the `@/` path alias — the
 * scripts/lib/gemini.ts split works the same way.
 */
export async function askPerplexity<T>(options: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  label: string;
}): Promise<Answer<T>> {
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: options.system },
          { role: "user", content: options.user },
        ],
        response_format: { type: "json_schema", json_schema: { schema: options.schema } },
        search_recency_filter: "year",
      }),
    });

    if (res.ok) {
      const payload = await res.json();
      const content = payload.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error(`Perplexity returned an empty response for ${options.label}`);
      }

      const results: { title?: string; url?: string }[] = payload.search_results ?? [];
      const sources: Source[] = results.length
        ? results
            .filter((r): r is { url: string; title?: string } => Boolean(r.url))
            .map((r) => ({ title: r.title?.trim() || new URL(r.url).hostname, url: r.url }))
        : (payload.citations ?? []).map((url: string) => ({
            title: new URL(url).hostname,
            url,
          }));

      return { data: JSON.parse(content) as T, sources };
    }

    const retryable = res.status === 429 || res.status >= 500;
    const body = await res.text();
    if (!retryable || attempt === maxAttempts) {
      throw new Error(`Perplexity API error for ${options.label}: ${res.status} ${body}`);
    }

    const backoffMs = 2000 * attempt;
    console.log(`  ${options.label}: ${res.status}, retrying in ${backoffMs / 1000}s...`);
    await sleep(backoffMs);
  }

  throw new Error("Unreachable");
}
