import Link from "next/link";
import { categories, getOfferLogoUrl, type Offer } from "@/data/offers";

export function OfferCard({ offer }: { offer: Offer }) {
  const categoryLabel = categories.find((c) => c.id === offer.category)?.label;

  return (
    <div className="group relative flex min-w-0 flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-4">
        {/* Brandfetch's CDN only serves browser hotlinks, so next/image (which
            fetches server-side) can't be used here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getOfferLogoUrl(offer)}
          alt=""
          width={52}
          height={52}
          loading="lazy"
          className="h-13 w-13 shrink-0 rounded-xl bg-white object-contain ring-1 ring-neutral-200 dark:ring-neutral-700"
        />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{offer.name}</h3>
          {categoryLabel && <p className="text-xs text-neutral-500">{categoryLabel}</p>}
        </div>
      </div>

      <p className="mt-4 text-xl font-bold leading-snug text-emerald-600 dark:text-emerald-400">
        {offer.bonus}
      </p>
      <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
        {offer.description}
      </p>
      <p className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-900">
        <span className="font-medium text-neutral-700 dark:text-neutral-300">How to qualify: </span>
        {offer.requirements}
      </p>

      <div className="mt-auto pt-5">
        <Link
          href={`/go/${offer.slug}`}
          aria-label={`Get the ${offer.name} offer`}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-emerald-600"
        >
          Get this offer
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
