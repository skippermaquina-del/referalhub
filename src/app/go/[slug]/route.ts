import { notFound, redirect } from "next/navigation";
import { getOfferBySlug } from "@/data/offers";
import { recordClick } from "@/lib/clicks";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  if (offer.referralUrl === "REPLACE_ME") {
    redirect(`/offers?missing=${offer.slug}`);
  }

  await recordClick(slug);
  redirect(offer.referralUrl);
}
