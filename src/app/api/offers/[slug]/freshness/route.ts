import { getOfferBySlug } from "@/data/offers";
import { isPerplexityConfigured, verifyOffer } from "@/lib/offer-verification";

// A Perplexity search takes longer than the default serverless budget.
export const maxDuration = 30;

/**
 * Live check of whether one offer's advertised bonus still matches reality.
 *
 * Results are cached for 12h per slug, and the slug has to be one of ours, so
 * traffic here can only ever cost one search per offer per half-day.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    return Response.json({ error: "Unknown offer." }, { status: 404 });
  }

  if (!isPerplexityConfigured()) {
    return Response.json(
      { error: "Bonus checking is not configured on this deployment." },
      { status: 501 },
    );
  }

  try {
    return Response.json(await verifyOffer(offer));
  } catch (error) {
    console.error(`Freshness check failed for ${slug}:`, error);
    return Response.json(
      { error: "Couldn't check this bonus right now. Try again in a moment." },
      { status: 502 },
    );
  }
}
