# ReferralHub

A hub for referral and cashback offers (banking, credit cards, investing, cashback apps),
built with Next.js. English-only for now; the structure is ready for `es`/`ru` later.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding your real referral links

Edit `src/data/offers.ts`. Every offer with `referralUrl: "REPLACE_ME"` shows an
"Add your referral link" badge on the site instead of a working button — once you sign up
for a program and get your real link, paste it in and the offer goes live automatically.

Links are served through `/go/[slug]`, which redirects to the real URL and (optionally)
counts the click.

## Enabling click tracking (optional)

By default, clicks aren't counted anywhere (the redirect still works fine). To track clicks:

1. Create a free Redis database at https://console.upstash.com
2. Copy `.env.example` to `.env.local` and fill in `UPSTASH_REDIS_REST_URL`,
   `UPSTASH_REDIS_REST_TOKEN`, and a value for `ADMIN_KEY`
3. Visit `/admin/stats?key=<your ADMIN_KEY>` to see click counts per offer

## Keeping bonuses accurate (optional)

Bonus amounts and requirements in `src/data/offers.ts` go stale as providers change their
programs. Set `PERPLEXITY_API_KEY` in `.env.local` to check them against live sources:

- **On the site** — each offer card gets an "Is this bonus still current?" link that runs a
  web search and shows the verdict plus the pages it read. Results are cached for 12 hours
  per offer (in Upstash when configured, in memory otherwise), so a busy page costs at most
  one search per offer per half-day.
- **In bulk** — `npm run verify:offers` audits every offer and writes a markdown report to
  `scripts/output/offer-audit-<date>.md`, listing which bonuses changed or ended and linking
  the sources. Use it before a round of edits to `src/data/offers.ts`.

Without the key the site behaves exactly as before; the check link just reports that it's
switched off. Set `PERPLEXITY_MODEL` to override the default `sonar` model.

## Deploying

Push to GitHub and import the repo at https://vercel.com/new — no configuration needed.
If you enabled click tracking, add the same environment variables in the Vercel project
settings.

## Driving a browser from Claude Code (optional)

`.mcp.json` registers [Playwright MCP](https://github.com/microsoft/playwright-mcp), which
lets Claude Code open a real browser against your dev server — clicking through `/offers`,
running a bonus check, reading console errors — instead of guessing from the source.

One-time setup is `npx playwright install chromium`. Start `npm run dev`, then ask Claude to
open http://localhost:3000; it will ask you to approve the server the first time it's used.

The server runs headless with a throwaway profile. Drop `--headless` from `.mcp.json` to
watch it work. In Claude Code on the web the container ships its own Chromium at a different
build than Playwright MCP expects, so add `--executable-path /opt/pw-browsers/chromium`
there.

## Adding a language later (es/ru)

Offer data, categories, and copy currently live in English only. When you're ready to
expand, the cleanest path is `next-intl` with a `[locale]` segment under `src/app/`, moving
today's routes under it and translating `src/data/offers.ts` per locale.
