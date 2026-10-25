"use client";

import { useState } from "react";
import { dishwasherStory, iceMakerStory, washerStory } from "@/data/allegiant-stories";
import { StoryVideo } from "./StoryVideo";

/**
 * "Mira por dentro": una historia en video por aparato, con pestañas.
 * Para sumar otro aparato: añadir su Story a `stories` (ver allegiant-stories.ts).
 */
const stories = [dishwasherStory, washerStory, iceMakerStory];

export function InsideStories() {
  const [id, setId] = useState(stories[0].id);
  const story = stories.find((s) => s.id === id) ?? stories[0];

  return (
    <section id="inside" className="bg-[#03060d] text-white">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-16 md:pt-24">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">See inside</p>
        <h2 className="max-w-2xl text-[32px] font-extrabold leading-tight md:text-[44px]">
          If it&apos;s in your home, we&apos;ve seen the problem.
        </h2>
        <p className="mt-3 max-w-xl text-[17px] text-white/70">
          An X-ray look at what actually fails — and how Vadim fixes it.
        </p>
        {stories.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Choose an appliance">
            {stories.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === story.id}
                onClick={() => setId(s.id)}
                className={`rounded-full border px-5 py-2.5 text-[14px] font-bold uppercase tracking-wider transition-colors ${
                  s.id === story.id
                    ? "border-[color:var(--al-orange)] bg-[color:var(--al-orange)] text-white"
                    : "border-white/30 text-white/80 hover:border-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <StoryVideo key={story.id} story={story} variant="section" />
    </section>
  );
}
