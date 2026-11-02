import { workCopy } from "@/data/allegiant-work";
import { AllegiantShell } from "@/components/allegiant/AllegiantShell";
import { Header } from "@/components/allegiant/Header";
import { WorkPage } from "@/components/allegiant/WorkPage";

export const metadata = {
  title: workCopy.en.meta.title,
  description: workCopy.en.meta.description,
};

export default function Page() {
  return (
    <div lang="en" className="allegiant">
      <AllegiantShell lang="en">
        <Header lang="en" />
        <main>
          <WorkPage lang="en" />
        </main>
      </AllegiantShell>
    </div>
  );
}
