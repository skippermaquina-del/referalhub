// Renders a single Instagram promo image for the ElevenLabs affiliate offer,
// using next/og's ImageResponse (Satori under the hood) — same approach as
// generate-carousel.ts.
//
// Usage: node scripts/generate-elevenlabs-promo.ts

import { ImageResponse } from "@vercel/og";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import React from "react";
import QRCode from "qrcode";

const h = React.createElement;

const WIDTH = 1080;
const HEIGHT = 1350;
// IG-specific affiliate link, distinct from the one used on the website banner
// (try.elevenlabs.io/ReferralHub), so clicks from this post can be tracked separately.
const AFFILIATE_URL = "https://try.elevenlabs.io/7zsj6o7e01vh";

function brandMark() {
  return h(
    "div",
    { style: { display: "flex", fontSize: 28, fontWeight: 700, color: "#a3a3a3" } },
    h("span", null, "Referral"),
    h("span", { style: { color: "#171717" } }, "Hub")
  );
}

async function main() {
  const outDir = "public/social";
  await mkdir(outDir, { recursive: true });

  const [logoBuffer, qrCodeDataUrl] = await Promise.all([
    readFile("public/elevenlabs-logo.png"),
    QRCode.toDataURL(AFFILIATE_URL, {
      width: 440,
      margin: 1,
      color: { dark: "#171717", light: "#ffffff" },
    }),
  ]);
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const slide = h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 80,
        fontFamily: "sans-serif",
      },
    },
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
      brandMark(),
      h("div", { style: { display: "flex", borderRadius: 999, backgroundColor: "#f5f5f5", padding: "8px 20px", fontSize: 22, color: "#525252" } }, "Destacado")
    ),
    h(
      "div",
      {
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
      h("img", { src: logoDataUrl, width: 480, height: 62, style: { marginBottom: 8 } }),
      h(
        "div",
        { style: { fontSize: 56, fontWeight: 800, lineHeight: 1.2, color: "#171717", marginTop: 40 } },
        "Voz con IA que suena real"
      ),
      h(
        "div",
        { style: { fontSize: 30, color: "#525252", marginTop: 24, maxWidth: 780 } },
        "Texto a voz, clonación de voz y doblaje automático de video a otros idiomas."
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            padding: 24,
            borderRadius: 24,
            marginTop: 56,
          },
        },
        h("img", { src: qrCodeDataUrl, width: 220, height: 220 })
      ),
      h("div", { style: { fontSize: 24, marginTop: 20, color: "#525252" } }, "Escaneá para probarlo gratis")
    )
  );

  const response = new ImageResponse(slide as React.ReactElement, { width: WIDTH, height: HEIGHT });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(`${outDir}/elevenlabs-promo.png`, buffer);
  console.log(`Generado ${outDir}/elevenlabs-promo.png`);
}

main();
