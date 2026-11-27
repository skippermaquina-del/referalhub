import type { Metadata } from "next";
import { HomePage } from "@/components/superhman/HomePage";

export const metadata: Metadata = {
  title: "SuperHman Handyman — Broward, Miami-Dade y Boca Raton",
  description:
    "Colgamos TV, parchamos y pintamos paredes, ajustamos puertas, armamos muebles y colgamos estantes y espejos. Una persona, la misma semana, precio antes de empezar. Presupuesto gratis.",
  alternates: { canonical: "/superhman/es", languages: { "en-US": "/superhman" } },
};

export default function Page() {
  return <HomePage lang="es" />;
}
