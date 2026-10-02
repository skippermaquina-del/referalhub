import type { Metadata } from "next";
import { copy, paths, type Lang } from "@/data/allegiant";

/** Metadatos por idioma y página, con los enlaces hreflang entre ambos idiomas. */
export function buildMetadata(lang: Lang, page: "home" | "tour"): Metadata {
  const m = copy[lang].meta;
  const en = paths("en");
  const es = paths("es");
  const title = page === "home" ? m.title : m.tourTitle;
  const description = page === "home" ? m.description : m.tourDescription;

  return {
    title,
    description,
    alternates: {
      canonical: page === "home" ? paths(lang).home : paths(lang).tour,
      languages: {
        en: page === "home" ? en.home : en.tour,
        es: page === "home" ? es.home : es.tour,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "es" ? "es_US" : "en_US",
    },
  };
}
