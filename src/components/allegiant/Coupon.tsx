import type { Lang } from "@/data/allegiant";
import { couponText, offer } from "@/data/allegiant-offer";

/** Cupón de la oferta (se muestra al pinchar el globo). */
export function Coupon({ lang, onBook }: { lang: Lang; onBook: () => void }) {
  const t = couponText[lang];
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
