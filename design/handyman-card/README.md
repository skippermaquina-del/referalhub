# SUPERHMAN — business card

US standard 3.5 × 2 in (88.9 × 50.8 mm), two sides, print-ready.

```
design/handyman-card/
  card.html          the design itself — edit this
  assets/qr.svg      generated from the data-qr attribute on <html>
  assets/archivo.woff2
public/handyman/
  superhman-card.pdf 2 pages with bleed — the file you upload to the printer
  card-front.png     300 DPI previews
  card-back.png
```

## The idea in one line

Front = the hook, nothing else. Back = the job. Black front and off‑white back
means the card changes when you flip it, which is the cheapest memorability
trick there is on a two‑colour print run.

- **Front:** the H‑with‑a‑bolt mark, `SUPERHMAN`, `EVERY HOME NEEDS A HERO`.
  No phone, no email, no list of services. Its only job is to not get thrown
  away.
- **Back:** the phone number is the biggest thing on the card, because a
  handyman card converts by getting called. The QR is the second option, not
  the first — and it is labelled, because unlabelled QR codes get ignored.

## Editing

Open `card.html` and look for the `==== EDIT ME ====` markers:

| What | Where |
|---|---|
| Phone number | `.phone` |
| Your name / role | `.person` |
| Service area | `.role` in the back header |
| Services list | `.services` |
| Trust line | `.trust` — **only claim what is true** (licence, insurance) |
| QR destination | `data-qr` on the `<html>` tag |
| Colours | `:root` custom properties |

Then re-render:

```bash
npm run design:card
```

`card.html` also opens directly in a browser. Two optional toggles on the
`<html>` tag:

- `class="guides"` — draws the trim (orange) and safe‑area (blue) lines so you
  can check nothing important is too close to the edge.
- `class="rulers"` — turns on the inch ruler along the bottom edge of the back.
  A card that measures things is a card people keep in a drawer instead of
  binning it. Off by default because the brief was minimal; it is one word to
  enable.

## QR target

The card carries **one** QR and it points at Instagram:

```
https://instagram.com/handysuperm
```

That is a deliberate call. The phone number is already the biggest thing on the
card, so a WhatsApp QR would encode information the reader can see two inches to
the left — it duplicates. Instagram does not duplicate: it is the proof that the
work is real, which is exactly the doubt a stranger has while holding the card.
So the card offers two different things — a number to call, and a code to see the
work — instead of the same thing twice.

The Instagram nametag graphic is deliberately *not* used. Its pink-orange
gradient belongs to Instagram's brand, not this one, and dropping it on the card
would break the two-colour palette. The code here is generated fresh in the
card's own ink, which scans identically.

The handle is printed as text under the code (`@handysuperm`) so it also works
for anyone who would rather type it than scan.

To switch the QR to WhatsApp instead, change `data-qr` on the `<html>` tag to a
click-to-chat link with a pre-filled message and update the caption:

```
https://wa.me/1XXXXXXXXXX?text=Hi%20SUPERHMAN%2C%20I%20need%20a%20hand%20with...
```

Country code, no `+`, no spaces. Keep the URL short either way — a shorter URL
means fewer, chunkier modules and a code that scans from further away. Avoid a
link shortener you don't control: if it dies, every card already printed dies
with it.

Scan the rendered code with a real phone before ordering. Always.

## Print specs

| | |
|---|---|
| Trim | 88.9 × 50.8 mm (3.5 × 2 in) |
| Bleed | 3 mm all round → 94.9 × 56.8 mm |
| Safe area | 4.2 mm inside trim |
| Sides | 2 (front dark, back light) |
| Resolution | PDF is vector; PNGs are 300 DPI |

The PDF is RGB. Most online printers (Vistaprint, MOO, GotPrint, Printful)
convert it themselves and that is fine. If your printer asks for CMYK, give
them these instead of letting them guess:

| Colour | HEX | CMYK | Pantone (closest) |
|---|---|---|---|
| Ink | `#0E1116` | 78 / 68 / 62 / 78 | Black 6 C |
| Hero orange | `#FF5C1A` | 0 / 76 / 92 / 0 | 165 C |
| Paper | `#F6F3EE` | 3 / 3 / 5 / 0 | — |

Bright orange is outside CMYK gamut and will print a little duller than it
looks on screen. If the orange matters, ask for it as a Pantone spot colour —
on a one‑colour‑plus‑black job that is often not much more expensive.

### Stock, in order of what actually helps

1. **32 pt matte or soft‑touch, black core.** The dark front hides fingerprints
   badly on gloss; matte is the right call, and a thick card reads as
   "this person does not cut corners" before a word is read.
2. **Magnet backs (30 mil) for a second, smaller batch.** Handyman cards live
   on refrigerator doors. A magnet version survives the junk drawer, and the
   back — phone side out — is the one people see for the next two years.
3. Standard 16 pt matte for volume drops. Cheap, still fine.

## Notes on the name

`SUPERHMAN` is a wordplay that a reader has to decode. The mark carries it: the
H is a bolt, so the letter reads as "handyman" before the word does, and the
orange H in the logotype points at the same joke. If it ever tests badly with
customers, the two safe fallbacks that keep the brand and the URL are
`SUPER H` (with `handyman services` beneath) and `SUPERHAND`.

Deliberately **not** used anywhere: a diamond/shield badge, a cape, and the
red‑blue‑yellow palette. "Every home needs a hero" is the whole superhero
reference the card needs, and it is the part nobody can send a letter about.
