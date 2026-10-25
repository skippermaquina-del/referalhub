import { dishwasherStory } from "@/data/allegiant-stories";
import { StoryVideo } from "./StoryVideo";

/**
 * "Mira por dentro": una historia en video por aparato.
 * Hoy solo el lavavajillas (la heladera ya es el hero). Para sumar otro,
 * añadir su Story a `stories` y aparecerán pestañas.
 */
const stories = [dishwasherStory];

export function InsideStories() {
  return (
    <section id="inside" className="bg-[#03060d] text-white">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-16 md:pt-24">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">See inside</p>
        <h2 className="max-w-2xl text-[32px] font-extrabold leading-tight md:text-[44px]">
          If it&apos;s in your kitchen, we&apos;ve seen the problem.
        </h2>
        <p className="mt-3 max-w-xl text-[17px] text-white/70">
          An X-ray look at what actually fails — and how Vadim fixes it.
        </p>
      </div>
      {stories.map((s) => (
        <StoryVideo key={s.id} story={s} variant="section" />
      ))}
    </section>
  );
}
