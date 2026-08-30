import { RoomWalk } from "@/components/roomwalk/RoomWalk";
import { offers, type Category, type Offer } from "@/data/offers";

/** `turn` es el muro del rellano: el que miras de frente antes de doblar. */
type Wall = "left" | "right" | "back" | "turn";

/** Los mejores de cada categoría: en una pared caben pocos y grandes. */
function pick(category: Category, count: number): Offer[] {
  const inCategory = offers.filter((offer) => offer.category === category);
  const ranked = [
    ...inCategory.filter((offer) => offer.featured),
    ...inCategory.filter((offer) => !offer.featured),
  ];
  return ranked.slice(0, count);
}

/** Un cuadro colgado de una pared. `wall` y `at` deciden dónde. */
function Plate({
  offer,
  eyebrow,
  wall,
  at,
  y,
}: {
  offer: Offer;
  eyebrow: string;
  wall: Wall;
  at: number;
  y?: number;
}) {
  const live = offer.referralUrl !== "REPLACE_ME";
  return (
    <article
      className="rwd-plate"
      data-rw-panel={wall}
      data-rw-at={at}
      data-rw-y={y}
    >
      <p className="rwd-plate__eyebrow">{eyebrow}</p>
      <h3 className="rwd-plate__name">
        {offer.emoji} {offer.name}
      </h3>
      <p className="rwd-plate__bonus">{offer.bonus}</p>
      <p className="rwd-plate__body">{offer.description}</p>
      {live ? (
        <a className="rwd-plate__link" href={`/go/${offer.slug}`}>
          Claim this bonus
        </a>
      ) : (
        <span className="rwd-plate__soon">Referral link coming soon</span>
      )}
    </article>
  );
}

/** Rótulo sobre el dintel: se lee de frente mientras te acercas a la puerta. */
function DoorSign({
  title,
  note,
  wall = "back",
  at = 0.5,
  y = 0.1,
}: {
  title: string;
  note: string;
  wall?: Wall;
  at?: number;
  y?: number;
}) {
  return (
    <div className="rwd-door-sign" data-rw-panel={wall} data-rw-at={at} data-rw-y={y}>
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}

const banking = pick("banking", 3);
const investing = pick("investing", 2);
const cards = pick("cards", 2);
const apps = pick("apps", 2);

export default function RoomWalkPage() {
  return (
    <RoomWalk className="rwd" options={{ scrollPerMetre: 160 }}>
      {/* El recibidor es estrecho a propósito: obliga a mirar al fondo, que es
          donde está el título, sobre la puerta que vas a cruzar. */}
      <section data-rw-room="Entrance" data-rw-width="3.6" data-rw-depth="4.6">
        <div className="rwd-sign" data-rw-panel="back" data-rw-at="0.5" data-rw-y="0.095">
          <h1 className="rwd-sign__title">Walk the hub</h1>
          <p className="rwd-sign__sub">
            Every room is a category. Scroll to walk — the doorway ahead opens
            into banking.
          </p>
        </div>
      </section>

      <section
        data-rw-room="Living room · Banking"
        data-rw-turn="right"
        data-rw-width="5.6"
        data-rw-depth="7"
      >
        {/* Cuelga del muro del rellano: al doblar a la derecha lo tienes de
            frente y llena la pantalla, que es el momento muerto del giro. */}
        <DoorSign
          title="Banking"
          note="Neobanks and checking accounts that pay to open."
          wall="turn"
          at={0.5}
          y={0.44}
        />
        {banking.map((offer, i) => (
          <Plate
            key={offer.slug}
            offer={offer}
            eyebrow="Banking"
            wall={i === 1 ? "left" : "right"}
            at={i === 0 ? 0.3 : i === 1 ? 0.6 : 0.74}
            y={0.46}
          />
        ))}
      </section>

      <section data-rw-room="Hallway" data-rw-width="2.7" data-rw-depth="5.4">
        <DoorSign
          title="Keep going"
          note="The study is on the left."
          wall="right"
          at={0.5}
          y={0.4}
        />
      </section>

      <section
        data-rw-room="Study · Investing"
        data-rw-turn="left"
        data-rw-width="4.8"
        data-rw-depth="6"
      >
        <DoorSign
          title="Investing"
          note="Brokerages and exchanges that pay for a new account."
          wall="turn"
          at={0.5}
          y={0.44}
        />
        {investing.map((offer, i) => (
          <Plate
            key={offer.slug}
            offer={offer}
            eyebrow="Investing"
            wall={i === 0 ? "left" : "right"}
            at={i === 0 ? 0.36 : 0.66}
            y={0.46}
          />
        ))}
      </section>

      <section data-rw-room="Card room" data-rw-width="4.8" data-rw-depth="5.6">
        {cards.map((offer, i) => (
          <Plate
            key={offer.slug}
            offer={offer}
            eyebrow="Credit cards"
            wall={i === 0 ? "right" : "left"}
            at={i === 0 ? 0.34 : 0.68}
            y={0.46}
          />
        ))}
      </section>

      <section
        data-rw-room="Kitchen · Cashback"
        data-rw-turn="right"
        data-rw-width="4.4"
        data-rw-depth="5.6"
      >
        {apps.map((offer, i) => (
          <Plate
            key={offer.slug}
            offer={offer}
            eyebrow="Cashback apps"
            wall={i === 0 ? "left" : "right"}
            at={i === 0 ? 0.36 : 0.66}
            y={0.46}
          />
        ))}
      </section>

      {/* Última habitación: su pared del fondo es maciza, así que el cierre se
          ve de frente y el paseo termina mirándolo. */}
      <section data-rw-room="Balcony" data-rw-width="3.8" data-rw-depth="4.6">
        <div className="rwd-sign" data-rw-panel="back" data-rw-at="0.5" data-rw-y="0.42">
          <h2 className="rwd-sign__title">That’s the flat</h2>
          <p className="rwd-sign__sub">
            All {offers.length} offers live in the regular list — same links, no
            walking.
          </p>
          <p style={{ marginTop: 22 }}>
            <a className="rwd-plate__link" href="/offers">
              See every offer
            </a>
          </p>
        </div>
      </section>
    </RoomWalk>
  );
}
