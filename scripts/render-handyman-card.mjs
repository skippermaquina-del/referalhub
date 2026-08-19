// Renders the SUPERHMAN business card (design/handyman-card/card.html) into
// print-ready and preview files:
//
//   design/handyman-card/assets/qr.svg   QR code, generated from the data-qr
//                                        attribute on <html> in card.html
//   public/handyman/superhman-card.pdf   2 pages (front, back), 3 mm bleed —
//                                        this is the file the printer needs
//   public/handyman/card-front.png       300 DPI previews, exact card size
//   public/handyman/card-back.png
//
// Usage: node scripts/render-handyman-card.mjs
//
// Drives the Chromium that already ships with this repo's tooling over the
// DevTools protocol (the plain --screenshot flag can't crop to an exact box,
// and Chrome clamps small window sizes). Override the binary with CHROME_PATH.

import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import QRCode from "qrcode";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const designDir = join(root, "design/handyman-card");
const cardHtml = join(designDir, "card.html");
const outDir = join(root, "public/handyman");

const CARD_W_MM = 94.9; // 3.5 in trim + 3 mm bleed each side
const CARD_H_MM = 56.8; // 2 in   trim + 3 mm bleed each side
const CSS_PX_PER_MM = 96 / 25.4;
const DPI = 300;

function chromePath() {
  const candidates = [
    process.env.CHROME_PATH,
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("No Chrome/Chromium found — set CHROME_PATH and re-run.");
  return found;
}

function launchChrome() {
  const child = spawn(chromePath(), [
    "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
    "--remote-debugging-port=0", "--remote-allow-origins=*", "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  return new Promise((resolve, reject) => {
    let stderr = "";
    const timer = setTimeout(() => reject(new Error("Chrome did not start in 20s")), 20_000);
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      const url = stderr.match(/ws:\/\/\S+/)?.[0];
      if (url) { clearTimeout(timer); resolve({ child, url }); }
    });
    child.on("exit", (code) => reject(new Error(`Chrome exited early (${code})`)));
  });
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let nextId = 0;
  const pending = new Map();
  const waiters = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id !== undefined) pending.get(msg.id)?.(msg), pending.delete(msg.id);
    else for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i].method === msg.method) waiters.splice(i, 1)[0].resolve(msg);
    }
  };
  const client = {
    session: undefined,
    send: (method, params = {}) => new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
      ws.send(JSON.stringify({ id, method, params, sessionId: client.session }));
    }),
    once: (method) => new Promise((resolve) => waiters.push({ method, resolve })),
    close: () => ws.close(),
  };

  // The endpoint Chrome prints is the browser target; attach to a real page
  // so the Page/Runtime domains become available.
  const { targetId } = await client.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await client.send("Target.attachToTarget", { targetId, flatten: true });
  client.session = sessionId;
  return client;
}

async function open(cdp, file) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: pathToFileURL(file).href });
  await loaded;
  // Web fonts are font-display:block, so wait for them before capturing.
  await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
}

async function writeQr(html) {
  const target = html.match(/<html[^>]*\sdata-qr="([^"]+)"/)?.[1];
  if (!target) throw new Error('card.html is missing the data-qr="..." attribute');
  const url = target.replace(/&amp;/g, "&");
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M", // M keeps the modules chunky enough at 18 mm
    margin: 2, // quiet zone; the caption sits just below the code
    color: { dark: "#0E1116", light: "#0000" },
  });
  writeFileSync(join(designDir, "assets/qr.svg"), svg);
  return url;
}

// Chrome renders the whole page, so capture one side at a time from a
// throwaway copy that hides the other card and strips the screen padding.
function isolate(html, side) {
  const tmp = join(designDir, `.tmp-${side}.html`);
  writeFileSync(tmp, html.replace("</head>", `<style>
    body{background:none!important;padding:0!important;gap:0!important;display:block!important}
    .card{display:none}
    .card.${side}{display:block}
    .guide{display:none!important}
  </style></head>`));
  return tmp;
}

const html = readFileSync(cardHtml, "utf8");
const qrTarget = await writeQr(html);
mkdirSync(outDir, { recursive: true });

const { child, url } = await launchChrome();
const cdp = await connect(url);
try {
  await cdp.send("Page.enable");

  await open(cdp, cardHtml);
  const { data: pdf } = await cdp.send("Page.printToPDF", {
    paperWidth: CARD_W_MM / 25.4,
    paperHeight: CARD_H_MM / 25.4,
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
    printBackground: true,
    preferCSSPageSize: true,
  });
  writeFileSync(join(outDir, "superhman-card.pdf"), Buffer.from(pdf, "base64"));

  for (const side of ["front", "back"]) {
    const tmp = isolate(html, side);
    await open(cdp, tmp);
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: 0, y: 0,
        width: CARD_W_MM * CSS_PX_PER_MM,
        height: CARD_H_MM * CSS_PX_PER_MM,
        scale: DPI / 96,
      },
    });
    writeFileSync(join(outDir, `card-${side}.png`), Buffer.from(data, "base64"));
    rmSync(tmp);
  }
} finally {
  cdp.close();
  child.kill();
}

console.log(`QR  -> ${qrTarget}`);
console.log(`PDF -> public/handyman/superhman-card.pdf  (2 pages, ${CARD_W_MM} x ${CARD_H_MM} mm with bleed)`);
console.log(`PNG -> public/handyman/card-front.png, card-back.png  (${DPI} DPI)`);
