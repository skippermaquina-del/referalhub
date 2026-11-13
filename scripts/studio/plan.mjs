/**
 * Instrucciones libres del Estudio → opciones del video.
 *
 * Si el trabajo trae instrucciones (job.prompt) y hay ANTHROPIC_API_KEY, Claude
 * las lee junto con la nota y devuelve qué hacer: mantener el audio, música,
 * subtítulos, título y descripción. Sin clave o si algo falla, se arma el video
 * como siempre y las instrucciones se ignoran (el error queda en el log).
 *
 * El SDK se instala solo en GitHub Actions (ver .github/workflows/studio-render.yml),
 * por eso se importa recién cuando hace falta.
 */

const MODEL = "claude-opus-5-5";

const SCHEMA = {
  type: "object",
  properties: {
    keep_audio: {
      type: "boolean",
      description: "Keep the original sound of the video clips (someone talking). No music or captions over the clips.",
    },
    music: { type: "boolean", description: "Background music. False only if the instructions ask for no music." },
    captions_mode: {
      type: "string",
      enum: ["auto", "none", "custom"],
      description: "auto: captions come from the note as usual. none: no captions. custom: use `captions`.",
    },
    captions: {
      type: "array",
      items: { type: "string" },
      description: "Only for captions_mode=custom: one short line per shot (max ~40 characters each).",
    },
    title: { type: "string", description: "Video title, max 90 characters. Empty string = default title." },
    description_body: {
      type: "string",
      description: "First paragraph of the description. Empty string = default (the note). The business footer is added automatically.",
    },
    extra_hashtags: { type: "array", items: { type: "string" }, description: "Extra hashtags, each starting with #. Max 5." },
  },
  required: ["keep_audio", "music", "captions_mode", "captions", "title", "description_body", "extra_hashtags"],
  additionalProperties: false,
};

function systemPrompt(project) {
  return [
    `You set the options for a short vertical video (YouTube Shorts, Instagram Reels, TikTok) for ${project.name}: ${project.tagline}. Phone ${project.phone}, website ${project.website}.`,
    "The video is assembled automatically from the uploaded photos and clips. The owner wrote a note about what the video shows and, optionally, free-form instructions. Turn them into the options in the schema.",
    "Follow the instructions where the schema allows it. Anything the schema can't express (editing, effects, reordering, cutting parts) is ignored; don't try to fit it into the title or captions.",
    "Only state facts that appear in the note or the instructions. Never invent brands, models, parts, prices, results, years or claims like 'best in LA'. If unsure, leave the field at its default (empty string, auto).",
    `Write in ${project.lang === "es" ? "Spanish" : "English"} unless the instructions ask for another language.`,
    "Set keep_audio to true when the user turned it on or the instructions ask to keep the original sound, voice or audio.",
  ].join("\n");
}

/**
 * @returns {Promise<null | {keepAudio:boolean, music:boolean, captions:string[]|null, title:string|null, descriptionBody:string|null, extraHashtags:string[]}>}
 */
export async function planFromPrompt({ project, note, prompt, keepAudio, files }) {
  if (!prompt || !prompt.trim()) return null;
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("Instructions present but ANTHROPIC_API_KEY is not set; ignoring them.");
    return null;
  }
  let Anthropic;
  try {
    ({ default: Anthropic } = await import("@anthropic-ai/sdk"));
  } catch {
    console.log("@anthropic-ai/sdk is not installed; ignoring the instructions.");
    return null;
  }
  const client = new Anthropic();
  const kinds = files.map((f) => (f.video ? "video clip" : "photo"));
  const user = [
    `Note: ${note || "(empty)"}`,
    `Instructions: ${prompt}`,
    `"Keep original sound" checkbox: ${keepAudio ? "on" : "off"}`,
    `Files, in order: ${kinds.join(", ") || "(none)"}`,
  ].join("\n");

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: systemPrompt(project),
      messages: [{ role: "user", content: user }],
    });
    if (response.stop_reason === "refusal") {
      console.log("Claude declined the instructions; ignoring them.", response.stop_details?.category ?? "");
      return null;
    }
    const text = response.content.find((b) => b.type === "text")?.text;
    if (!text) return null;
    const plan = JSON.parse(text);
    const clean = (s) => (typeof s === "string" && s.trim() ? s.trim() : null);
    return {
      keepAudio: keepAudio || plan.keep_audio === true,
      music: plan.music !== false,
      captions:
        plan.captions_mode === "none"
          ? []
          : plan.captions_mode === "custom" && Array.isArray(plan.captions) && plan.captions.length
            ? plan.captions.map(String).filter(Boolean)
            : null,
      title: clean(plan.title)?.slice(0, 100) ?? null,
      descriptionBody: clean(plan.description_body),
      extraHashtags: (Array.isArray(plan.extra_hashtags) ? plan.extra_hashtags : [])
        .map(String)
        .filter((h) => /^#[\p{L}\p{N}_]+$/u.test(h))
        .slice(0, 5),
    };
  } catch (err) {
    if (err instanceof Anthropic.APIError) console.error(`Claude API error ${err.status}:`, err.message);
    else console.error("Could not read the instructions:", err);
    return null;
  }
}
