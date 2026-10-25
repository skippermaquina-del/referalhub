import type { NextConfig } from "next";

/** Dominios propios de Allegiant Appliances Inc. */
const ALLEGIANT_PRIMARY = "allegiantappliance.com";
const ALLEGIANT_ALIASES = [
  "www.allegiantappliance.com",
  "allegiantappliance.us",
  "www.allegiantappliance.us",
];

const nextConfig: NextConfig = {
  async redirects() {
    // Todos los dominios alternos llevan al principal (.com), conservando la ruta.
    return ALLEGIANT_ALIASES.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${ALLEGIANT_PRIMARY}/:path*`,
      permanent: true,
    }));
  },
  async rewrites() {
    // En el dominio de Allegiant, la raíz sirve el sitio de /allegiant.
    const has = [{ type: "host" as const, value: ALLEGIANT_PRIMARY }];
    return {
      beforeFiles: [
        { source: "/", has, destination: "/allegiant" },
        { source: "/es", has, destination: "/allegiant/es" },
        { source: "/tour", has, destination: "/allegiant/tour" },
        { source: "/es/tour", has, destination: "/allegiant/es/tour" },
      ],
    };
  },
};

export default nextConfig;
