import { AdminPanel } from "@/components/allegiant/AdminPanel";
// El panel es una herramienta compartida, pero sus clases `al-*` todavía viven
// en la hoja de Allegiant. Se importa acá para que el panel de SuperHman se vea
// igual. Cuando el panel se mueva a `components/admin` con su propia hoja,
// este import se va.
import "@/app/allegiant/allegiant.css";

export const metadata = {
  title: "Admin — SuperHman",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <div className="allegiant">
      <AdminPanel tenant="superhman" />
    </div>
  );
}
