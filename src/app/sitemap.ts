import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { blogPosts } from "@/data/blog";

const ALLEGIANT_HOST = "allegiantappliance.com";

/**
 * Mapa del sitio de Allegiant. Esta aplicación sirve también otros sitios, así
 * que solo se llena cuando la visita llega por el dominio de Allegiant.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = ((await headers()).get("host") ?? "").toLowerCase();
  if (!host.endsWith(ALLEGIANT_HOST)) return [];

  const origin = `https://${ALLEGIANT_HOST}`;
  const pair = (en: string, es: string, lastModified?: string) => [
    { url: origin + en, lastModified, alternates: { languages: { en: origin + en, es: origin + es } } },
    { url: origin + es, lastModified, alternates: { languages: { en: origin + en, es: origin + es } } },
  ];

  return [
    ...pair("/allegiant", "/allegiant/es"),
    ...pair("/allegiant/tour", "/allegiant/es/tour"),
    ...pair("/allegiant/about", "/allegiant/es/about"),
    ...pair("/allegiant/blog", "/allegiant/es/blog"),
    ...pair("/allegiant/privacy", "/allegiant/es/privacy"),
    ...pair("/allegiant/terms", "/allegiant/es/terms"),
    ...blogPosts.flatMap((p) =>
      pair(`/allegiant/blog/${p.slug}`, `/allegiant/es/blog/${p.slug}`, p.publishedAt),
    ),
  ];
}
