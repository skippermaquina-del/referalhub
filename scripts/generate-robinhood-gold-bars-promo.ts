// Robinhood "2,000 gold bars" sweepstakes promo (HOOD Month, ends Oct 23,
// 2026) — a time-limited hook that funnels viewers to the regular Robinhood
// referral offer (/go/robinhood). Same gold-on-black look as
// generate-robinhood-gold-card-spotlight.ts, with a stack of gold bars
// dropping in instead of the card.
//
// It's a sweepstakes, so the frame always carries the sponsor's required
// framing: no deposit or Gold membership necessary, mail-in entry, US 18+,
// end date, official rules. Don't strip that line to make room for copy.
//
// Usage: node scripts/generate-robinhood-gold-bars-promo.ts [--story]
//
// --story exports one static PNG for Instagram Stories instead of the Reel:
// no QR code, "Tap the link below", and empty space at the bottom for the
// Link sticker (only addable by hand in-app).

import { ImageResponse } from "@vercel/og";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import React from "react";
import QRCode from "qrcode";

const h = React.createElement;

const ACCENT = "#E8C878";
const ACCENT_DIM = "#C9A95E";
const BAR_LIGHT = "#F2D98C";
const BAR_MID = "#D4AF55";
const BAR_DARK = "#9C7A2E";
const DARK_BG = "#15130E";
const DARK_BG_2 = "#0A0907";
const TEXT_SHADOW = "0 2px 10px rgba(0,0,0,0.55)";

const WIDTH = 1080;
const HEIGHT = 1920;
const SITE_URL = "https://referalhub.vercel.app";
const OFFER_SLUG = "robinhood";

const RENDER_FPS = 12;
const OUTPUT_FPS = 30;
const DURATION_S = 7;
const TOTAL_FRAMES = Math.round(RENDER_FPS * DURATION_S);

// Timeline (seconds)
const BRAND_START = -0.3;
const BRAND_DUR = 0.4;
const LOGO_START = 0.1;
const LOGO_DUR = 0.5;
const BARS_START = 0.4; // first bar; each next one lands BAR_STAGGER later
const BAR_STAGGER = 0.15;
const BAR_DUR = 0.45;
const HERO_START = 1.5;
const HERO_DUR = 0.6;
const SUB_START = 2.0;
const SUB_DUR = 0.5;
const LIST_START = 2.5;
const LIST_STAGGER = 0.3;
const LIST_DUR = 0.5;
const CTA_START = 3.6;
const CTA_DUR = 0.5;
const LEGAL_START = 3.9;
const LEGAL_DUR = 0.5;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Slight bounce on landing, for the bars dropping onto the stack.
function easeOutBack(t: number): number {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function progress(start: number, dur: number, time: number, ease = easeOutCubic): number {
  const raw = (time - start) / dur;
  return ease(Math.min(1, Math.max(0, raw)));
}

function brandMark() {
  return h(
    "div",
    { style: { display: "flex", fontSize: 44, fontWeight: 700, color: "white", textShadow: TEXT_SHADOW } },
    h("span", null, "Referral"),
    h("span", { style: { color: ACCENT } }, "Hub")
  );
}

// One gold bar seen from the front: darker base with a lighter inset top
// face, so a row of them reads as ingots rather than flat rectangles.
function goldBar(key: number, style: Record<string, string | number>) {
  return h(
    "div",
    {
      key,
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: 230,
        height: 92,
        borderRadius: 12,
        backgroundImage: `linear-gradient(180deg, ${BAR_MID} 0%, ${BAR_DARK} 100%)`,
        border: "2px solid rgba(255,235,180,0.5)",
        boxShadow: "0 16px 30px rgba(0,0,0,0.55)",
        ...style,
      },
    },
    h("div", {
      style: {
        display: "flex",
        marginTop: 10,
        width: 180,
        height: 44,
        borderRadius: 8,
        backgroundImage: `linear-gradient(180deg, ${BAR_LIGHT} 0%, ${BAR_MID} 100%)`,
      },
    })
  );
}

