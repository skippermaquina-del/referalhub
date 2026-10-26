import type { Metadata } from "next";
import { LegalPage } from "@/components/allegiant/LegalPage";
import { terms } from "@/data/allegiant-legal";

export const metadata: Metadata = {
  title: `${terms.en.title} — Allegiant Appliances`,
  alternates: { canonical: "/allegiant/terms" },
};

export default function Page() {
  return <LegalPage lang="en" kind="terms" />;
}
