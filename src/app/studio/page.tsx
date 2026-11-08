import type { Metadata } from "next";
import { StudioApp } from "@/components/studio/StudioApp";

export const metadata: Metadata = {
  title: "Shorts Studio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioApp />;
}
