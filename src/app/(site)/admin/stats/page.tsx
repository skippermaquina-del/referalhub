import { offers } from "@/data/offers";
import { getClickCounts, isTrackingConfigured } from "@/lib/clicks";

export const dynamic = "force-dynamic";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (!process.env.ADMIN_KEY || key !== process.env.ADMIN_KEY) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Restricted</h1>
        <p className="mt-2 text-neutral-500">
          Add <code>?key=your-admin-key</code> to the URL to view click stats.
        </p>
      </main>
    );
  }

  if (!isTrackingConfigured()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Tracking not configured</h1>
        <p className="mt-2 text-neutral-500">
          Set <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> to
          start counting clicks. See the README for setup steps.
        </p>
      </main>
    );
  }

  const counts = await getClickCounts(offers.map((o) => o.slug));
  const sorted = [...offers].sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0));

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Click stats</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-800">
            <th className="py-2">Offer</th>
            <th className="py-2">Category</th>
            <th className="py-2 text-right">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((offer) => (
            <tr key={offer.slug} className="border-b border-neutral-900">
              <td className="py-2">{offer.emoji} {offer.name}</td>
              <td className="py-2 text-neutral-500">{offer.category}</td>
              <td className="py-2 text-right font-medium">{counts[offer.slug] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
