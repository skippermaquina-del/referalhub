/**
 * CONTENIDO REAL — Yana Samsonova / Art & Soul
 * =============================================
 * Transcripto del sitio en producción (ysartofsoul.com): copy, obras,
 * colecciones, contacto y paleta de color son los reales de la artista.
 *
 * Las obras siguen sin fotografía: usan el mismo lienzo generativo
 * (`palette` + `seed`) que el resto del sitio, con paletas extraídas de los
 * degradados reales de ysartofsoul.com. Cuando haya fotos, añadir
 * `image: "/yana/obra-x.jpg"` y `components/yana/Artwork.tsx` las usa en
 * lugar del generativo.
 */

export type Palette = {
  /** Color de fondo del lienzo. */
  base: string;
  /** Colores de las manchas, de la más oscura a la más clara. */
  layers: string[];
  /** Color de los trazos finos superpuestos. */
  stroke: string;
};

export type Artwork = {
  slug: string;
  title: string;
  /** Frase corta en cursiva, solo la obra destacada la usa. */
  tagline?: string;
  medium: string;
  dimensions: string;
  /** Texto de sala, 1–2 frases. */
  note: string;
  available: boolean;
  seed: number;
  palette: Palette;
  /** Ruta a la foto real. Si existe, sustituye al lienzo generativo. */
  image?: string;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  seed: number;
  palette: Palette;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  status: string;
};

// Paletas extraídas de los degradados reales de ysartofsoul.com.
const mar: Palette = {
  base: "#0d333d",
  layers: ["#0f4a55", "#14606b", "#4f9ea6", "#dcbc8a"],
  stroke: "#f4e7d3",
};

const atardecer: Palette = {
  base: "#241531",
  layers: ["#5c2a4a", "#c2541f", "#f2941b", "#ffd98a"],
  stroke: "#ffe3a8",
};

const horizonte: Palette = {
  base: "#2a1d10",
  layers: ["#4a3320", "#7d5733", "#b98b52", "#dcbc8a"],
  stroke: "#f2ebe0",
};

const naturaleza: Palette = {
  base: "#0f1923",
  layers: ["#1d2e1a", "#31502c", "#5e8a4e", "#a8c087"],
  stroke: "#e7ebd6",
};

const realismo: Palette = {
  base: "#241531",
  layers: ["#3d1f36", "#5c2a4a", "#b98b52", "#dcbc8a"],
  stroke: "#f2ebe0",
};

export const artist = {
  name: "Yana Samsonova",
  brand: "Art & Soul",
  role: "Artista plástica en formación",
  headline: "Arte que conecta tu alma con lo que te rodea",
  subhead:
    "Obras originales en acrílico y óleo. Cada pieza es única, firmada y viaja con su certificado de autenticidad.",
  bio: [
    "Soy Yana Samsonova, artista plástica en formación. Pinto para expresar emociones, sensaciones y momentos que no siempre pueden decirse con palabras.",
    "Trabajo con acrílico y óleo, explorando el realismo, la naturaleza y la abstracción. El mar, la luz, los animales y las emociones humanas son mi principal inspiración.",
    "Cada obra es una búsqueda personal: crear imágenes que conecten, transmitan y acompañen a quien las observa.",
    "Creo en el arte como una forma de emocionar, conectar y transformar espacios.",
  ],
  closing: "Bienvenidos a mi mundo de Arte & Soul.",
  whatsapp: "+54 9 2804 61 2293",
  whatsappLink: "https://wa.me/5492804612293",
  email: "syana33.ys@gmail.com",
  instagram: "https://instagram.com/ys_artofthesoul",
  instagramHandle: "@ys_artofthesoul",
  /** Franja de confianza bajo la portada. */
  trust: [
    { title: "Obra original", detail: "Única y auténtica" },
    { title: "Firmada", detail: "Por la artista" },
    { title: "Certificado", detail: "De autenticidad" },
    { title: "Embalaje seguro", detail: "Envíos a todo el país" },
  ],
  /** Franja de condiciones, justo antes del pie. */
  footerTrust: [
    { title: "Envíos", detail: "A todo el país, con embalaje profesional." },
    { title: "Medios de pago", detail: "Transferencia, efectivo o Mercado Pago." },
    { title: "Obra única", detail: "Una vez vendida, ya no estará disponible." },
  ],
};

export const works: Artwork[] = [
  {
    slug: "entre-mar-y-arena",
    title: "Entre Mar y Arena",
    tagline: "Fluir es recordar quién sos",
    medium: "Acrílico con textura y detalles en dorado",
    dimensions: "1,00 × 0,80 m",
    note: "Donde la fuerza del mar se encuentra con la calma de la tierra. Texturas que invitan a sentir y líneas doradas que representan los caminos del alma. Pensada para espacios que buscan armonía, energía y sofisticación.",
    available: true,
    seed: 4471,
    palette: mar,
  },
  {
    slug: "atardecer-sobre-el-mar",
    title: "Atardecer sobre el mar",
    medium: "Acrílico sobre lienzo",
    dimensions: "60 × 80 cm",
    note: "Una escena marina llena de luz y movimiento.",
    available: true,
    seed: 5820,
    palette: atardecer,
  },
  {
    slug: "hacia-el-horizonte",
    title: "Hacia el Horizonte",
    medium: "Óleo y acrílico sobre lienzo",
    dimensions: "50 × 70 cm",
    note: "Una obra que invita a soltar, confiar y seguir.",
    available: true,
    seed: 6203,
    palette: horizonte,
  },
];

export const collections: Collection[] = [
  {
    slug: "mar",
    title: "Mar",
    description: "El mar y la luz: olas, atardeceres y horizontes.",
    seed: 4471,
    palette: mar,
  },
  {
    slug: "naturaleza",
    title: "Naturaleza",
    description: "Los animales y la materia viva, en acrílico y óleo.",
    seed: 7310,
    palette: naturaleza,
  },
  {
    slug: "realismo",
    title: "Realismo",
    description: "La figura y la emoción humana.",
    seed: 8890,
    palette: realismo,
  },
];

/** Retrato / imagen que acompaña la sección «La artista». */
export const portraitShot = {
  slug: "la-artista",
  title: "Yana Samsonova",
  seed: 9142,
  palette: realismo,
};

export const blogPosts: BlogPost[] = [
  {
    slug: "arte-y-decoracion",
    title: "Arte y decoración",
    excerpt:
      "Cómo elegir una obra según la luz, el tamaño de la pared y los colores que ya tenés en casa.",
    status: "Próximamente",
  },
  {
    slug: "proceso-creativo",
    title: "Proceso creativo",
    excerpt:
      "Del boceto a la última capa: cómo nace una obra con textura y por qué cada una lleva su tiempo.",
    status: "Próximamente",
  },
];
