import { offers } from "@/data/offers";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const offersCatalog = offers
  .filter((offer) => offer.referralUrl !== "REPLACE_ME")
  .map((offer) => ({
    slug: offer.slug,
    name: offer.name,
    category: offer.category,
    bonus: offer.bonus,
    description: offer.description,
    requirements: offer.requirements,
  }));

const systemInstruction = `Sos el asistente de ReferralHub, un sitio que junta ofertas de referidos (bancos, tarjetas, inversión, apps de cashback). Ayudás a los visitantes a elegir qué oferta les conviene según lo que cuentan (qué banco usan, si quieren invertir, si buscan cashback, etc).

Respondé en el mismo idioma en el que te escribe el usuario. Sé breve y directo (2-4 oraciones).

Estas son las únicas ofertas disponibles, no inventes otras:
${JSON.stringify(offersCatalog, null, 2)}

Devolvé SIEMPRE un JSON con este formato exacto:
{"reply": "tu respuesta en texto", "recommended_slugs": ["slug1", "slug2"]}

"recommended_slugs" tiene los slugs (0 a 3) de las ofertas del catálogo que mencionás o recomendás en tu respuesta. Si todavía no tenés info suficiente para recomendar algo, dejalo vacío y preguntá qué necesita.`;

const responseSchema = {
  type: "object",
  properties: {
    reply: { type: "string" },
    recommended_slugs: { type: "array", items: { type: "string" } },
  },
  required: ["reply", "recommended_slugs"],
};

async function callGemini(messages: ChatMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-goog-api-key": apiKey },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema,
          },
        }),
      },
    );

    if (res.ok) {
      const data = await res.json();
      const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      return JSON.parse(text) as { reply: string; recommended_slugs: string[] };
    }

    if ((res.status === 503 || res.status === 429) && attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      continue;
    }

    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }

  throw new Error("Unreachable");
}

export async function POST(request: Request) {
  const body = await request.json();
  const messages: ChatMessage[] = body.messages ?? [];

  if (messages.length === 0) {
    return Response.json({ error: "No messages provided" }, { status: 400 });
  }

  try {
    const result = await callGemini(messages);
    const validSlugs = new Set(offersCatalog.map((offer) => offer.slug));
    const recommendedSlugs = result.recommended_slugs.filter((slug) => validSlugs.has(slug));

    return Response.json({ reply: result.reply, recommendedSlugs });
  } catch (error) {
    console.error("Assistant error:", error);
    return Response.json(
      { error: "No pude generar una respuesta ahora. Probá de nuevo en un momento." },
      { status: 502 },
    );
  }
}
