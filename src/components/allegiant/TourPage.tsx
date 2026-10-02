import type { Lang } from "@/data/allegiant";
import { AllegiantShell } from "./AllegiantShell";
import { Tour } from "./Tour";

export function TourPage({ lang }: { lang: Lang }) {
  return (
    <div lang={lang}>
      <AllegiantShell lang={lang} floating={false}>
        <Tour lang={lang} />
      </AllegiantShell>
    </div>
  );
}
