import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { BlogList } from "@/components/allegiant/BlogList";
import { Header } from "@/components/allegiant/Header";

export const metadata = {
  title: "Blog: Consejos y guías de reparación — Allegiant Appliances",
  description: "Aprende cómo mantener y solucionar problemas en tus electrodomésticos. Consejos y guías para todas las marcas principales.",
  robots: "index, follow",
};

export default function BlogPageES() {
  return (
    <div lang="es">
      <AllegiantShell lang="es">
        <Header lang="es" />
        <main>
          <BlogList lang="es" />
        </main>
      </AllegiantShell>
    </div>
  );
}
