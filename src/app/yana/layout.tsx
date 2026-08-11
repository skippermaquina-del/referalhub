import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/yana/Nav";
import { artist } from "@/data/yana";
import "./yana.css";

// Inter es la alternativa libre más cercana a SF Pro, que es lo que da a las
// páginas de Apple su aire característico en titulares grandes.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-yana-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${artist.name} — ${artist.role}`,
  description: artist.subhead,
  openGraph: {
    title: `${artist.name} — ${artist.role}`,
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
    <div className={`${inter.variable} yana`}>
      <Nav />
      {children}
    </div>
  );
}
