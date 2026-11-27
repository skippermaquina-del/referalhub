import type { Metadata } from "next";
import { PrivacyPage } from "@/components/superhman/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — SuperHman Handyman",
  robots: { index: true, follow: true },
};

export default function Page() {
  return <PrivacyPage lang="en" />;
}
