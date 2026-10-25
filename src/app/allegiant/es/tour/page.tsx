import type { Metadata } from "next";
import { TourPage } from "@/components/allegiant/TourPage";
import { buildMetadata } from "@/components/allegiant/metadata";

export const metadata: Metadata = buildMetadata("es", "tour");

export default function Page() {
  return <TourPage lang="es" />;
}
