/**
 * Proyectos del Estudio de Shorts (/studio).
 *
 * Cada negocio tiene su marca (colores, logo, teléfono) y su propio código de
 * acceso, que vive en Vercel como `STUDIO_CODE_<SLUG>` (por ejemplo
 * `STUDIO_CODE_ALLEGIANT`). Para sumar un negocio nuevo basta con añadir una
 * entrada aquí, su logo en `public/studio/<slug>/logo.png` y su código en Vercel.
 *
 * El script que arma los videos (`scripts/studio/render.mjs`) lee este mismo
 * archivo, así que solo puede usar datos simples (sin imports).
 */

export type StudioProject = {
  slug: string;
  name: string;
  /** Línea corta debajo del nombre en la tarjeta final. */
  tagline: string;
  phone: string;
  website: string;
  /** Color de fondo de la tarjeta final y de las franjas de texto. */
  primary: string;
  /** Color de acento (detalles y teléfono). */
  accent: string;
  /** Ruta del logo dentro de `public/`. */
  logo: string;
  /** Idioma de los textos automáticos del video. */
  lang: "en" | "es";
  /** Texto fijo al final de cada descripción (YouTube, Instagram, TikTok). */
  descriptionFooter: string;
  hashtags: string[];
};

export const studioProjects: Record<string, StudioProject> = {
  allegiant: {
    slug: "allegiant",
    name: "Allegiant Appliances",
    tagline: "Luxury appliance repair · Los Angeles",
    phone: "(323) 578-4010",
    website: "allegiantappliance.com",
    primary: "#1c2f58",
    accent: "#f26f21",
    logo: "studio/allegiant/logo.png",
    lang: "en",
    descriptionFooter:
      "Allegiant Appliances: luxury appliance repair in Los Angeles. Call (323) 578-4010 or book at allegiantappliance.com",
    hashtags: ["#shorts", "#appliancerepair", "#losangeles"],
  },
};
