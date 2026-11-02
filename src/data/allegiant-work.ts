import type { Lang } from "./allegiant";

export type WorkPhoto = { src: string; alt: string; caption: string };

export type WorkJob = {
  id: string;
  title: string;
  videoLabel: string;
  videoSrc: string;
  poster: string;
  /** Short en YouTube. */
  youtube: string;
  note: { title: string; text: string };
  photos: WorkPhoto[];
};

type WorkCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  h1a: string;
  h1b: string;
  intro: string;
  watchYoutube: string;
  close: string;
  privacy: string;
  cta: { title: string; text: string };
  jobs: WorkJob[];
};

const w = (n: number) => `/allegiant/work/job-${n}.jpg`;
const d = (n: number) => `/allegiant/work/dryer-${n}.jpg`;

/** Shorts del canal. Ver business.youtubeUrl. */
const YT = {
  washer: "https://youtube.com/shorts/sB2_JuerxQA",
  dryer: "https://youtube.com/shorts/yLjWFJUj6iM",
};

const en: WorkCopy = {
  meta: {
    title: "Real jobs | Allegiant Appliances, Los Angeles",
    description: "Photos and videos from real repairs by Vadim at Allegiant Appliances in Los Angeles: what's inside the machine and what we found.",
  },
  eyebrow: "Real jobs",
  h1a: "No stock photos.",
  h1b: "This is the work.",
  intro: "Pictures and videos taken by Vadim on real repairs in Los Angeles. This is what's inside the machine, including the parts that look rough.",
  watchYoutube: "Watch on YouTube",
  close: "Close",
  privacy: "We keep customers' faces, addresses and personal details out of every photo.",
  cta: {
    title: "Something not right with yours?",
    text: "Tell us what it's doing. Vadim will take a look and give you a straight answer.",
  },
  jobs: [
    {
      id: "washer",
      title: "Samsung washer: the drain pump",
      videoLabel: "Short video of a real washer repair",
      videoSrc: "/allegiant/video/work-short.mp4",
      poster: "/allegiant/video/work-short-poster.jpg",
      youtube: YT.washer,
      note: {
        title: "What a drain pump does",
        text: "The drain pump pushes the water out of the washer at the end of each cycle. Rust like this inside the motor housing usually means water has been getting where it shouldn't. If your washer leaks or won't drain, it's one of the first parts we look at.",
      },
      photos: [
        { src: w(1), alt: "Samsung front-load washer with the front panel removed and the lower parts exposed.", caption: "Front panel off, working from the bottom of the machine." },
        { src: w(3), alt: "A technician's hand holding a drain pump with a rusted motor housing in front of a Samsung washer.", caption: "The drain pump, out of the washer. Rust inside the motor housing." },
        { src: w(2), alt: "Two drain pumps on a mat on the floor: one with a corroded motor, one clean.", caption: "Two pumps side by side: one with a corroded motor, one clean." },
        { src: w(4), alt: "Top view of the washer with the top panel off: hoses, water valves and wiring.", caption: "Top panel off: hoses, water valves and wiring above the tub." },
        { src: w(5), alt: "Samsung washer with the top open, next to the dryer vent and the water lines.", caption: "Working from the top, with the water lines and the dryer vent behind." },
        { src: w(6), alt: "A Samsung washer and dryer stacked, with a thumbs up in front of the washer.", caption: "Finished: washer back in place under the dryer." },
      ],
    },
    {
      id: "dryer",
      title: "Samsung dryer: the drum rollers",
      videoLabel: "Short video of a real dryer repair",
      videoSrc: "/allegiant/video/dryer-short.mp4",
      poster: "/allegiant/video/dryer-short-poster.jpg",
      youtube: YT.dryer,
      note: {
        title: "Lint isn't only in the vent",
        text: "Lint also settles inside the dryer cabinet, around the duct and the parts under the drum. If your dryer takes too long to dry, gets hot or makes noise, it's worth having it opened up and cleaned.",
      },
      photos: [
        { src: d(1), alt: "The inside of a Samsung dryer with the drum roller and a duct packed with lint.", caption: "Inside the dryer: lint packed around the duct." },
        { src: d(2), alt: "Close-up of a dryer drum roller with a blue hub next to the drum shaft.", caption: "The drum roller, up close." },
        { src: d(3), alt: "Close-up of the dryer's drum shaft and a roller below it, covered in lint.", caption: "Close-up of the roller area." },
      ],
    },
  ],
};

