// Bespoke redesign of the Robinhood spotlight Reel — same treatment as
// generate-mercury-spotlight.ts / generate-coinbase-spotlight.ts: real
// Robinhood brand colors (from Brandfetch: signature neon accent #CCFF00,
// near-black dark #110E08) and the actual Robinhood logo (feather mark +
// wordmark) animated in, instead of the generic sky-photo template /
// emerald-amber palette every other spotlight reel uses.
//
// Usage: node scripts/generate-robinhood-spotlight.ts

import { ImageResponse } from "@vercel/og";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import React from "react";
import QRCode from "qrcode";
import { offers } from "../src/data/offers.ts";

const h = React.createElement;

// Robinhood's real brand marks (fetched via Brandfetch, robinhood.com), not
// the generic EMERALD/AMBER used on every other spotlight reel. Robinhood's
// whole identity is built around this neon-on-black contrast, so unlike
// Mercury/Coinbase the accent goes on dark text too, not just a lighter tint.
const ACCENT = "#CCFF00"; // Robinhood's signature neon green
const ACCENT_DIM = "#8fb300"; // deeper shade of the same green, for secondary copy
// (pure neon on dark reads great for a headline but is too loud/low-contrast
// for paragraph text at this size)
const DARK_BG = "#161310"; // near-black with a warm tint, close to Robinhood's
// own #110E08 but slightly lighter so it doesn't read as pure black on a phone
const DARK_BG_2 = "#110E08"; // Robinhood's own dark, for the background gradient
const TEXT_SHADOW = "0 2px 10px rgba(0,0,0,0.55)";

const WIDTH = 1080;
const HEIGHT = 1920; // 9:16, Reels-native
const SITE_URL = "https://referalhub.vercel.app";

const RENDER_FPS = 12;
const OUTPUT_FPS = 30;
const DURATION_S = 6;
const TOTAL_FRAMES = Math.round(RENDER_FPS * DURATION_S);

// Timeline (seconds)
const BRAND_START = -0.3;
const BRAND_DUR = 0.4;
const LOGO_START = 0.15;
const LOGO_DUR = 0.9;
const HERO_START = 1.1;
const HERO_DUR = 0.6;
const NAME_START = 1.7;
const NAME_DUR = 0.5;
const DESC_START = 2.2;
const DESC_DUR = 0.5;
const REQ_START = 2.7;
const REQ_DUR = 0.6;
const TRUST_START = 3.3;
const TRUST_DUR = 0.5;
const CTA_START = 3.8;
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
    { style: { display: "flex", fontSize: 44, fontWeight: 700, color: "white", textShadow: TEXT_SHADOW } },
    h("span", null, "Referral"),
    h("span", { style: { color: ACCENT } }, "Hub")
  );
}

