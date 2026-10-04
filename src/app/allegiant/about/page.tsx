import Image from "next/image";
import { business, copy, paths } from "@/data/allegiant";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";

export const metadata = {
  title: "About Allegiant Appliances | Expert Repairs in LA",
  description: "Meet Vadim, owner of Allegiant Appliances Inc. 5+ years of experience repairing premium appliances across Los Angeles.",
};

export default function AboutPage() {
  const t = copy.en;
  const p = paths("en");

  return (
    <div lang="en" className="allegiant">
      <AllegiantShell lang="en">
        <Header lang="en" />
        <main>
          {/* Hero */}
            <section className="al-section al-light al-tone-2" style={{ paddingBottom: 120 }}>
              <div className="al-grid12">
                <div style={{ gridColumn: "1 / span 12", textAlign: "center", marginBottom: 80 }}>
                  <div className="al-eyebrow">About Allegiant</div>
                  <h1 className="al-h2">Meet Vadim</h1>
                  <p style={{ maxWidth: 600, margin: "20px auto 0", fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)" }}>
                    5+ years of expertise repairing luxury and premium appliances across Los Angeles
                  </p>
                </div>

                {/* Portrait Section */}
                <div style={{ gridColumn: "1 / span 5", position: "relative", height: 500 }}>
                  <Image
                    src="/images/about/vadim-portrait.jpg"
                    alt="Vadim, owner of Allegiant Appliances"
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
                    Founder & Master Technician
                  </p>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    With over 5 years of hands-on experience, Vadim has built Allegiant Appliances on a foundation of expertise, integrity, and unmatched customer service. Specializing in luxury and premium brands like Sub-Zero, Wolf, Miele, and Samsung, Vadim brings the precision needed for the most sophisticated appliances.
                  </p>
                </div>
              </div>
            </section>

            {/* Work Gallery */}
            <section className="al-section al-light" style={{ paddingBottom: 100 }}>
              <div style={{ marginBottom: 80, textAlign: "center" }}>
                <div className="al-eyebrow">Expertise</div>
                <h2 className="al-h2">Every Job Matters</h2>
              </div>

              <div className="al-grid12" style={{ rowGap: 40 }}>
                {/* Van */}
                <div style={{ gridColumn: "1 / span 6", position: "relative", height: 350 }}>
                  <Image
                    src="/images/about/allegiant-van.jpg"
                    alt="Allegiant service van"
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
                <div style={{ gridColumn: "8 / span 5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 className="al-serif" style={{ fontSize: 36, fontWeight: 400, margin: 0, marginBottom: 16 }}>
                    Ready to Serve
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    Fully equipped service vehicle, always ready to tackle complex repairs across Los Angeles. We bring the expertise to your home.
                  </p>
                </div>

                {/* Kitchen Repair */}
                <div style={{ gridColumn: "1 / span 5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 className="al-serif" style={{ fontSize: 36, fontWeight: 400, margin: 0, marginBottom: 16 }}>
                    Precision Work
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    From ovens to cooktops, every repair is executed with surgical precision and attention to detail that luxury appliances demand.
                  </p>
                </div>
                <div style={{ gridColumn: "8 / span 5", position: "relative", height: 350 }}>
                  <Image
                    src="/images/about/vadim-kitchen.jpg"
                    alt="Appliance repair work"
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>

                {/* Laundry */}
                <div style={{ gridColumn: "1 / span 6", position: "relative", height: 350 }}>
                  <Image
                    src="/images/about/vadim-laundry.jpg"
                    alt="Laundry appliance repair"
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
                <div style={{ gridColumn: "8 / span 5", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 className="al-serif" style={{ fontSize: 36, fontWeight: 400, margin: 0, marginBottom: 16 }}>
                    Complete Solutions
                  </h3>
                  <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--al-muted)", margin: 0 }}>
                    From washers to dryers, refrigerators to dishwashers, we handle every appliance category with mastery and care.
                  </p>
                </div>
              </div>
            </section>

            {/* Values */}
            <section className="al-section al-light al-tone-2" style={{ paddingBottom: 100 }}>
              <div style={{ marginBottom: 80, textAlign: "center" }}>
                <h2 className="al-h2">Our Commitment</h2>
              </div>

              <div className="al-grid12" style={{ gap: 40 }}>
                {[
                  {
                    title: "Expertise",
                    desc: "Years of hands-on experience with luxury and premium appliances.",
                  },
                  {
                    title: "Integrity",
                    desc: "Transparent pricing and honest communication with every client.",
                  },
                  {
                    title: "Precision",
                    desc: "Every repair handled with surgical attention to detail.",
                  },
                  {
                    title: "Reliability",
                    desc: "Fast response times and durable solutions you can count on.",
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
                <h2 className="al-h2">Ready to Repair?</h2>
                <p style={{ fontSize: 18, lineHeight: 1.8, color: "var(--al-muted)", margin: "20px auto 0", maxWidth: 600 }}>
                  Contact Allegiant Appliances to schedule your repair. We're here to get your appliances back to perfect working order.
                </p>
                <div style={{ marginTop: 40, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={p.home + "#booking"} className="al-btn">
                    Book a Visit
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
