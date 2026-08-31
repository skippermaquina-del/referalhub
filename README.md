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

## MCP servers for Claude Code (optional)

`.mcp.json` registers five servers. Claude Code asks you to approve each one the first time
it's used in a session; none of them are needed to run or deploy the site.

| Server | What it's for | Credentials |
| --- | --- | --- |
| `brandfetch` | Brand logos and colors for the social-post pipeline | OAuth, via `/mcp` |
| `playwright` | Drive a browser against the dev server | none |
| `chrome-devtools` | Same, plus Lighthouse audits, performance traces, network inspection | none |
| `firecrawl` | Scrape and search the live web | `FIRECRAWL_API_KEY` |
| `higgsfield` | AI image/video generation | `HF_API_KEY`, `HF_SECRET` |

Keys are read with `${VAR}` from the **environment Claude Code itself runs in**, not from
`.env.local` — export them in your shell (or your shell profile) before starting Claude.
Nothing secret goes in `.mcp.json`.

Firecrawl is also available as a claude.ai connector, which uses OAuth instead of an API
key; if you connect it there you can drop the `firecrawl` entry from `.mcp.json`.

### Browser servers

Both browser servers drive a real browser and pair well with `npm run dev` — ask Claude to
open http://localhost:3000 and click through `/offers` rather than guessing from source.

- `playwright` uses Playwright's own Chromium: run `npx playwright install chromium` once.
- `chrome-devtools` uses your installed Google Chrome, so it needs no setup locally. It
  reports anonymous usage statistics to Google by default; add `--usageStatistics=false` to
  its args to opt out.

Both run headless with a throwaway profile — drop `--headless` to watch them work. In Claude
Code on the web neither browser is present in the container, so add
`--executable-path /opt/pw-browsers/chromium` for `playwright`, and
`--executablePath /opt/pw-browsers/chromium --chromeArg=--no-sandbox` for `chrome-devtools`.

### A note on the Higgsfield server

`higgsfield-mcp` is **not published by Higgsfield** — it's a third-party wrapper from the
Storyvord org, while Higgsfield's own npm packages are published under `@higgsfield/`. The
published source is small (two files, no dependencies beyond the MCP SDK) and only talks to
`platform.higgsfield.ai`, but it does receive your Higgsfield credentials, so it's pinned to
an exact version (`0.2.0`) rather than tracking `@latest`. Review the diff yourself before
bumping it, or drop the entry if you'd rather use `@higgsfield/cli` directly.

## Adding a language later (es/ru)

Offer data, categories, and copy currently live in English only. When you're ready to
expand, the cleanest path is `next-intl` with a `[locale]` segment under `src/app/`, moving
today's routes under it and translating `src/data/offers.ts` per locale.
