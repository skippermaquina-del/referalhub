"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { business } from "@/data/allegiant";

// three.js solo se descarga cuando la sección se acerca a la pantalla.
const Scene = dynamic(() => import("./SurpriseScene"), { ssr: false, loading: () => null });

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function Coupon() {
  return (
    <div className="al-fade mx-auto max-w-md rounded-2xl border border-[color:var(--al-orange)] bg-[#0a1020]/90 p-6 text-center text-white shadow-2xl backdrop-blur">
      <p className="text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">You won</p>
      <p className="mt-1 whitespace-nowrap text-[56px] font-extrabold leading-none">20% OFF</p>
      <p className="mt-2 text-[18px] font-bold">{business.discount}</p>
      <p className="mt-2 text-[14px] text-white/70">Save Vadim&apos;s contact and mention this offer when you book.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="/allegiant/vadim.vcf"
          download
          className="inline-flex items-center justify-center rounded-lg bg-[color:var(--al-orange)] px-6 py-3.5 text-[14px] font-bold uppercase tracking-wide text-white hover:bg-[color:var(--al-orange-dim)]"
        >
          Save contact
        </a>
        <a href="#book" className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-6 py-3.5 text-[14px] font-bold text-white hover:border-white">
          Book Service
        </a>
      </div>
    </div>
  );
}

export function SurpriseBox() {
  const ref = useRef<HTMLDivElement>(null);
  const couponRef = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [inView, setInView] = useState(false);
  const [opened, setOpened] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const reduced = useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => false);
  const flat = reduced || noGL;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "400px" });
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, []);

  // Al abrir el regalo, deja ver los fuegos artificiales y luego baja al cupón.
  useEffect(() => {
    if (!opened || reduced) return;
    const id = window.setTimeout(() => couponRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 1100);
    return () => window.clearTimeout(id);
  }, [opened, reduced]);

  return (
    <section id="surprise" className="relative overflow-hidden bg-[#05070d] px-5 py-16 text-white md:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.25em] text-[color:var(--al-orange)]">Surprise box</p>
        <h2 className="text-[32px] font-extrabold leading-tight md:text-[44px]">Grab a box. Tap the gift.</h2>
        <p className="mx-auto mt-3 max-w-xl text-[17px] text-white/70">
          Throw the boxes around, then open the gift to claim your discount.
        </p>
      </div>

      {flat ? (
        <div className="mt-10">
          <Coupon />
        </div>
      ) : (
        <>
          <div ref={ref} className="relative mx-auto mt-6 h-[62svh] min-h-[420px] max-w-6xl">
            {load && (
              <Scene active={inView} opened={opened} onOpen={() => setOpened(true)} onUnsupported={() => setNoGL(true)} />
            )}
            {!opened && (
              <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[13px] font-semibold uppercase tracking-widest text-white/50">
                Drag &amp; throw the boxes · tap the gift
              </p>
            )}
          </div>
          <div ref={couponRef} className="mt-6 px-1">
            {opened && <Coupon />}
          </div>
          {!opened && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setOpened(true)}
                className="text-[14px] font-bold uppercase tracking-wider text-white/70 underline underline-offset-4 hover:text-[color:var(--al-orange)]"
              >
                Open the gift
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