const es: WorkCopy = {
  meta: {
    title: "Trabajos reales | Allegiant Appliances, Los Ángeles",
    description: "Fotos y videos de reparaciones reales de Vadim en Allegiant Appliances, Los Ángeles: qué hay dentro de la máquina y qué encontramos.",
  },
  eyebrow: "Trabajos reales",
  h1a: "Sin fotos de archivo.",
  h1b: "Este es el trabajo.",
  intro: "Fotos y videos tomados por Vadim en reparaciones reales en Los Ángeles. Esto es lo que hay dentro de la máquina, incluidas las piezas que se ven mal.",
  watchYoutube: "Verlo en YouTube",
  close: "Cerrar",
  privacy: "En cada foto dejamos fuera las caras, las direcciones y los datos personales de los clientes.",
  cta: {
    title: "¿Algo no va bien con la tuya?",
    text: "Cuéntanos qué hace. Vadim le echa un vistazo y te da una respuesta clara.",
  },
  jobs: [
    {
      id: "washer",
      title: "Lavadora Samsung: la bomba de desagüe",
      videoLabel: "Video corto de la reparación real de una lavadora",
      videoSrc: "/allegiant/video/work-short.mp4",
      poster: "/allegiant/video/work-short-poster.jpg",
      youtube: YT.washer,
      note: {
        title: "Para qué sirve la bomba de desagüe",
        text: "La bomba de desagüe saca el agua de la lavadora al final de cada ciclo. Un óxido así dentro de la carcasa del motor suele indicar que el agua ha estado llegando donde no debe. Si tu lavadora gotea o no desagua, es una de las primeras piezas que revisamos.",
      },
      photos: [
        { src: w(1), alt: "Lavadora Samsung de carga frontal con el panel delantero quitado y las piezas de abajo a la vista.", caption: "Sin el panel delantero, trabajando por la parte de abajo de la máquina." },
        { src: w(3), alt: "La mano de un técnico sostiene una bomba de desagüe con la carcasa del motor oxidada, delante de una lavadora Samsung.", caption: "La bomba de desagüe, fuera de la lavadora. Óxido dentro de la carcasa del motor." },
        { src: w(2), alt: "Dos bombas de desagüe sobre una alfombrilla en el suelo: una con el motor corroído y otra limpia.", caption: "Dos bombas lado a lado: una con el motor corroído y otra limpia." },
        { src: w(4), alt: "Vista desde arriba de la lavadora sin la tapa: mangueras, válvulas de agua y cableado.", caption: "Sin la tapa: mangueras, válvulas de agua y cableado sobre la cuba." },
        { src: w(5), alt: "Lavadora Samsung con la parte de arriba abierta, junto al ducto de la secadora y las líneas de agua.", caption: "Trabajando desde arriba, con las líneas de agua y el ducto de la secadora detrás." },
        { src: w(6), alt: "Lavadora y secadora Samsung apiladas, con un pulgar hacia arriba delante de la lavadora.", caption: "Terminado: la lavadora de vuelta en su sitio, debajo de la secadora." },
      ],
    },
    {
      id: "dryer",
      title: "Secadora Samsung: los rodillos del tambor",
      videoLabel: "Video corto de la reparación real de una secadora",
      videoSrc: "/allegiant/video/dryer-short.mp4",
      poster: "/allegiant/video/dryer-short-poster.jpg",
      youtube: YT.dryer,
      note: {
        title: "La pelusa no está solo en el ducto",
        text: "La pelusa también se acumula dentro de la secadora, alrededor del ducto y de las piezas bajo el tambor. Si tu secadora tarda demasiado en secar, se calienta o hace ruido, conviene abrirla y limpiarla.",
      },
      photos: [
        { src: d(1), alt: "El interior de una secadora Samsung con el rodillo del tambor y un ducto llenos de pelusa.", caption: "Dentro de la secadora: pelusa apelmazada alrededor del ducto." },
        { src: d(2), alt: "Primer plano de un rodillo del tambor de la secadora, con el centro azul, junto al eje del tambor.", caption: "El rodillo del tambor, de cerca." },
        { src: d(3), alt: "Primer plano del eje del tambor de la secadora y un rodillo debajo, cubiertos de pelusa.", caption: "Primer plano de la zona del rodillo." },
      ],
    },
  ],
};

export const workCopy: Record<Lang, WorkCopy> = { en, es };
