// Renders a single English-language Instagram promo image summarizing the
// top referral offers, using next/og's ImageResponse (Satori under the
// hood) — same approach as generate-carousel.ts and
// generate-elevenlabs-promo.ts.
//
// Usage: node scripts/generate-offers-promo.ts

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

const offers: { emoji: string; name: string; bonus: string }[] = [
  { emoji: "💸", name: "PayPal", bonus: "$10 per friend" },
  { emoji: "📈", name: "Robinhood", bonus: "Free stock" },
  { emoji: "🪙", name: "Coinbase", bonus: "Up to $10 in crypto" },
  { emoji: "🛍️", name: "Rakuten", bonus: "$50 cashback" },
  { emoji: "🚗", name: "Uber (drive)", bonus: "$1,750 bonus" },
];

function brandMark() {
  return h(
    "div",
    { style: { display: "flex", fontSize: 32, fontWeight: 700, color: "#171717" } },
    h("span", null, "Referral"),
    h("span", { style: { color: EMERALD } }, "Hub")
  );
}

function offerRow(offer: (typeof offers)[number]) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "22px 32px",
        backgroundColor: "#fafafa",
        borderRadius: 16,
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 20 } },
      h("span", { style: { fontSize: 40, display: "flex" } }, offer.emoji),
      h("span", { style: { fontSize: 32, fontWeight: 700, color: "#171717" } }, offer.name)
    ),
    h(
      "span",
      {
        style: {
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
          color: "white",
          backgroundColor: EMERALD,
          padding: "10px 22px",
          borderRadius: 999,
        },
      },
      offer.bonus
    )
  );
}

async function main() {
  const outDir = "public/social";
  await mkdir(outDir, { recursive: true });

  const qrCodeDataUrl = await QRCode.toDataURL(SITE_URL, {
    width: 360,
    margin: 1,
    color: { dark: "#171717", light: "#ffffff" },
  });

  const slide = h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 72,
        fontFamily: "sans-serif",
      },
    },
    brandMark(),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32 } },
      h(
        "div",
        { style: { fontSize: 60, fontWeight: 800, lineHeight: 1.15, color: "#171717", textAlign: "center" } },
        "5 ways to get paid to sign up"
      ),
      h(
        "div",
        { style: { fontSize: 28, color: AMBER, fontWeight: 700, marginTop: 16 } },
        "Real referral bonuses, no cost to you"
      )
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 18, marginTop: 44 } },
      ...offers.map(offerRow)
    ),
    h(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 44 } },
      h("img", { src: qrCodeDataUrl, width: 180, height: 180 }),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", fontSize: 26, color: "#525252", maxWidth: 380 } },
        h("span", { style: { fontWeight: 700, color: "#171717" } }, "Scan to see all offers"),
        h("span", { style: { marginTop: 8 } }, "or tap the link in bio")
      )
    )
  );

  const response = new ImageResponse(slide as React.ReactElement, { width: WIDTH, height: HEIGHT });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(`${outDir}/offers-promo.png`, buffer);
  console.log(`Generated ${outDir}/offers-promo.png`);
}

main();
