import type { Metadata } from "next";
import { Inter, Playfair_Display, Petit_Formal_Script } from "next/font/google";
import { Nav } from "@/components/yana/Nav";
import { artist } from "@/data/yana";
import "./yana.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-yana-sans",
  display: "swap",
});

// Serif elegante para titulares, en línea con la tipografía del sitio real.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-yana-serif",
  display: "swap",
});

// Cursiva para la firma / wordmark del logo ("Yana Samsonova").
const script = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yana-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${artist.name} — ${artist.brand}`,
  description: artist.subhead,
  openGraph: {
    title: `${artist.name} — ${artist.brand}`,
    description: artist.subhead,
    type: "profile",
  },
};

export default function YanaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${script.variable} yana`}>
      <Nav />
      {children}
    </div>
  );
}
