import Link from "next/link";
import { categories, getFeaturedOffers } from "@/data/offers";
import { OfferCard } from "@/components/OfferCard";

export default function Home() {
  const featured = getFeaturedOffers();

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Get paid to sign up for the things you already use
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
          Hand-picked referral and cashback offers for banking, credit cards, investing, and
          everyday shopping — all in one place.
        </p>
        <Link
          href="/offers"
          className="mt-8 inline-block rounded-md bg-emerald-500 px-6 py-3 font-medium text-white hover:bg-emerald-600"
        >
          Browse all offers
        </Link>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="flex flex-col gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-lg font-semibold">GFTC Academy</h2>
            <p className="mt-1 max-w-xl text-sm text-neutral-500">
              Aprende sobre tokenización de activos: cómo el dinero, los bienes raíces y otros
              activos se convierten en tokens digitales que se pueden transferir y fraccionar en
              blockchain.
            </p>
          </div>
          <a
            href="https://gftc.finance/academy/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block shrink-0 rounded-md bg-emerald-500 px-6 py-3 text-center font-medium text-white hover:bg-emerald-600"
          >
            Ir a GFTC Academy
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-xl font-semibold">Featured offers</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="text-xl font-semibold">Browse by category</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/offers?category=${category.id}`}
              className="rounded-xl border border-neutral-200 p-5 hover:border-emerald-500 dark:border-neutral-800"
            >
              <h3 className="font-semibold">{category.label}</h3>
              <p className="mt-1 text-sm text-neutral-500">{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
