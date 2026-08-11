/**
 * CONTENIDO PLACEHOLDER — Yana Samsonova
 * =====================================
 * Todo lo que hay en este archivo es inventado y está pensado para ser
 * reemplazado por material real. No publicar tal cual.
 *
 * Para sustituirlo:
 *  - Textos: editar directamente los strings de abajo.
 *  - Imágenes: cada obra usa por ahora un lienzo generativo (`palette` + `seed`).
 *    Cuando tengas las fotos reales, añade `image: "/yana/obra-x.jpg"` a la obra
 *    y `components/yana/Artwork.tsx` renderizará la foto en lugar del generativo.
 */

export type Palette = {
  /** Color de fondo del lienzo. */
  base: string;
  /** Colores de las manchas, de la más grande a la más pequeña. */
  layers: string[];
  /** Color de los trazos finos superpuestos. */
  stroke: string;
};

export type Artwork = {
  slug: string;
  title: string;
  year: number;
  medium: string;
  /** Alto × ancho en cm, tal y como se rotula en una ficha de sala. */
  dimensions: string;
  /** Serie a la que pertenece (`Series["slug"]`). */
  series: string;
  /** Texto de sala, 1–2 frases. */
  note: string;
  available: boolean;
  /** Semilla del lienzo generativo. Cambiarla cambia la composición. */
  seed: number;
  palette: Palette;
  /** Ruta a la foto real. Si existe, sustituye al lienzo generativo. */
  image?: string;
};

export type Series = {
  slug: string;
  title: string;
  years: string;
  tagline: string;
  description: string;
  seed: number;
  palette: Palette;
  image?: string;
};

const deshielo: Palette = {
  base: "#0d1b26",
  layers: ["#1f4a63", "#3d8ba8", "#96c9d6", "#e8f1f2"],
  stroke: "#cfe6ec",
};

const ecos: Palette = {
  base: "#1a1013",
  layers: ["#5c2230", "#a34b45", "#d98b6a", "#f0d9c0"],
  stroke: "#f2c9a8",
};

const interiores: Palette = {
  base: "#101512",
  layers: ["#22402f", "#4a7a55", "#9dbd8a", "#e6ead6"],
  stroke: "#d3e0c4",
};

const arcilla: Palette = {
  base: "#151109",
  layers: ["#4a3618", "#8a6a33", "#c9a86a", "#eee0c4"],
  stroke: "#e3cfa4",
};

export const artist = {
  name: "Yana Samsonova",
  role: "Pintura contemporánea",
  /** Frase de portada. Corta: se compone a 90px en escritorio. */
  headline: "La luz antes de que se decida.",
  /** Subtítulo de portada, 1 frase. */
  subhead:
    "Óleo sobre lino a gran formato. Paisajes que se deshacen en el momento exacto en que dejan de ser un lugar.",
  /** Bio larga, para la sección de estudio. */
  bio: [
    "Yana Samsonova pinta el intervalo: ese tramo de minutos en que un paisaje deja de describir un sitio concreto y empieza a describir una temperatura. Trabaja en veladuras finas de óleo sobre lino, levantando y volviendo a cerrar la superficie hasta que el color parece venir de detrás de la tela.",
    "Formada en pintura y en restauración, arrastra de ese segundo oficio una obsesión por el envejecimiento de los materiales: prepara sus propios soportes y muele parte de sus pigmentos. Cada pieza grande le lleva entre cuatro y nueve meses.",
  ],
  location: "Estudio en Valencia, España",
  email: "estudio@yanasamsonova.com",
  instagram: "https://instagram.com/",
  /** Cifras de la franja de credibilidad. */
  facts: [
    { value: "14", label: "años de práctica" },
    { value: "9", label: "exposiciones individuales" },
    { value: "4", label: "colecciones públicas" },
    { value: "6-9", label: "meses por pieza grande" },
  ],
};

/** Retrato / foto de estudio de la sección «Estudio». */
export const studioShot = {
  slug: "estudio",
  title: "Yana Samsonova en el estudio",
  seed: 7781,
  palette: arcilla,
  // image: "/yana/estudio.jpg",
};

export const series: Series[] = [
  {
    slug: "deshielo",
    title: "Deshielo",
    years: "2023 — 2025",
    tagline: "Ocho lienzos sobre el agua que todavía no sabe que lo es.",
    description:
      "Pintada a lo largo de tres inviernos en el norte, la serie sigue un mismo motivo —una superficie helada que cede— hasta agotarlo. El azul se enfría lienzo a lienzo hasta volverse casi blanco.",
    seed: 1042,
    palette: deshielo,
  },
  {
    slug: "camara-de-eco",
    title: "Cámara de eco",
    years: "2021 — 2023",
    tagline: "Interiores rojos donde la figura ya se ha ido.",
    description:
      "La serie más caliente y la más pequeña en formato. Habitaciones vacías tratadas como retratos: la huella de un cuerpo en la temperatura de una pared.",
    seed: 2087,
    palette: ecos,
  },
  {
    slug: "interiores-de-agua",
    title: "Interiores de agua",
    years: "2019 — 2021",
    tagline: "Vegetación vista desde debajo de la superficie.",
    description:
      "El primer conjunto en gran formato. Verdes densos aplicados en más de veinte veladuras, con la luz entrando siempre desde fuera del cuadro.",
    seed: 3311,
    palette: interiores,
  },
];

