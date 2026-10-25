import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const ALLEGIANT_HOST = "allegiantappliance.com";

/** En el dominio de Allegiant se indica el mapa del sitio y se oculta el panel interno. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = ((await headers()).get("host") ?? "").toLowerCase();
  if (!host.endsWith(ALLEGIANT_HOST)) {
    return { rules: { userAgent: "*", allow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/allegiant/admin", "/api/"] },
    sitemap: `https://${ALLEGIANT_HOST}/sitemap.xml`,
  };
}
