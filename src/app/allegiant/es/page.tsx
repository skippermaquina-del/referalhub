import type { Metadata } from "next";
import { HomePage } from "@/components/allegiant/HomePage";
import { buildMetadata } from "@/components/allegiant/metadata";

export const metadata: Metadata = buildMetadata("es", "home");

export default function Page() {
  return <HomePage lang="es" />;
}
