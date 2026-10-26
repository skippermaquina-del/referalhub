import type { Metadata } from "next";
import { LegalPage } from "@/components/allegiant/LegalPage";
import { privacy } from "@/data/allegiant-legal";

export const metadata: Metadata = {
  title: `${privacy.en.title} — Allegiant Appliances`,
  alternates: { canonical: "/allegiant/privacy" },
};

export default function Page() {
  return <LegalPage lang="en" kind="privacy" />;
}
