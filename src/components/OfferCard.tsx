import Link from "next/link";
import type { Offer } from "@/data/offers";

export function OfferCard({ offer }: { offer: Offer }) {
  const needsLink = offer.referralUrl === "REPLACE_ME";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{offer.emoji}</span>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {offer.bonus}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{offer.name}</h3>
      <p className="text-sm text-neutral-500">{offer.description}</p>
      <p className="text-xs text-neutral-400">{offer.requirements}</p>
      {needsLink ? (
        <span className="mt-2 rounded-md bg-amber-500/10 px-3 py-2 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
          Add your referral link in src/data/offers.ts
        </span>
      ) : (
        <Link
          href={`/go/${offer.slug}`}
          className="mt-2 rounded-md bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-600"
        >
          Get this offer
        </Link>
      )}
    </div>
  );
}
