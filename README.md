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

## Connecting NotebookLM

NotebookLM has no public API for pushing sources into a notebook, so the connection runs the
other way around: the site publishes its whole catalog as a single clean document that
NotebookLM can ingest.

1. Open `/notebooklm` on the site for the copy-paste instructions and URLs
2. In NotebookLM, create a notebook and pick **Add source -> Website**
3. Paste `https://<your-site>/notebooklm.txt` (add `?category=banking|cards|investing|apps`
   for one source per category instead of the full catalog)

The document is generated from `src/data/offers.ts`, so it always matches the live site — but
NotebookLM snapshots a website source when you add it, so refresh the source in NotebookLM
after you edit offers and redeploy.

If NotebookLM can't reach the URL (local dev, or a protected preview deployment), run:

```bash
npm run export:notebooklm
```

That writes the same documents to `public/notebooklm/` (full catalog plus one per category)
so you can upload them as files instead.

## Deploying

Push to GitHub and import the repo at https://vercel.com/new — no configuration needed.
If you enabled click tracking, add the same environment variables in the Vercel project
settings.

## Adding a language later (es/ru)

Offer data, categories, and copy currently live in English only. When you're ready to
expand, the cleanest path is `next-intl` with a `[locale]` segment under `src/app/`, moving
today's routes under it and translating `src/data/offers.ts` per locale.
