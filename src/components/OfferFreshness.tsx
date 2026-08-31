"use client";

import { useState } from "react";
import type { OfferVerification } from "@/lib/offer-verification";

const STATUS_LABELS: Record<OfferVerification["status"], string> = {
  current: "Still current",
  changed: "Terms changed",
  ended: "No longer offered",
  unclear: "Couldn't confirm",
};

const STATUS_STYLES: Record<OfferVerification["status"], string> = {
  current: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  changed: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ended: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  unclear: "bg-neutral-500/10 text-neutral-500",
};

function formatCheckedAt(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Asks Perplexity whether the bonus we list for this offer is still what the
 * provider advertises, and shows the sources it read.
 */
export function OfferFreshness({ slug }: { slug: string }) {
  const [result, setResult] = useState<OfferVerification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/offers/${slug}/freshness`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't check this bonus right now.");
        return;
      }
      setResult(data as OfferVerification);
    } catch {
      setError("Couldn't reach the checker. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return <p className="text-xs text-neutral-400">{error}</p>;
  }

  if (!result) {
    return (
      <button
        onClick={check}
        disabled={loading}
        className="self-start text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-emerald-600 disabled:no-underline dark:hover:text-emerald-400"
      >
        {loading ? "Checking sources…" : "Is this bonus still current?"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-md bg-neutral-50 p-3 dark:bg-neutral-900/60">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[result.status]}`}
        >
          {STATUS_LABELS[result.status]}
        </span>
        <span className="text-[11px] text-neutral-400">
          checked {formatCheckedAt(result.checkedAt)}
        </span>
      </div>

      <p className="text-xs text-neutral-500">{result.summary}</p>

      {result.status === "changed" && result.currentBonus && (
        <p className="text-xs text-neutral-400">
          Listed here: {result.listedBonus} · Found live: {result.currentBonus}
        </p>
      )}

      {result.sources.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
          {result.sources.slice(0, 3).map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[11px] text-neutral-400 underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              {source.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
