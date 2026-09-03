import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Marcellus } from "next/font/google";
import { LangProvider } from "@/components/eyeodin/LangProvider";
import { Nav } from "@/components/eyeodin/Nav";
import { company } from "@/data/eyeodin";
import "./eyeodin.css";

// Sans de texto: neutral y de buena lectura en párrafos largos.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-eo-sans",
  display: "swap",
});

// Serif romana para los titulares: da el registro clásico náutico sin
// caer en la caligrafía.
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-eo-serif",
  display: "swap",
});

// Monoespaciada para cifras, etiquetas y todo lo que deba leerse como
// lectura de instrumento.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-eo-mono",
  display: "swap",
});

// El título fija el español porque `metadata` se resuelve en el servidor,
// antes de saber qué idioma elegirá el visitante; el subtítulo en inglés
// cubre al lector que llegue desde una búsqueda en ese idioma.
export const metadata: Metadata = {
  title: `${company.name} — ${company.tagline.es}`,
  description: company.description.es,
  openGraph: {
    title: `${company.name} — ${company.tagline.es} · ${company.tagline.en}`,
    description: company.description.es,
    type: "website",
  },
};

export default function EyeOdinLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LangProvider
      className={`${manrope.variable} ${marcellus.variable} ${mono.variable} eyeodin`}
    >
      <Nav />
      {children}
    </LangProvider>
  );
}
