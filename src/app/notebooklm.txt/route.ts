import { categories, type Category } from "@/data/offers";
import { buildCorpus } from "@/lib/notebooklm";

/**
 * The source URL you paste into NotebookLM ("Add source" -> "Website").
 * `?category=banking|cards|investing|apps` narrows it to one category so a
 * notebook can keep each vertical as its own source.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("category");
  const category = categories.find((c) => c.id === requested)?.id as Category | undefined;

  if (requested && !category) {
    return new Response(
      `Unknown category "${requested}". Valid values: ${categories.map((c) => c.id).join(", ")}.\n`,
      { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const body = buildCorpus({ siteUrl: url.origin, category });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // NotebookLM re-fetches a website source when you refresh it; a short
      // cache keeps that cheap without serving a stale catalog for long.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
