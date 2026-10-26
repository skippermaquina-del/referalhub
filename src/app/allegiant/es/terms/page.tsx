import type { Metadata } from "next";
import { LegalPage } from "@/components/allegiant/LegalPage";
import { terms } from "@/data/allegiant-legal";

export const metadata: Metadata = {
  title: `${terms.es.title} — Allegiant Appliances`,
  alternates: { canonical: "/allegiant/es/terms" },
};

export default function Page() {
  return <LegalPage lang="es" kind="terms" />;
}
