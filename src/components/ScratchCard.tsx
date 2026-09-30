"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getOfferLogoUrl, type Offer } from "@/data/offers";

// Share of the gold foil that has to be scratched off before the rest
// dissolves on its own — nobody should have to scrub every last pixel.
const REVEAL_THRESHOLD = 0.45;
const BRUSH_RADIUS = 22;

function pickOffer(offers: Offer[], not?: Offer): Offer {
  const pool = offers.length > 1 && not ? offers.filter((o) => o.slug !== not.slug) : offers;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Paints the gold foil (same palette as the Robinhood Gold Reels) over the
// whole canvas, sized for the device pixel ratio so it stays crisp.
function paintFoil(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  const w = rect.width;
  const h = rect.height;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#E8CF86");
  grad.addColorStop(0.5, "#C9A95E");
  grad.addColorStop(1, "#A8883E");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Faint diagonal "$" pattern so it reads as a lottery-style foil.
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font = "bold 22px Arial, sans-serif";
  for (let y = 10; y < h + 30; y += 38) {
    for (let x = ((y / 38) % 2) * 24 - 10; x < w + 30; x += 48) {
      ctx.fillText("$", x, y);
    }
  }

  ctx.fillStyle = "#3d2f10";
  ctx.textAlign = "center";
  ctx.font = "800 26px Arial, sans-serif";
  ctx.fillText("Scratch to reveal", w / 2, h / 2 - 4);
  ctx.font = "600 15px Arial, sans-serif";
  ctx.fillStyle = "rgba(61,47,16,0.8)";
  ctx.fillText("your lucky offer", w / 2, h / 2 + 20);
}

export function ScratchCard({ offers }: { offers: Offer[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const moves = useRef(0);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    paintFoil(canvas);
    const onResize = () => paintFoil(canvas);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [revealed]);

  const scratchedShare = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return 0;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Sample every 16th pixel's alpha — plenty accurate, much cheaper.
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] === 0) clear++;
    }
    return total ? clear / total : 0;
  }, []);

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.clientX - rect.left, e.clientY - rect.top, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    if (++moves.current % 8 === 0 && scratchedShare() > REVEAL_THRESHOLD) {
      drawing.current = false;
      setRevealed(true);
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Pick the prize on first touch (not during render) so server and client
    // HTML match and every visitor gets their own draw.
    if (!offer) setOffer(pickOffer(offers));
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scratch(e);
  };

  const playAgain = () => {
    setOffer((prev) => pickOffer(offers, prev ?? undefined));
    moves.current = 0;
    setRevealed(false);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative h-56 overflow-hidden rounded-2xl border border-[#c9a84c]/40 bg-[#0f1923] shadow-xl shadow-[#c9a84c]/10">
        {offer && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-white">
            {/* Brandfetch only allows browser hotlinks, so no next/image here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getOfferLogoUrl(offer)}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl bg-white object-contain"
            />
            <p className="text-xs font-medium uppercase tracking-wide text-[#c9a84c]">You got</p>
            <p className="text-lg font-bold">{offer.name}</p>
            <p className="text-2xl font-extrabold text-[#E8C878]">{offer.bonus}</p>
          </div>
        )}
        {!revealed && (
          <canvas
            ref={canvasRef}
            aria-label="Scratch card: drag to scratch off the gold foil"
            className="absolute inset-0 h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={(e) => drawing.current && scratch(e)}
            onPointerUp={() => (drawing.current = false)}
            onPointerCancel={() => (drawing.current = false)}
          />
        )}
      </div>

      <div className="mt-4 flex min-h-11 items-center justify-center gap-3">
        {revealed && offer ? (
          <>
            <Link
              href={`/go/${offer.slug}`}
              className="rounded-lg bg-[#c9a84c] px-5 py-2.5 text-sm font-semibold text-[#0f1923] hover:bg-[#dab868]"
            >
              Claim this offer →
            </Link>
            <button
              type="button"
              onClick={playAgain}
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium hover:border-[#c9a84c] dark:border-neutral-700"
            >
              Scratch again
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (!offer) setOffer(pickOffer(offers));
              setRevealed(true);
            }}
            className="text-xs text-neutral-500 underline-offset-2 hover:underline"
          >
            Can&apos;t scratch? Reveal it
          </button>
        )}
      </div>
    </div>
  );
}
