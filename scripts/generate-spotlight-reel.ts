// Renders a single-offer "spotlight" Reel: the bonus counts up to grab
// attention, then the offer, requirement, and trust line reveal in turn,
// holding on a QR/CTA frame. Same still-frames-then-ffmpeg approach as
// generate-offers-reel.ts (Instagram has no real .gif upload path, so this
// becomes an mp4 loop). Reusable for any offer in src/data/offers.ts so we
// don't need one throwaway script per spotlight post.
//
// Usage: node scripts/generate-spotlight-reel.ts <offer-slug>
//   e.g. node scripts/generate-spotlight-reel.ts uber-driver

import { ImageResponse } from "@vercel/og";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import React from "react";
import QRCode from "qrcode";
import { offers } from "../src/data/offers.ts";

const h = React.createElement;

const EMERALD = "#10b981";
const AMBER = "#d97706";
const WIDTH = 1080;
const HEIGHT = 1920; // 9:16, Reels-native
const SITE_URL = "https://referalhub.vercel.app";

const RENDER_FPS = 12;
const OUTPUT_FPS = 30;
const DURATION_S = 6;
const TOTAL_FRAMES = Math.round(RENDER_FPS * DURATION_S);

// Timeline (seconds)
const BRAND_START = 0.0;
const BRAND_DUR = 0.4;
const NUMBER_START = 0.3;
const NUMBER_DUR = 1.7;
const NAME_START = 2.0;
const NAME_DUR = 0.5;
const DESC_START = 2.5;
const DESC_DUR = 0.5;
const REQ_START = 3.0;
const REQ_DUR = 0.6;
const TRUST_START = 3.6;
const TRUST_DUR = 0.5;
const CTA_START = 4.1;
const CTA_DUR = 0.5;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function progress(start: number, dur: number, time: number): number {
  const raw = (time - start) / dur;
  return easeOutCubic(Math.min(1, Math.max(0, raw)));
}

// Some bonus strings have more than one dollar figure (e.g. "$10 per friend
// (up to $100/year)") — animate up to the largest one since that's the
// stronger hook, not necessarily the first number in the string.
// Dollar-figure bonuses ("$1,750", "$100") stay short through the whole
// count-up, but non-numeric bonuses ("Lower trading fees", "Account credit")
// can run long enough to wrap to two lines and swallow the whole frame at a
// fixed size — scale the hero font down as the text gets longer so it still
// reads as a punchy headline instead of a wall of green text.
function heroFontSize(text: string): number {
  if (text.length <= 12) return 148;
  if (text.length <= 20) return 92;
  return 72;
}

function parseBonusAmount(bonus: string): number | null {
  const matches = [...bonus.matchAll(/\$([\d,]+)/g)];
  if (matches.length === 0) return null;
  const amounts = matches.map((m) => parseInt(m[1].replace(/,/g, ""), 10));
  return Math.max(...amounts);
}

function brandMark() {
  return h(
    "div",
    { style: { display: "flex", fontSize: 40, fontWeight: 700, color: "#171717" } },
    h("span", null, "Referral"),
    h("span", { style: { color: EMERALD } }, "Hub")
  );
}

function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: node scripts/generate-spotlight-reel.ts <offer-slug>");
    process.exit(1);
  }
  const offer = offers.find((o) => o.slug === slug);
  if (!offer) {
    console.error(`No offer with slug "${slug}" in src/data/offers.ts`);
    process.exit(1);
  }
  run(offer);
}

async function run(offer: (typeof offers)[number]) {
  const FRAMES_DIR = `scripts/output/spotlight-frames-${offer.slug}`;
  const OUT_FILE = `public/social/spotlight-${offer.slug}.mp4`;
  const bonusAmount = parseBonusAmount(offer.bonus);

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir("public/social", { recursive: true });

  const qrCodeDataUrl = await QRCode.toDataURL(SITE_URL, {
    width: 400,
    margin: 1,
    color: { dark: "#171717", light: "#ffffff" },
  });

  function renderFrame(time: number) {
    const brandP = progress(BRAND_START, BRAND_DUR, time);
    const numberP = progress(NUMBER_START, NUMBER_DUR, time);
    const nameP = progress(NAME_START, NAME_DUR, time);
    const descP = progress(DESC_START, DESC_DUR, time);
    const reqP = progress(REQ_START, REQ_DUR, time);
    const trustP = progress(TRUST_START, TRUST_DUR, time);
    const ctaP = progress(CTA_START, CTA_DUR, time);

    const bonusText =
      bonusAmount !== null
        ? `$${Math.round(bonusAmount * numberP).toLocaleString("en-US")}`
        : offer.bonus;
    const bonusOpacity = bonusAmount !== null ? Math.min(1, numberP * 4) : numberP;
    // The hero number is just the largest dollar figure for punch (e.g. "$100"
    // out of "$10 per friend (up to $100/year)") — when the full bonus string
    // carries more nuance than that bare number, show it as a smaller caption
    // once the count-up settles, so the terms stay accurate.
    const bonusIsPlainNumber =
      bonusAmount !== null && offer.bonus.replace(/[$,]/g, "").trim() === String(bonusAmount);
    const showBonusCaption = bonusAmount !== null && !bonusIsPlainNumber;
    const bonusFontSize = heroFontSize(bonusText);

    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          padding: "0 80px",
          fontFamily: "sans-serif",
          textAlign: "center",
        },
      },
      h("div", { style: { display: "flex", opacity: brandP } }, brandMark()),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: bonusFontSize,
            lineHeight: 1.1,
            fontWeight: 800,
            color: EMERALD,
            marginTop: 56,
            opacity: bonusOpacity,
            transform: `scale(${0.9 + 0.1 * numberP})`,
          },
        },
        bonusText
      ),
      showBonusCaption
        ? h(
            "div",
            {
              style: {
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                color: "#525252",
                marginTop: 12,
                opacity: nameP,
              },
            },
            offer.bonus
          )
        : null,
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 46,
            fontWeight: 700,
            color: "#171717",
            marginTop: 24,
            opacity: nameP,
            transform: `translateY(${(1 - nameP) * 24}px)`,
          },
        },
        h("span", { style: { display: "flex", fontSize: 46 } }, offer.emoji),
        h("span", null, `to try ${offer.name}`)
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 30,
            color: "#525252",
            marginTop: 28,
            maxWidth: 820,
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
            fontSize: 26,
            color: AMBER,
            fontWeight: 700,
            marginTop: 24,
            maxWidth: 780,
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
            fontSize: 24,
            color: "#a3a3a3",
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
        h("img", { src: qrCodeDataUrl, width: 200, height: 200 }),
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", fontSize: 30, color: "#525252", maxWidth: 380, textAlign: "left" } },
          h("span", { style: { fontWeight: 700, color: "#171717" } }, "Scan to get started"),
          h("span", { style: { marginTop: 10 } }, "or tap the link in bio")
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

main();
