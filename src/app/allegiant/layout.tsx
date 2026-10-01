import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { business } from "@/data/allegiant";
import "./allegiant.css";

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-allegiant-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${business.name} — Appliance Repair`,
  description: business.subhead,
  openGraph: {
    title: `${business.name} — Appliance Repair`,
    description: business.subhead,
    type: "website",
    images: ["/allegiant/logo-full.jpg"],
  },
};

export default function AllegiantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${sans.variable} allegiant`}>{children}</div>;
}
