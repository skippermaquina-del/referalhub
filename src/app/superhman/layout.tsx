import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./superhman.css";

// La misma familia que la tarjeta, la van y el volante.
const sans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sh-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://allegiantappliance.com"),
  title: "SuperHman Handyman",
  robots: { index: true, follow: true },
};

export default function SuperHmanLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${sans.variable} sh`}>{children}</div>;
}
