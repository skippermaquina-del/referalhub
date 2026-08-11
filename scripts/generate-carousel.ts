// Renders the Instagram carousel slides to PNG using next/og's ImageResponse
// (Satori under the hood) — no design tool or paid service needed.
//
// Usage: node scripts/generate-carousel.ts

import { ImageResponse } from "@vercel/og";
import { mkdir, writeFile } from "node:fs/promises";
import React from "react";
import QRCode from "qrcode";

const h = React.createElement;

const EMERALD = "#10b981";
const AMBER = "#d97706";
const WIDTH = 1080;
const HEIGHT = 1350;
const SITE_URL = "https://referalhub.vercel.app";

type SlideContent =
  | { kind: "cover"; title: string; subtitle: string }
  | { kind: "offer"; emoji: string; name: string; bonus: string; description: string }
  | { kind: "cta"; heading: string; sub: string; tagline: string; qrCodeDataUrl: string };

function brandMark() {
  return h(
    "div",
    { style: { display: "flex", fontSize: 32, fontWeight: 700, color: "#171717" } },
    h("span", null, "Referral"),
    h("span", { style: { color: EMERALD } }, "Hub")
  );
}

function renderSlide(content: SlideContent) {
  if (content.kind === "cta") {
    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: EMERALD,
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        },
      },
      h("div", { style: { fontSize: 64, fontWeight: 700 } }, content.heading),
      h("div", { style: { fontSize: 48, fontWeight: 700, color: AMBER, marginTop: 40 } }, content.sub),
      h("div", { style: { fontSize: 28, marginTop: 24, opacity: 0.9 } }, content.tagline),
      h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            padding: 24,
            borderRadius: 24,
            marginTop: 48,
          },
        },
        h("img", {
          src: content.qrCodeDataUrl,
          width: 220,
          height: 220,
        })
      ),
      h("div", { style: { fontSize: 22, marginTop: 20, opacity: 0.85 } }, "Escaneá para entrar")
    );
  }

  if (content.kind === "cover") {
    return h(
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
      brandMark(),
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
        h("div", { style: { fontSize: 72, fontWeight: 800, lineHeight: 1.15, color: "#171717" } }, content.title),
        h("div", { style: { fontSize: 40, color: AMBER, fontWeight: 700, marginTop: 40 } }, content.subtitle)
      )
    );
  }

  return h(
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
    brandMark(),
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
      h("div", { style: { fontSize: 140, display: "flex" } }, content.emoji),
      h("div", { style: { fontSize: 72, fontWeight: 800, marginTop: 20, color: "#171717" } }, content.name),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "white",
            backgroundColor: EMERALD,
            padding: "16px 40px",
            borderRadius: 999,
            marginTop: 30,
          },
        },
        content.bonus
      ),
      h(
        "div",
        { style: { fontSize: 28, color: "#525252", marginTop: 30, maxWidth: 720, display: "flex" } },
        content.description
      )
    )
  );
}

const slides: { file: string; content: SlideContent }[] = [
  {
    file: "01-cover",
    content: { kind: "cover", title: "5 ofertas para ganar dinero gratis", subtitle: "Deslizá para verlas →" },
  },
  {
    file: "02-paypal",
    content: {
      kind: "offer",
      emoji: "💸",
      name: "PayPal",
      bonus: "$10 por amigo (hasta $100/año)",
      description: "Pagos y transferencias online",
    },
  },
  {
    file: "03-robinhood",
    content: {
      kind: "offer",
      emoji: "📈",
      name: "Robinhood",
      bonus: "Acción gratis",
      description: "Trading sin comisiones",
    },
  },
  {
    file: "04-coinbase",
    content: {
      kind: "offer",
      emoji: "🪙",
      name: "Coinbase",
      bonus: "Hasta $10 en cripto",
      description: "El exchange más fácil para empezar",
    },
  },
  {
    file: "05-rakuten",
    content: {
      kind: "offer",
      emoji: "🛍️",
      name: "Rakuten",
      bonus: "$50 cashback",
      description: "Cashback en miles de tiendas online",
    },
  },
  {
    file: "06-uber",
    content: {
      kind: "offer",
      emoji: "🚗",
      name: "Uber (conductor)",
      bonus: "$1,750 de bono",
      description: "Por manejar o repartir con Uber",
    },
  },
  {
    file: "07-cta",
    content: {
      kind: "cta",
      heading: "ReferralHub",
      sub: "Link en mi bio 👆",
      tagline: "Todas las ofertas de referidos en un solo lugar",
      qrCodeDataUrl: "", // filled in by main() — Instagram doesn't allow clickable links on images, so this QR is the workaround
    },
  },
];

async function main() {
  const outDir = "public/social/carousel";
  await mkdir(outDir, { recursive: true });

  const ctaSlide = slides.find((slide) => slide.content.kind === "cta");
  if (ctaSlide && ctaSlide.content.kind === "cta") {
    ctaSlide.content.qrCodeDataUrl = await QRCode.toDataURL(SITE_URL, {
      width: 440, // 2x for crispness at the 220px render size
      margin: 1,
      color: { dark: "#171717", light: "#ffffff" },
    });
  }

  for (const slide of slides) {
    const response = new ImageResponse(renderSlide(slide.content) as React.ReactElement, {
      width: WIDTH,
      height: HEIGHT,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(`${outDir}/${slide.file}.png`, buffer);
    console.log(`Generado ${outDir}/${slide.file}.png`);
  }
}

main();
