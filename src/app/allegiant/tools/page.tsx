import { toolsCopy } from "@/data/allegiant-tools";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";
import { ToolsPage } from "@/components/allegiant/ToolsPage";

export const metadata = {
  title: toolsCopy.en.meta.title,
  description: toolsCopy.en.meta.description,
};

export default function Page() {
  return (
    <div lang="en" className="allegiant">
      <AllegiantShell lang="en">
        <Header lang="en" />
        <main>
          <ToolsPage lang="en" />
        </main>
      </AllegiantShell>
    </div>
  );
}
