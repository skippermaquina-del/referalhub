const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY. Add it to .env.local first.");
  process.exit(1);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateText(prompt: string, label: string): Promise<string> {
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
      throw new Error(`Gemini API error for ${label}: ${res.status} ${body}`);
    }

    const backoffMs = 2000 * attempt;
    console.log(`  ${label}: ${res.status}, reintentando en ${backoffMs / 1000}s...`);
    await sleep(backoffMs);
  }

  throw new Error("Unreachable");
}
