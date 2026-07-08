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

## Deploying

Push to GitHub and import the repo at https://vercel.com/new — no configuration needed.
If you enabled click tracking, add the same environment variables in the Vercel project
settings.

## Adding a language later (es/ru)

Offer data, categories, and copy currently live in English only. When you're ready to
expand, the cleanest path is `next-intl` with a `[locale]` segment under `src/app/`, moving
today's routes under it and translating `src/data/offers.ts` per locale.
