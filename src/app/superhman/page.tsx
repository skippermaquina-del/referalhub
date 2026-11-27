import type { Metadata } from "next";
import { HomePage } from "@/components/superhman/HomePage";

export const metadata: Metadata = {
  title: "SuperHman Handyman — Broward, Miami-Dade & Boca Raton",
  description:
    "TV mounting, drywall patched and painted, doors, furniture assembly, shelves and mirrors hung. One person, same week, price before I start. Free estimates.",
  alternates: { canonical: "/superhman", languages: { "es-US": "/superhman/es" } },
};

export default function Page() {
  return <HomePage lang="en" />;
}
