import { workCopy } from "@/data/allegiant-work";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";
import { WorkPage } from "@/components/allegiant/WorkPage";

export const metadata = {
  title: workCopy.es.meta.title,
  description: workCopy.es.meta.description,
};

export default function Page() {
  return (
    <div lang="es" className="allegiant">
      <AllegiantShell lang="es">
        <Header lang="es" />
        <main>
          <WorkPage lang="es" />
        </main>
      </AllegiantShell>
    </div>
  );
}
