"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { copy, type Lang } from "@/data/allegiant";
import { boxText, offer } from "@/data/allegiant-offer";
import { useBooking } from "./AllegiantShell";
import "./surprise.css";

// three.js solo se descarga cuando la sección se acerca a la pantalla.
const Scene = dynamic(() => import("./SurpriseScene"), { ssr: false, loading: () => null });

const RM = "(prefers-reduced-motion: reduce)";
const subscribeRM = (cb: () => void) => {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

function Coupon({ lang, onBook }: { lang: Lang; onBook: () => void }) {
  const t = boxText[lang];
  return (
    <div className="al-box-coupon">
      <div className="al-eyebrow">{t.won}</div>
      <p className="al-box-big">{offer.big[lang]}</p>
      <p className="al-box-applies">{offer.applies[lang]}</p>
      <p className="al-box-how">{offer.how[lang]}</p>
      {offer.valid && <p className="al-box-valid">{offer.valid[lang]}</p>}
      <div className="al-box-actions">
        <a className="al-box-primary" href="/allegiant/vadim.vcf" download>
          {t.save}
        </a>
        <button type="button" className="al-box-ghost" onClick={onBook}>
          {t.book}
        </button>
      </div>
    </div>
  );
}

/** Home: cajas que se lanzan y un regalo que revela la oferta (3D, carga diferida). */
export function SurpriseBox({ lang }: { lang: Lang }) {
  const t = boxText[lang];
  const kinds = copy[lang].tour.kinds;
  const { openBook } = useBooking();
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

  const labels = [kinds.fridge.name, kinds.micro.name, kinds.dish.name, kinds.washer.name, kinds.dryer.name];

  return (
    <section id="surprise" className="al-section al-box">
      <div className="al-box-head">
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h2 className="al-h2">{t.h2}</h2>
        <p className="al-box-p">{t.p}</p>
      </div>

      {flat ? (
        <div style={{ marginTop: 40 }}>
          <Coupon lang={lang} onBook={openBook} />
        </div>
      ) : (
        <>
          <div ref={ref} className="al-box-stage">
            {load && (
              <Scene
                labels={labels}
                tagline={t.tagline}
                fragile={t.fragile}
                active={inView}
                opened={opened}
                onOpen={() => setOpened(true)}
                onUnsupported={() => setNoGL(true)}
              />
            )}
            {!opened && <p className="al-box-hint">{t.hint}</p>}
          </div>
          <div ref={couponRef} style={{ marginTop: 24 }}>
            {opened ? (
              <Coupon lang={lang} onBook={openBook} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <button type="button" className="al-link" style={{ background: "none", borderTop: 0, borderLeft: 0, borderRight: 0 }} onClick={() => setOpened(true)}>
                  {t.openGift}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
