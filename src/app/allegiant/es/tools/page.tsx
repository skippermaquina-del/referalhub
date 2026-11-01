import { toolsCopy } from "@/data/allegiant-tools";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";
import { ToolsPage } from "@/components/allegiant/ToolsPage";

export const metadata = {
  title: toolsCopy.es.meta.title,
  description: toolsCopy.es.meta.description,
};

export default function Page() {
  return (
    <div lang="es" className="allegiant">
      <AllegiantShell lang="es">
        <Header lang="es" />
        <main>
          <ToolsPage lang="es" />
        </main>
      </AllegiantShell>
    </div>
  );
}
