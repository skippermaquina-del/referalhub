import type { Metadata } from "next";
import { LegalPage } from "@/components/allegiant/LegalPage";
import { privacy } from "@/data/allegiant-legal";

export const metadata: Metadata = {
  title: `${privacy.es.title} — Allegiant Appliances`,
  alternates: { canonical: "/allegiant/es/privacy" },
};

export default function Page() {
  return <LegalPage lang="es" kind="privacy" />;
}
