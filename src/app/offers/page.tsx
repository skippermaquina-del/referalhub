import Link from "next/link";
import { categories, offers, type Category } from "@/data/offers";
import { OfferCard } from "@/components/OfferCard";

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; missing?: string }>;
}) {
  const { category, missing } = await searchParams;
  const activeCategory = categories.find((c) => c.id === category)?.id as Category | undefined;
  const visibleOffers = activeCategory
    ? offers.filter((offer) => offer.category === activeCategory)
    : offers;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">All offers</h1>

      {missing && (
        <p className="mt-4 rounded-md bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          That offer doesn&apos;t have a referral link set up yet.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/offers"
          className={`rounded-full px-4 py-1.5 text-sm ${
            !activeCategory
              ? "bg-emerald-500 text-white"
              : "border border-neutral-200 dark:border-neutral-800"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/offers?category=${cat.id}`}
            className={`rounded-full px-4 py-1.5 text-sm ${
              activeCategory === cat.id
                ? "bg-emerald-500 text-white"
                : "border border-neutral-200 dark:border-neutral-800"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleOffers.map((offer) => (
          <OfferCard key={offer.slug} offer={offer} />
        ))}
      </div>
    </main>
  );
}
