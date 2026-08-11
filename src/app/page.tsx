import Image from "next/image";
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
        <div className="relative overflow-hidden rounded-2xl bg-[#0f1923] p-6 text-white shadow-lg sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c9a84c]/20 blur-3xl"
          />
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70">
            Destacado
          </span>
          <div className="relative mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Image
                src="/gftc-logo.png"
                alt="GFTC Finance"
                width={92}
                height={85}
                className="shrink-0"
              />
              <div>
                <h2 className="text-xl font-bold text-[#c9a84c]">GFTC Academy</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  Curso gratis de tokenización de activos: cómo el dinero, los bienes raíces y
                  otros activos se convierten en tokens digitales que se pueden transferir y
                  fraccionar en blockchain.
                </p>
              </div>
            </div>
            <a
              href="https://gftc.finance/academy/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block shrink-0 rounded-md bg-[#c9a84c] px-6 py-3 text-center font-semibold text-[#0f1923] hover:bg-[#dab868]"
            >
              Empezar curso gratis
            </a>
          </div>
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
