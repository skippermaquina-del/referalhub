const API_URL = "https://api.perplexity.ai/chat/completions";
const MODEL = process.env.PERPLEXITY_MODEL ?? "sonar";

export interface PerplexitySource {
  title: string;
  url: string;
  /** Publication date reported by Perplexity, when it knows one. */
  date: string | null;
}

export interface PerplexityAnswer<T> {
  data: T;
  sources: PerplexitySource[];
}

export interface AskOptions {
  system: string;
  user: string;
  /** JSON schema the model must answer with. */
  schema: Record<string, unknown>;
  /** Restrict search to results published within this window. */
  recency?: "day" | "week" | "month" | "year";
  /** Restrict search to these domains (Perplexity allows up to 10). */
  domains?: string[];
  signal?: AbortSignal;
}

interface PerplexityResponse {
  choices?: { message?: { content?: string } }[];
  search_results?: { title?: string; url?: string; date?: string | null }[];
  citations?: string[];
}

export function isPerplexityConfigured(): boolean {
  return Boolean(process.env.PERPLEXITY_API_KEY);
}

function normalizeSources(data: PerplexityResponse): PerplexitySource[] {
  // Newer responses carry `search_results` with titles; older ones only have
  // a flat `citations` array of URLs. Accept either.
  if (data.search_results?.length) {
    return data.search_results
      .filter((result): result is { url: string; title?: string; date?: string | null } =>
        Boolean(result.url),
      )
      .map((result) => ({
        title: result.title?.trim() || new URL(result.url).hostname,
        url: result.url,
        date: result.date ?? null,
      }));
  }

  return (data.citations ?? []).map((url) => ({
    title: new URL(url).hostname,
    url,
    date: null,
  }));
}

/**
 * Ask Perplexity a question that must be answered from live web sources, and
 * get back structured JSON plus the pages it read. Throws if the key is
 * missing — callers should gate on `isPerplexityConfigured()` first.
 */
export async function askPerplexity<T>(options: AskOptions): Promise<PerplexityAnswer<T>> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing PERPLEXITY_API_KEY");
  }

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: options.system },
          { role: "user", content: options.user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: { schema: options.schema },
        },
        ...(options.recency ? { search_recency_filter: options.recency } : {}),
        ...(options.domains?.length ? { search_domain_filter: options.domains } : {}),
      }),
      signal: options.signal,
      cache: "no-store",
    });

    if (res.ok) {
      const payload: PerplexityResponse = await res.json();
      const content = payload.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Perplexity returned an empty response");
      }
      return { data: JSON.parse(content) as T, sources: normalizeSources(payload) };
    }

    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === maxAttempts) {
      throw new Error(`Perplexity API error: ${res.status} ${await res.text()}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }

  throw new Error("Unreachable");
}