export const works: Artwork[] = [
  {
    slug: "deshielo-vii",
    title: "Deshielo VII",
    year: 2025,
    medium: "Óleo sobre lino",
    dimensions: "180 × 240 cm",
    series: "deshielo",
    note: "La pieza que cierra la serie. Nueve meses de trabajo y la paleta reducida a cuatro pigmentos.",
    available: true,
    seed: 1042,
    palette: deshielo,
  },
  {
    slug: "deshielo-iii",
    title: "Deshielo III",
    year: 2024,
    medium: "Óleo sobre lino",
    dimensions: "150 × 150 cm",
    series: "deshielo",
    note: "Primer lienzo en que la línea de horizonte desaparece por completo.",
    available: false,
    seed: 1187,
    palette: deshielo,
  },
  {
    slug: "sala-roja",
    title: "Sala roja",
    year: 2023,
    medium: "Óleo sobre tabla preparada",
    dimensions: "90 × 70 cm",
    series: "camara-de-eco",
    note: "Colección privada, Lisboa.",
    available: false,
    seed: 2087,
    palette: ecos,
  },
  {
    slug: "eco-ii",
    title: "Eco II",
    year: 2022,
    medium: "Óleo sobre tabla preparada",
    dimensions: "60 × 45 cm",
    series: "camara-de-eco",
    note: "Uno de los cuatro estudios pequeños que dieron origen a la serie.",
    available: true,
    seed: 2210,
    palette: ecos,
  },
  {
    slug: "bajo-la-superficie",
    title: "Bajo la superficie",
    year: 2021,
    medium: "Óleo sobre lino",
    dimensions: "200 × 160 cm",
    series: "interiores-de-agua",
    note: "Veintitrés veladuras. Adquirida por una colección pública en 2022.",
    available: false,
    seed: 3311,
    palette: interiores,
  },
  {
    slug: "raiz",
    title: "Raíz",
    year: 2020,
    medium: "Óleo sobre lino",
    dimensions: "130 × 97 cm",
    series: "interiores-de-agua",
    note: "El cuadro con el que arranca el uso sistemático de pigmento molido en estudio.",
    available: true,
    seed: 3498,
    palette: arcilla,
  },
  {
    slug: "deshielo-i",
    title: "Deshielo I",
    year: 2023,
    medium: "Óleo sobre lino",
    dimensions: "120 × 120 cm",
    series: "deshielo",
    note: "El punto de partida de la serie, pintado del natural en tres sesiones.",
    available: true,
    seed: 1355,
    palette: deshielo,
  },
];

export type Exhibition = {
  year: string;
  title: string;
  venue: string;
  city: string;
  kind: "Individual" | "Colectiva" | "Feria" | "Colección";
};

export const exhibitions: Exhibition[] = [
  {
    year: "2025",
    title: "Deshielo",
    venue: "Galería Norte",
    city: "Madrid",
    kind: "Individual",
  },
  {
    year: "2024",
    title: "Pintura ahora",
    venue: "Centro de Arte Contemporáneo",
    city: "Valencia",
    kind: "Colectiva",
  },
  {
    year: "2024",
    title: "Estand B12",
    venue: "Feria de Arte Contemporáneo",
    city: "Basilea",
    kind: "Feria",
  },
  {
    year: "2023",
    title: "Cámara de eco",
    venue: "Fundação Serralves — Sala 3",
    city: "Oporto",
    kind: "Individual",
  },
  {
    year: "2022",
    title: "Adquisición permanente",
    venue: "Colección del Estado",
    city: "Madrid",
    kind: "Colección",
  },
  {
    year: "2021",
    title: "Interiores de agua",
    venue: "Espacio Lienzo",
    city: "Barcelona",
    kind: "Individual",
  },
];

/** Pasos del apartado "El proceso". */
export const process = [
  {
    step: "01",
    title: "El soporte",
    body: "Lino belga tensado y preparado a mano con cola de conejo y creta. Tres semanas de secado antes de que la primera capa de color toque la tela.",
  },
  {
    step: "02",
    title: "El pigmento",
    body: "Parte de los azules y los ocres se muelen en el estudio. Es lo que permite mantener la misma temperatura de color a lo largo de toda una serie.",
  },
  {
    step: "03",
    title: "La veladura",
    body: "Entre quince y veinticinco capas translúcidas. Cada una necesita secar por completo, así que el cuadro avanza a razón de una capa por semana.",
  },
  {
    step: "04",
    title: "El cierre",
    body: "El último gesto es sustractivo: se levanta color con trapo hasta encontrar la luz que ya estaba debajo. No hay barniz final.",
  },
];

export function getWorksBySeries(slug: string): Artwork[] {
  return works.filter((work) => work.series === slug);
}
