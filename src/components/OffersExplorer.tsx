"use client";

import { useMemo, useState } from "react";
import { OfferCard } from "@/components/OfferCard";
import { categories, type Category, type Offer } from "@/data/offers";

export function OffersExplorer({
  offers,
  activeCategory,
}: {
  offers: Offer[];
  activeCategory?: Category;
}) {
  const [query, setQuery] = useState("");

  const visibleOffers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offers;
    return offers.filter((offer) =>
      [offer.name, offer.description, offer.bonus].some((field) =>
        field.toLowerCase().includes(q)
      )
    );
  }, [offers, query]);

  // On the unfiltered "All" view, group cards under category headings so the
  // page reads as sections instead of one long wall of cards.
  const grouped = !activeCategory && !query.trim();

  return (
    <div>
      <div className="relative mt-6">
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search offers (e.g. PayPal, crypto, cash back)..."
          className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-800 dark:bg-neutral-950"
        />
      </div>

      {visibleOffers.length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-500">
          No offers match &quot;{query}&quot;.
        </p>
      ) : grouped ? (
        categories.map((category) => {
          const inCategory = visibleOffers.filter((o) => o.category === category.id);
          if (inCategory.length === 0) return null;
          return (
            <section key={category.id} className="mt-12">
              <div className="flex items-baseline justify-between gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl font-semibold">{category.label}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{category.blurb}</p>
                </div>
                <span className="shrink-0 text-sm text-neutral-400">{inCategory.length}</span>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {inCategory.map((offer) => (
                  <OfferCard key={offer.slug} offer={offer} />
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleOffers.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