// Soft radial-glow effect behind the logo, faked with stacked translucent
// circles (Satori/@vercel-og doesn't support filter: blur()) — each ring
// bigger and fainter than the last, approximating a glow at video scale.
function logoGlow() {
  const rings = [
    { size: 760, alpha: 0.08 },
    { size: 560, alpha: 0.13 },
    { size: 380, alpha: 0.2 },
  ];
  return h(
    "div",
    { style: { position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" } },
    ...rings.map((r, i) =>
      h("div", {
        key: i,
        style: {
          position: "absolute",
          display: "flex",
          width: r.size,
          height: r.size,
          borderRadius: "50%",
          backgroundColor: `rgba(204,255,0,${r.alpha})`,
        },
      })
    )
  );
}

async function run() {
  const offer = offers.find((o) => o.slug === "robinhood");
  if (!offer) {
    console.error('No offer with slug "robinhood" in src/data/offers.ts');
    process.exit(1);
  }

  const FRAMES_DIR = "scripts/output/spotlight-frames-robinhood";
  const OUT_FILE = "public/social/spotlight-robinhood.mp4";
  // "Free stock" isn't a dollar figure, so it renders as plain fading text
  // (same non-numeric-bonus handling as the generic script) rather than a
  // count-up.
  const HERO_TEXT = offer.bonus;

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir("public/social", { recursive: true });

  // Robinhood's logo asset is the feather mark + wordmark combined (Brandfetch
  // doesn't expose the feather alone) — sized to its real ~800x290 aspect
  // rather than forced square.
  const LOGO_WIDTH = 520;
  const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 290) / 800);

  const [logoBuffer, qrCodeDataUrl] = await Promise.all([
    readFile("public/robinhood-logo.png"),
    QRCode.toDataURL(SITE_URL, {
      width: 400,
      margin: 1,
      color: { dark: "#ffffff", light: "#00000000" },
    }),
  ]);
  const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  function renderFrame(time: number) {
    const brandP = progress(BRAND_START, BRAND_DUR, time);
    const logoP = progress(LOGO_START, LOGO_DUR, time);
    const heroP = progress(HERO_START, HERO_DUR, time);
    const nameP = progress(NAME_START, NAME_DUR, time);
    const descP = progress(DESC_START, DESC_DUR, time);
    const reqP = progress(REQ_START, REQ_DUR, time);
    const trustP = progress(TRUST_START, TRUST_DUR, time);
    const ctaP = progress(CTA_START, CTA_DUR, time);

    // Logo movement: a bouncy scale/rotate entrance (slight overshoot via the
    // sine bump) that settles into a continuous, gentle float + rotate — the
    // logo keeps drifting for the whole clip instead of going static once
    // it's faded in.
    const overshoot = Math.sin(logoP * Math.PI) * 0.1 * (1 - logoP);
    const logoScale = 0.5 + 0.5 * logoP + overshoot;
    const logoTranslateY = (1 - logoP) * 70;
    const logoEntranceRotate = (1 - logoP) * -10;
    const floatY = Math.sin(time * 1.8) * 8 * logoP;
    const floatRot = Math.sin(time * 1.2 + 1) * 2 * logoP;

    return h(
      "div",
      {
        style: {
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: DARK_BG,
          backgroundImage: `linear-gradient(180deg, ${DARK_BG} 0%, ${DARK_BG_2} 100%)`,
          fontFamily: "sans-serif",
        },
      },
      h(
        "div",
        {
          style: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "0 70px",
            textAlign: "center",
          },
        },
        h("div", { style: { display: "flex", position: "absolute", top: 90, opacity: brandP } }, brandMark()),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 620,
              height: 300,
            },
          },
          logoGlow(),
          h("img", {
            src: logoDataUri,
            width: LOGO_WIDTH,
            height: LOGO_HEIGHT,
            style: {
              position: "relative",
              opacity: logoP,
              transform: `translateY(${logoTranslateY + floatY}px) scale(${logoScale}) rotate(${logoEntranceRotate + floatRot}deg)`,
            },
          })
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 130,
              lineHeight: 1.1,
              fontWeight: 800,
              color: ACCENT,
              textShadow: TEXT_SHADOW,
              marginTop: 40,
              opacity: heroP,
              transform: `translateY(${(1 - heroP) * 20}px)`,
            },
          },
          HERO_TEXT
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 20,
              fontSize: 62,
              fontWeight: 700,
              color: "white",
              textShadow: TEXT_SHADOW,
              marginTop: 24,
              opacity: nameP,
              transform: `translateY(${(1 - nameP) * 24}px)`,
            },
          },
          `to try ${offer.name}`
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 44,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              marginTop: 28,
              maxWidth: 920,
              opacity: descP,
              transform: `translateY(${(1 - descP) * 20}px)`,
            },
          },
          offer.description
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 40,
              color: ACCENT_DIM,
              fontWeight: 700,
              marginTop: 24,
              maxWidth: 880,
              opacity: reqP,
              transform: `translateY(${(1 - reqP) * 20}px)`,
            },
          },
          offer.requirements
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 34,
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginTop: 20,
              opacity: trustP,
            },
          },
          "Same signup you'd get directly — we just earn a referral credit."
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
              marginTop: 64,
              opacity: ctaP,
              transform: `translateY(${(1 - ctaP) * 30}px)`,
            },
          },
          h(
            "div",
            {
              style: {
                display: "flex",
                padding: 16,
                borderRadius: 24,
                backgroundColor: DARK_BG_2,
                border: `2px solid ${ACCENT}`,
              },
            },
            h("img", { src: qrCodeDataUrl, width: 220, height: 220 })
          ),
          h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                fontSize: 44,
                fontWeight: 600,
                color: "white",
                maxWidth: 440,
                textAlign: "left",
              },
            },
            h("span", { style: { fontWeight: 700 } }, "Scan to get started"),
            h("span", { style: { marginTop: 10, color: "rgba(255,255,255,0.7)" } }, "or tap the link in bio")
          )
        )
      )
    );
  }

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const time = i / RENDER_FPS;
    const response = new ImageResponse(renderFrame(time) as React.ReactElement, { width: WIDTH, height: HEIGHT });
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

  console.log(`\nDone. Encoded ${TOTAL_FRAMES} frames into ${OUT_FILE}`);
}

run();
