import { QuoteTool } from "@/components/superhman/QuoteTool";
import "./quote.css";

/**
 * Cotizador interno de SuperHman.
 *
 * Sobre el código de la pantalla de entrada: oculta la herramienta, no la
 * cierra con llave. El cálculo corre en el teléfono, así que el modelo de
 * precios viaja al navegador de cualquiera que abra esta dirección. Lo que sí
 * está cerrado de verdad es guardar: eso pasa por el servidor y pide el código.
 * Alcanza para que no quede abierto en un teléfono prestado; no alcanza para
 * esconderle los precios a un competidor que encuentre la URL.
 */

export const metadata = {
  title: "Cotizador — SuperHman",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <QuoteTool />;
}
