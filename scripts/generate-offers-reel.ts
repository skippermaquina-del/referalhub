// Renders a short looping "hook" video for Instagram Reels: offer cards pop
// in one by one, ending on a held CTA frame with a QR code. Instagram has no
// real .gif upload path — an animated-looking post there is actually an mp4
// loop — so this renders N still frames with next/og's ImageResponse (same
// approach as generate-carousel.ts / generate-offers-promo.ts) at a low
// frame rate, then hands them to ffmpeg to encode+upsample into a real
// 30fps 9:16 video.
//
// Requires ffmpeg on PATH.
//
// Usage: node scripts/generate-offers-reel.ts

import { ImageResponse } from "@vercel/og";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import React from "react";
import QRCode from "qrcode";

const h = React.createElement;

const EMERALD = "#10b981";
const AMBER = "#d97706";
const WIDTH = 1080;
const HEIGHT = 1920; // 9:16, Reels-native
const SITE_URL = "https://referalhub.vercel.app";

const RENDER_FPS = 12; // how many distinct frames we ask Satori to draw
const OUTPUT_FPS = 30; // ffmpeg upsamples RENDER_FPS -> OUTPUT_FPS for smooth playback
const DURATION_S = 5.5;
const TOTAL_FRAMES = Math.round(RENDER_FPS * DURATION_S);

const FRAMES_DIR = "scripts/output/reel-frames";
const OUT_FILE = "public/social/top-offers-reel.mp4";

const offers: { emoji: string; name: string; bonus: string }[] = [
  { emoji: "💸", name: "PayPal", bonus: "$10 per friend" },
  { emoji: "📈", name: "Robinhood", bonus: "Free stock" },
  { emoji: "🪙", name: "Coinbase", bonus: "Up to $10 in crypto" },
  { emoji: "🛍️", name: "Rakuten", bonus: "$50 cashback" },
  { emoji: "🚗", name: "Uber (drive)", bonus: "$1,750 bonus" },
];

// Timeline (seconds)
const TITLE_START = 0.0;
const TITLE_DUR = 0.5;
const SUBTITLE_START = 0.45;
const SUBTITLE_DUR = 0.4;
const OFFERS_START = 1.0;
const OFFER_STAGGER = 0.45;
const OFFER_DUR = 0.45;
const CTA_START = OFFERS_START + offers.length * OFFER_STAGGER; // ~3.25s
const CTA_DUR = 0.5;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function progress(start: number, dur: number, time: number): number {
  const raw = (time - start) / dur;
  return easeOutCubic(Math.min(1, Math.max(0, raw)));
}

function brandMark() {
  return h(
    "div",
    { style: { display: "flex", fontSize: 40, fontWeight: 700, color: "#171717" } },
    h("span", null, "Referral"),
    h("span", { style: { color: EMERALD } }, "Hub")
  );
}

function offerRow(offer: (typeof offers)[number], p: number) {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "26px 36px",
        backgroundColor: "#fafafa",
        borderRadius: 20,
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px)`,
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 24 } },
      h("span", { style: { fontSize: 48, display: "flex" } }, offer.emoji),
      h("span", { style: { fontSize: 38, fontWeight: 700, color: "#171717" } }, offer.name)
    ),
    h(
      "span",
      {
        style: {
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          color: "white",
          backgroundColor: EMERALD,
          padding: "12px 26px",
          borderRadius: 999,
        },
      },
      offer.bonus
    )
  );
}

function renderFrame(time: number, qrCodeDataUrl: string) {
  const titleP = progress(TITLE_START, TITLE_DUR, time);
  const subtitleP = progress(SUBTITLE_START, SUBTITLE_DUR, time);
  const ctaP = progress(CTA_START, CTA_DUR, time);

  return h(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: "0 76px",
        fontFamily: "sans-serif",
      },
    },
    h("div", { style: { display: "flex", opacity: titleP } }, brandMark()),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: 56 } },
      h(
        "div",
        {
          style: {
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#171717",
            textAlign: "center",
            opacity: titleP,
            transform: `scale(${0.85 + 0.15 * titleP})`,
          },
        },
        "5 ways to get paid to sign up"
      ),
      h(
        "div",
        {
          style: {
            fontSize: 34,
            color: AMBER,
            fontWeight: 700,
            marginTop: 24,
            opacity: subtitleP,
            transform: `translateY(${(1 - subtitleP) * 20}px)`,
          },
        },
        "Real referral bonuses, no cost to you"
      )
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 30, marginTop: 76 } },
      ...offers.map((offer, i) => {
        const p = progress(OFFERS_START + i * OFFER_STAGGER, OFFER_DUR, time);
        return offerRow(offer, p);
      })
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          marginTop: 76,
          opacity: ctaP,
          transform: `translateY(${(1 - ctaP) * 30}px)`,
        },
      },
      h("img", { src: qrCodeDataUrl, width: 220, height: 220 }),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", fontSize: 32, color: "#525252", maxWidth: 440 } },
        h("span", { style: { fontWeight: 700, color: "#171717" } }, "Scan to see all offers"),
        h("span", { style: { marginTop: 10 } }, "or tap the link in bio")
      )
    )
  );
}

async function main() {
  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir("public/social", { recursive: true });

  const qrCodeDataUrl = await QRCode.toDataURL(SITE_URL, {
    width: 400,
    margin: 1,
    color: { dark: "#171717", light: "#ffffff" },
  });

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const time = i / RENDER_FPS;
    const response = new ImageResponse(renderFrame(time, qrCodeDataUrl) as React.ReactElement, {
      width: WIDTH,
      height: HEIGHT,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    const frameName = `frame-${String(i).padStart(3, "0")}.png`;
    await writeFile(`${FRAMES_DIR}/${frameName}`, buffer);
    process.stdout.write(`\rRendered ${i + 1}/${TOTAL_FRAMES} frames`);
  }
  console.log();

  console.log("Encoding with ffmpeg...");
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(RENDER_FPS),
      "-i",
      `${FRAMES_DIR}/frame-%03d.png`,
      "-vf",
      `fps=${OUTPUT_FPS},format=yuv420p`,
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-movflags",
      "+faststart",
      OUT_FILE,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    console.error("ffmpeg failed. Is it installed and on PATH?");
    process.exit(1);
  }

  const frameFiles = await readdir(FRAMES_DIR);
  console.log(`\nDone. Encoded ${frameFiles.length} frames into ${OUT_FILE}`);
}

main();
