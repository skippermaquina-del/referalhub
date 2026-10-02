import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./allegiant.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-al-serif",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-al-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://allegiantappliance.com"),
  title: "Allegiant Appliances",
  robots: { index: true, follow: true },
};

export default function AllegiantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${serif.variable} ${sans.variable} allegiant`}>{children}</div>;
}
