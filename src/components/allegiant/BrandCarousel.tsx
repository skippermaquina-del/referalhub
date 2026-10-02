"use client";

import { useRef } from "react";

/** Carrusel horizontal con scroll-snap y flechas. Marcas como texto (sin logos
 * de terceros). */
export function BrandCarousel({ brands }: { brands: string[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-[20px] text-white transition-colors hover:border-[color:var(--al-orange)] hover:text-[color:var(--al-orange)]";

  return (
    <div>
      <ul
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((b) => (
          <li
            key={b}
            className="flex h-28 w-44 shrink-0 snap-start items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 text-center text-[20px] font-extrabold uppercase tracking-wider text-white"
          >
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center gap-4">
        <button type="button" aria-label="Previous brands" onClick={() => scroll(-1)} className={arrow}>←</button>
        <button type="button" aria-label="Next brands" onClick={() => scroll(1)} className={arrow}>→</button>
      </div>
    </div>
  );
}
