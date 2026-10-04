import Image from "next/image";
import { business, copy, paths } from "@/data/allegiant";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";

export const metadata = {
  title: "Acerca de Allegiant Appliances | Reparaciones Expertas en LA",
  description: "Conoce a Vadim, dueño de Allegiant Appliances Inc. 5+ años de experiencia reparando electrodomésticos premium en Los Angeles.",
};

export default function AboutPage() {
  const t = copy.es;
  const p = paths("es");

  return (
    <div lang="es" className="allegiant">
      <AllegiantShell lang="es">
        <Header lang="es" />
        <main>
          {/* Hero */}
            <section className="al-section al-light al-tone-2" style={{ paddingBottom: 120 }}>
              <div className="al-grid12">
                <div style={{ gridColumn: "1 / span 12", textAlign: "center", marginBottom: 80 }}>
                  <div className="al-eyebrow">Acerca de Allegiant</div>
                  <h1 className="al-h2">Conoce a Vadim</h1>
                  <p style={{ maxWidth: 600, margin: "20px auto 0", fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)" }}>
                    5+ años de experiencia reparando electrodomésticos de lujo en Los Angeles
                  </p>
                </div>

                {/* Portrait Section */}
                <div style={{ gridColumn: "1 / span 5", position: "relative", height: 500 }}>
                  <Image
                    src="/images/about/vadim-portrait.jpg"
                    alt="Vadim, dueño de Allegiant Appliances"
                    fill
                    className="al-rounded"
                    style={{ objectFit: "cover", borderRadius: 8 }}
                    priority
                  />
                </div>

                {/* Bio Section */}
                <div style={{ gridColumn: "8 / span 5", display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40 }}>
                  <h2 className="al-serif" style={{ fontSize: 42, fontWeight: 400, margin: 0, marginBottom: 20 }}>
                    Vadim
                  </h2>
                  <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)", margin: "0 0 24px" }}>
                    Dueño y Técnico Maestro
                  </p>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    Con más de 5 años de experiencia práctica, Vadim ha construido Allegiant Appliances sobre la base de experiencia, integridad y servicio al cliente sin igual. Especializado en marcas de lujo y premium como Sub-Zero, Wolf, Miele y Samsung, Vadim trae la precisión que los electrodomésticos más sofisticados requieren.
                  </p>
                </div>
              </div>
            </section>

            {/* Work Gallery */}
            <section className="al-section al-light" style={{ paddingBottom: 100 }}>
              <div style={{ marginBottom: 80, textAlign: "center" }}>
                <div className="al-eyebrow">Experiencia</div>
                <h2 className="al-h2">Cada Trabajo Importa</h2>
              </div>

              <div className="al-grid12" style={{ rowGap: 40 }}>
                {/* Van */}
                <div style={{ gridColumn: "1 / span 6", position: "relative", height: 350 }}>
                  <Image
                    src="/images/about/allegiant-van.jpg"
                    alt="Camioneta de servicio de Allegiant"
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
                <div style={{ gridColumn: "8 / span 5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 className="al-serif" style={{ fontSize: 36, fontWeight: 400, margin: 0, marginBottom: 16 }}>
                    Listos para Servir
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    Camioneta de servicio completamente equipada, siempre lista para reparaciones complejas en Los Angeles. Llevamos la experiencia a tu hogar.
                  </p>
                </div>

                {/* Kitchen Repair */}
                <div style={{ gridColumn: "1 / span 5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 className="al-serif" style={{ fontSize: 36, fontWeight: 400, margin: 0, marginBottom: 16 }}>
                    Trabajo de Precisión
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    Desde hornos hasta estufas, cada reparación se ejecuta con precisión quirúrgica y atención al detalle que los electrodomésticos de lujo exigen.
                  </p>
                </div>
                <div style={{ gridColumn: "8 / span 5", position: "relative", height: 350 }}>
                  <Image
                    src="/images/about/vadim-kitchen.jpg"
                    alt="Trabajo de reparación de electrodomésticos"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center 12%", borderRadius: 8 }}
                  />
                </div>

                {/* Laundry */}
                <div style={{ gridColumn: "1 / span 6", position: "relative", height: 350 }}>
                  <Image
                    src="/images/about/vadim-laundry.jpg"
                    alt="Reparación de electrodomésticos de lavandería"
                    fill
                    style={{ objectFit: "cover", objectPosition: "center 12%", borderRadius: 8 }}
                  />
                </div>
                <div style={{ gridColumn: "8 / span 5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 className="al-serif" style={{ fontSize: 36, fontWeight: 400, margin: 0, marginBottom: 16 }}>
                    Soluciones Completas
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    Desde lavadoras hasta secadoras, refrigeradores hasta lavavajillas, manejamos cada categoría de electrodomésticos con dominio y cuidado.
                  </p>
                </div>
              </div>
            </section>

            {/* Values */}
            <section className="al-section al-light al-tone-2" style={{ paddingBottom: 100 }}>
              <div style={{ marginBottom: 80, textAlign: "center" }}>
                <h2 className="al-h2">Nuestro Compromiso</h2>
              </div>

              <div className="al-grid12" style={{ gap: 40 }}>
                {[
                  {
                    title: "Experiencia",
                    desc: "Años de experiencia práctica con electrodomésticos de lujo y premium.",
                  },
                  {
                    title: "Integridad",
                    desc: "Precios transparentes y comunicación honesta con cada cliente.",
                  },
                  {
                    title: "Precisión",
                    desc: "Cada reparación realizada con atención quirúrgica al detalle.",
                  },
                  {
                    title: "Confiabilidad",
                    desc: "Tiempos de respuesta rápidos y soluciones duraderas en las que puedes confiar.",
                  },
                ].map((value) => (
                  <div key={value.title} style={{ gridColumn: "span 3", textAlign: "center" }}>
                    <h3 className="al-serif" style={{ fontSize: 28, fontWeight: 400, margin: 0, marginBottom: 12, color: "var(--al-accent)" }}>
                      {value.title}
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--al-muted)", margin: 0 }}>
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="al-section al-grid12 al-teaser" style={{ textAlign: "center" }}>
              <div style={{ gridColumn: "1 / span 12" }}>
                <h2 className="al-h2">¿Listo para Reparar?</h2>
                <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)", margin: "20px auto 0", maxWidth: 600 }}>
                  Contacta a Allegiant Appliances para programar tu reparación. Estamos aquí para que tus electrodomésticos funcionen perfectamente.
                </p>
                <div style={{ marginTop: 40, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={p.home + "#booking"} className="al-btn">
                    Reservar Visita
                  </a>
                  <a href={`tel:+13235784010`} className="al-btn-line">
                    +1 (323) 578-4010
                  </a>
                </div>
              </div>
            </section>
        </main>
      </AllegiantShell>
    </div>
  );
}
