"use client";

import { useMemo, useState } from "react";
import { OfferCard } from "@/components/OfferCard";
import type { Offer } from "@/data/offers";

export function OffersExplorer({ offers }: { offers: Offer[] }) {
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

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search offers by name (e.g. PayPal)..."
        className="mt-6 w-full rounded-md border border-neutral-200 bg-transparent px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-emerald-500 focus:outline-none dark:border-neutral-800"
      />

      {visibleOffers.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No offers match &quot;{query}&quot;.
        </p>
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
