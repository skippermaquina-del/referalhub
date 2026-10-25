import { business, type Lang } from "@/data/allegiant";
import { couponText, offer } from "@/data/allegiant-offer";

/** Tarjeta de la oferta (se muestra al pinchar el globo). */
export function Coupon({ lang, onBook, onClose }: { lang: Lang; onBook: () => void; onClose: () => void }) {
  const t = couponText[lang];
  return (
    <div className="al-box-coupon" role="dialog" aria-label={offer.eyebrow[lang]}>
      <button type="button" className="al-box-close" aria-label={t.close} onClick={onClose}>
        ×
      </button>
      <div className="al-eyebrow">{offer.eyebrow[lang]}</div>
      <p className="al-box-big">{offer.big[lang]}</p>
      <p className="al-box-applies">{offer.applies[lang]}</p>
      <p className="al-box-how">{offer.how[lang]}</p>
      {offer.valid && <p className="al-box-valid">{offer.valid[lang]}</p>}
      <div className="al-box-actions">
        <a className="al-box-primary" href={`tel:${business.phoneHref}`}>
          {t.call}
        </a>
        <button type="button" className="al-box-ghost" onClick={onBook}>
          {t.book}
        </button>
      </div>
      <a className="al-box-save" href="/allegiant/vadim.vcf" download>
        {t.save}
      </a>
    </div>
  );
}
