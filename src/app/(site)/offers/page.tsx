import Link from "next/link";
import { categories, offers, type Category } from "@/data/offers";
import { OffersExplorer } from "@/components/OffersExplorer";

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

  const chips: { href: string; label: string; count: number; active: boolean }[] = [
    { href: "/offers", label: "All", count: offers.length, active: !activeCategory },
    ...categories.map((cat) => ({
      href: `/offers?category=${cat.id}`,
      label: cat.label,
      count: offers.filter((o) => o.category === cat.id).length,
      active: activeCategory === cat.id,
    })),
  ];

  return (
    <main className="flex-1">
      <section className="border-b border-neutral-200 bg-gradient-to-b from-emerald-500/[0.07] to-transparent dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-6 pb-10 pt-14">
          <span className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            {offers.length} live offers
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">All offers</h1>
          <p className="mt-3 max-w-2xl text-neutral-500">
            Sign-up bonuses and cash back from brands you already know. Every link below is a
            real referral link — same signup you&apos;d get directly.
          </p>

          <nav aria-label="Categories" className="mt-8 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                aria-current={chip.active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  chip.active
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                    : "border border-neutral-200 bg-white hover:border-emerald-500 dark:border-neutral-800 dark:bg-neutral-950"
                }`}
              >
                {chip.label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    chip.active ? "bg-white/20" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-900"
                  }`}
                >
                  {chip.count}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 pb-20 pt-4">
        {missing && (
          <p className="mt-6 rounded-md bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            That offer isn&apos;t available right now.
          </p>
        )}

        <OffersExplorer offers={visibleOffers} activeCategory={activeCategory} />
      </div>
    </main>
  );
}
