"use client";

import { luxuryBrands, homeBrands, copy, brandLogos, type Lang } from "@/data/allegiant";
import Image from "next/image";

/**
 * Carrusel continuo de 3 filas con movimiento alterno.
 * Fila 1 → derecha, Fila 2 → izquierda, Fila 3 → derecha
 */
export function ContinuousCarousel({ lang }: { lang: Lang }) {
  const t = copy[lang].brands;

  // Intercala lujo y home brands
  const allBrands: { name: string; tag: string }[] = [];
  for (let i = 0; i < luxuryBrands.length; i++) {
    allBrands.push({ name: luxuryBrands[i], tag: t.luxury });
    allBrands.push({ name: homeBrands[i], tag: t.home });
  }

  // Divide en 3 filas de 8 marcas c/u
  const row1 = allBrands.slice(0, 8);
  const row2 = allBrands.slice(8, 16);
  const row3 = allBrands.slice(16, 24);

  const renderRow = (brands: typeof allBrands, direction: "left" | "right") => (
    <div className="al-carousel-continuous-row" data-direction={direction}>
      <div className="al-carousel-continuous-track">
        {/* Original + copia para efecto infinito */}
        {[...brands, ...brands].map((brand, idx) => (
          <div key={idx} className="al-carousel-continuous-card">
            {brandLogos[brand.name] ? (
              <Image
                src={brandLogos[brand.name]}
                alt={brand.name}
                width={140}
                height={60}
                draggable={false}
                className="al-carousel-continuous-logo"
              />
            ) : (
              <span className="al-carousel-continuous-name">{brand.name}</span>
            )}
            <span className="al-carousel-continuous-tag">{brand.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="al-carousel-continuous">
      <div className="al-grid12 al-section-head" style={{ marginBottom: 48 }}>
        <div className="al-eyebrow">{t.eyebrow}</div>
        <h2 className="al-h2">{t.h2}</h2>
      </div>

      {renderRow(row1, "right")}
      {renderRow(row2, "left")}
      {renderRow(row3, "right")}

      <div className="al-all-brands" style={{ marginTop: 48 }}>
        <span className="al-all-brands-plus" aria-hidden="true">+</span>
        <span className="al-all-brands-text">{t.all}</span>
      </div>
    </section>
  );
}