async function run() {
  const isStory = process.argv.includes("--story");
  const FRAMES_DIR = "scripts/output/robinhood-gold-bars-frames";
  const OUT_FILE = isStory
    ? "public/social/story-robinhood-gold-bars.png"
    : "public/social/promo-robinhood-gold-bars.mp4";

  await mkdir("public/social", { recursive: true });

  const LOGO_WIDTH = 340;
  const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 290) / 800);

  const [logoBuffer, qrCodeDataUrl] = await Promise.all([
    readFile("public/robinhood-logo.png"),
    QRCode.toDataURL(`${SITE_URL}/go/${OFFER_SLUG}`, {
      width: 400,
      margin: 1,
      color: { dark: "#ffffff", light: "#00000000" },
    }),
  ]);
  const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  // Pyramid rows, bottom first: 3, then 2, then 1 on top.
  const ROWS = [3, 2, 1];

  const DETAILS = [
    "1 winner gets a 1 kg bar (~$145K)",
    "1,999 winners get a 1 g bar",
    "Gold members: every eligible $ deposited = 1 entry",
  ];

  function renderFrame(time: number) {
    const brandP = progress(BRAND_START, BRAND_DUR, time);
    const logoP = progress(LOGO_START, LOGO_DUR, time);
    const heroP = progress(HERO_START, HERO_DUR, time);
    const subP = progress(SUB_START, SUB_DUR, time);
    const ctaP = progress(CTA_START, CTA_DUR, time);
    const legalP = progress(LEGAL_START, LEGAL_DUR, time);

    let barIndex = 0;
    const stack = h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "center",
          gap: 10,
          marginTop: 30,
          height: 3 * 92 + 2 * 10,
        },
      },
      ...ROWS.map((count, rowI) =>
        h(
          "div",
          { key: rowI, style: { display: "flex", gap: 14 } },
          ...Array.from({ length: count }, (_, i) => {
            const p = progress(BARS_START + barIndex++ * BAR_STAGGER, BAR_DUR, time, easeOutBack);
            return goldBar(i, {
              opacity: Math.min(1, p * 2),
              transform: `translateY(${(1 - p) * -260}px)`,
            });
          })
        )
      )
    );

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
            padding: isStory ? "150px 70px 240px" : "120px 70px 0",
            textAlign: "center",
          },
        },
        h("div", { style: { display: "flex", position: "absolute", top: 90, opacity: brandP } }, brandMark()),
        h("img", {
          src: logoDataUri,
          width: LOGO_WIDTH,
          height: LOGO_HEIGHT,
          style: { opacity: logoP },
        }),
        stack,
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 100,
              lineHeight: 1.05,
              fontWeight: 800,
              color: ACCENT,
              textShadow: TEXT_SHADOW,
              marginTop: 40,
              opacity: heroP,
              transform: `translateY(${(1 - heroP) * 20}px)`,
            },
          },
          "2,000 gold bars"
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 54,
              fontWeight: 700,
              color: "white",
              marginTop: 14,
              opacity: subP,
              transform: `translateY(${(1 - subP) * 20}px)`,
            },
          },
          "Robinhood is giving them away"
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginTop: 30,
              fontSize: 38,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
            },
          },
          ...DETAILS.map((line, i) => {
            const p = progress(LIST_START + i * LIST_STAGGER, LIST_DUR, time);
            return h(
              "div",
              { key: i, style: { display: "flex", opacity: p, transform: `translateY(${(1 - p) * 16}px)` } },
              line
            );
          })
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              marginTop: 26,
              padding: "10px 28px",
              borderRadius: 999,
              backgroundColor: "rgba(232,200,120,0.14)",
              fontSize: 36,
              fontWeight: 700,
              color: ACCENT,
              opacity: progress(LIST_START + DETAILS.length * LIST_STAGGER, LIST_DUR, time),
            },
          },
          "Ends Oct 23, 2026"
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
              marginTop: 44,
              opacity: ctaP,
              transform: `translateY(${(1 - ctaP) * 30}px)`,
            },
          },
          !isStory &&
            h(
              "div",
              {
                style: {
                  display: "flex",
                  padding: 14,
                  borderRadius: 24,
                  backgroundColor: DARK_BG_2,
                  border: `2px solid ${ACCENT}`,
                },
              },
              h("img", { src: qrCodeDataUrl, width: 170, height: 170 })
            ),
          h(
            "div",
            {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: isStory ? "center" : "flex-start",
                fontSize: 34,
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
              },
            },
            h("span", { style: { fontSize: 36, color: "white", fontWeight: 700 } }, "New to Robinhood?"),
            h(
              "div",
              {
                style: {
                  display: "flex",
                  marginTop: 14,
                  padding: "18px 40px",
                  borderRadius: 999,
                  border: `3px solid ${ACCENT}`,
                  backgroundColor: "rgba(232,200,120,0.08)",
                  fontSize: 40,
                  fontWeight: 700,
                  color: ACCENT,
                },
              },
              "Get a free stock"
            ),
            h("span", { style: { marginTop: 14 } }, isStory ? "Tap the link below" : "Link in bio · or scan the code")
          )
        ),
        h(
          "div",
          {
            style: {
              display: "flex",
              fontSize: 24,
              lineHeight: 1.35,
              color: ACCENT_DIM,
              opacity: legalP * 0.9,
              marginTop: 36,
              maxWidth: 900,
            },
          },
          "Sweepstakes: no deposit or Gold membership necessary to enter or win. Mail-in entry available. 50 US/DC residents, 18+. Ends Oct 23, 2026 8:59:59 PM PT. See Robinhood's Official Rules. Sponsor: Robinhood Gold, LLC. Not affiliated with Robinhood."
        )
      )
    );
  }

  if (isStory) {
    const response = new ImageResponse(renderFrame(DURATION_S) as React.ReactElement, {
      width: WIDTH,
      height: HEIGHT,
    });
    await writeFile(OUT_FILE, Buffer.from(await response.arrayBuffer()));
    console.log(`Done. Wrote story image to ${OUT_FILE}`);
    return;
  }

  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const time = i / RENDER_FPS;
    const response = new ImageResponse(renderFrame(time) as React.ReactElement, { width: WIDTH, height: HEIGHT });
    await writeFile(`${FRAMES_DIR}/frame-${String(i).padStart(3, "0")}.png`, Buffer.from(await response.arrayBuffer()));
    process.stdout.write(`\rRendered ${i + 1}/${TOTAL_FRAMES} frames`);
  }
  console.log();

  console.log("Encoding with ffmpeg...");
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
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

  console.log(`Done. Encoded ${TOTAL_FRAMES} frames into ${OUT_FILE}`);
}

run();
