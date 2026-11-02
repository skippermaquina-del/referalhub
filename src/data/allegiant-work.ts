import type { Lang } from "./allegiant";

export type WorkPhoto = { src: string; alt: string; caption: string };

type WorkCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  h1a: string;
  h1b: string;
  intro: string;
  videoLabel: string;
  videoTitle: string;
  galleryTitle: string;
  noteTitle: string;
  note: string;
  close: string;
  privacy: string;
  cta: { title: string; text: string };
  photos: WorkPhoto[];
};

const src = (n: number) => `/allegiant/work/job-${n}.jpg`;

const en: WorkCopy = {
  meta: {
    title: "Real jobs | Allegiant Appliances, Los Angeles",
    description: "Photos from real repairs by Vadim at Allegiant Appliances in Los Angeles: what's inside the machine and what we found.",
  },
  eyebrow: "Real jobs",
  h1a: "No stock photos.",
  h1b: "This is the work.",
  intro:
    "Pictures taken by Vadim on real repairs in Los Angeles. This is what's inside the machine, including the parts that look rough.",
  videoLabel: "Short video of a real washer repair",
  videoTitle: "Watch it in 30 seconds",
  galleryTitle: "From the job",
  noteTitle: "What a drain pump does",
  note:
    "The drain pump pushes the water out of the washer at the end of each cycle. Rust like this inside the motor housing usually means water has been getting where it shouldn't. If your washer leaks or won't drain, it's one of the first parts we look at.",
  close: "Close",
  privacy: "We keep customers' faces, addresses and personal details out of every photo.",
  cta: {
    title: "Something not right with yours?",
    text: "Tell us what it's doing. Vadim will take a look and give you a straight answer.",
  },
  photos: [
    { src: src(1), alt: "Samsung front-load washer with the front panel removed and the lower parts exposed.", caption: "Front panel off, working from the bottom of the machine." },
    { src: src(3), alt: "A technician's hand holding a drain pump with a rusted motor housing in front of a Samsung washer.", caption: "The drain pump, out of the washer. Rust inside the motor housing." },
    { src: src(2), alt: "Two drain pumps on a mat on the floor: one with a corroded motor, one clean.", caption: "Two pumps side by side: one with a corroded motor, one clean." },
    { src: src(4), alt: "Top view of the washer with the top panel off: hoses, water valves and wiring.", caption: "Top panel off: hoses, water valves and wiring above the tub." },
    { src: src(5), alt: "Samsung washer with the top open, next to the dryer vent and the water lines.", caption: "Working from the top, with the water lines and the dryer vent behind." },
    { src: src(6), alt: "A Samsung washer and dryer stacked, with a thumbs up in front of the washer.", caption: "Finished: washer back in place under the dryer." },
  ],
};

const es: WorkCopy = {
  meta: {
    title: "Trabajos reales | Allegiant Appliances, Los Ángeles",
    description: "Fotos de reparaciones reales de Vadim en Allegiant Appliances, Los Ángeles: qué hay dentro de la máquina y qué encontramos.",
  },
  eyebrow: "Trabajos reales",
  h1a: "Sin fotos de archivo.",
  h1b: "Este es el trabajo.",
  intro:
    "Fotos tomadas por Vadim en reparaciones reales en Los Ángeles. Esto es lo que hay dentro de la máquina, incluidas las piezas que se ven mal.",
  videoLabel: "Video corto de la reparación real de una lavadora",
  videoTitle: "Míralo en 30 segundos",
  galleryTitle: "Desde el trabajo",
  noteTitle: "Para qué sirve la bomba de desagüe",
  note:
    "La bomba de desagüe saca el agua de la lavadora al final de cada ciclo. Un óxido así dentro de la carcasa del motor suele indicar que el agua ha estado llegando donde no debe. Si tu lavadora gotea o no desagua, es una de las primeras piezas que revisamos.",
  close: "Cerrar",
  privacy: "En cada foto dejamos fuera las caras, las direcciones y los datos personales de los clientes.",
  cta: {
    title: "¿Algo no va bien con la tuya?",
    text: "Cuéntanos qué hace. Vadim le echa un vistazo y te da una respuesta clara.",
  },
  photos: [
    { src: src(1), alt: "Lavadora Samsung de carga frontal con el panel delantero quitado y las piezas de abajo a la vista.", caption: "Sin el panel delantero, trabajando por la parte de abajo de la máquina." },
    { src: src(3), alt: "La mano de un técnico sostiene una bomba de desagüe con la carcasa del motor oxidada, delante de una lavadora Samsung.", caption: "La bomba de desagüe, fuera de la lavadora. Óxido dentro de la carcasa del motor." },
    { src: src(2), alt: "Dos bombas de desagüe sobre una alfombrilla en el suelo: una con el motor corroído y otra limpia.", caption: "Dos bombas lado a lado: una con el motor corroído y otra limpia." },
    { src: src(4), alt: "Vista desde arriba de la lavadora sin la tapa: mangueras, válvulas de agua y cableado.", caption: "Sin la tapa: mangueras, válvulas de agua y cableado sobre la cuba." },
    { src: src(5), alt: "Lavadora Samsung con la parte de arriba abierta, junto al ducto de la secadora y las líneas de agua.", caption: "Trabajando desde arriba, con las líneas de agua y el ducto de la secadora detrás." },
    { src: src(6), alt: "Lavadora y secadora Samsung apiladas, con un pulgar hacia arriba delante de la lavadora.", caption: "Terminado: la lavadora de vuelta en su sitio, debajo de la secadora." },
  ],
};

export const workCopy: Record<Lang, WorkCopy> = { en, es };
