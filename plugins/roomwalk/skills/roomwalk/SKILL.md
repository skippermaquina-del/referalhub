---
name: roomwalk
description: Build a web page that the reader walks through — scrolling moves a camera forward through a floor plan of rooms, corridors and turns, instead of sliding a document up. Use when someone asks for a page you "walk through", a spatial/architectural scroll, a room-by-room or apartment-style layout, a 3D scroll tour, or a first-person walkthrough of content.
---

# Roomwalk

Turn a stack of sections into a floor plan and walk the reader through it. Scroll
maps to distance walked: the camera moves forward, turns corners, and the content
hangs on the walls it passes.

The engine is dependency-free (CSS 3D + one ES module), works on any page, and
degrades to an ordinary stack of sections without JS or under
`prefers-reduced-motion`.

## Files

`${CLAUDE_PLUGIN_ROOT}/skills/roomwalk/assets/` holds everything to copy:

| File | What it is |
| --- | --- |
| `roomwalk.js` | The engine. One ES module, no dependencies, no build step. |
| `roomwalk.css` | Geometry, depth fog, the flat fallback. Themed by CSS variables. |
| `roomwalk.d.ts` | Types, if the host project is TypeScript. |
| `starter.html` | A complete standalone page — open it in a browser to see the mechanic. |

Copy `roomwalk.js` and `roomwalk.css` into the project (a `public/`, `assets/` or
`lib/` folder — wherever that project keeps static files) and import them. Do not
rewrite the engine; author the floor plan around it.

## The shape of a page

```html
<link rel="stylesheet" href="roomwalk.css" />

<div id="flat" class="rw">
  <section data-rw-room="Entrance" data-rw-width="3.6" data-rw-depth="4.6">
    <div data-rw-panel="back" data-rw-y="0.1">
      <h1>Walk the hub</h1>
    </div>
  </section>

  <section data-rw-room="Living room" data-rw-turn="right"
           data-rw-width="5.6" data-rw-depth="7">
    <article data-rw-panel="left"  data-rw-at="0.3">…</article>
    <article data-rw-panel="right" data-rw-at="0.7">…</article>
  </section>
</div>

<script type="module">
  import { createRoomWalk } from "./roomwalk.js";
  createRoomWalk(document.getElementById("flat"));
</script>
```

Every **direct child** of a `[data-rw-room]` section becomes one panel, and gets
moved onto a wall. Anything else stays where it is.

### Room attributes

| Attribute | Meaning |
| --- | --- |
| `data-rw-room="Kitchen"` | Marks the section as a room; the value is its name, shown in the corner of the screen. |
| `data-rw-width` | Metres across. Default 4.2. |
| `data-rw-depth` | Metres deep — how long you walk through it. Default 5.2. |
| `data-rw-height` | Wall height in metres. Default 2.8. |
| `data-rw-turn="left\|right"` | Turn 90° to enter this room. A square landing is inserted automatically. |
| `data-rw-wall` | Default wall for panels in this room that don't name one. |

### Panel attributes

| Attribute | Meaning |
| --- | --- |
| `data-rw-panel` | `left`, `right`, `back`, `front`, `floor`, `ceiling`, or `turn`. |
| `data-rw-at` | 0–1 across the wall. 0 is the entry end, 1 the far end. Default 0.5. |
| `data-rw-y` | 0–1 down the wall. 0 is the ceiling, 1 the floor. Default 0.44. |
| `data-rw-span` | 0–1 of the wall's width, if you want the panel sized in wall units. |

`turn` is the landing wall you face head-on just before doubling back — see below.

## What you have to know to author one well

These are the rules the geometry actually imposes. Ignoring them is what makes a
roomwalk page look broken.

**A doorway wall takes no default panels.** The wall between two rooms is cut by
the doorway, and the cut clips anything inside it. Panels only land there if you
name that wall explicitly (`data-rw-panel="back"`), which is worth doing for a
sign over the lintel — put it high, `data-rw-y="0.1"`, so it clears the opening.
Otherwise let panels default to the side walls; they are what you walk past.

**A turn ends with a wall in your face.** Standing in the middle of a 3.6 m
landing you are 1.8 m from the wall, and at that distance the floor already falls
outside the field of view — the wall fills the screen. This is correct
perspective, not a bug, and it is the one dead moment in a walk. Fill it: hang the
section's headline on `data-rw-panel="turn"`, which targets the landing wall you
approach head-on. It reads as the best framed shot in the page.

**The narrower of the two rooms sets the landing size.** The landing has to be
covered by the previous room's back wall on one side and the next room's front
wall on the other, so it can be no wider than either. A turn out of a 2 m corridor
gives a 2 m landing and feels cramped. Give the room *before* a turn at least
3.5 m of width.

**Depth is pacing.** `data-rw-depth` is how much scrolling a room costs. A room
with one thing to say wants 4–5 m; a long gallery of panels wants 8–10 m. The
default rate is 150 px of scroll per metre — roughly a mouse notch per two thirds
of a metre.

**CSS 3D has no depth buffer between rooms.** Browsers sort whole elements, not
pixels, so at each doorway the next room's leading edges draw as a hairline
around the opening. Keep neighbouring rooms in similar materials and it reads as
a door frame. Do not try to fix it with `z-index` — that flattens the 3D context
and collapses the scene.

**The fallback is not a formality.** Without JS, and whenever the reader prefers
reduced motion, the page is the plain stack of sections it started as, and the
button in the corner switches between the two at will. Write the sections so they
read in order on their own, and style the flat mode (`.rw:not([data-rw-active])`)
so the panels stop being wall-sized. Content that only makes sense hanging on a
wall is content you have lost.

## Options

```js
createRoomWalk(root, {
  unit: 300,           // px per metre — the scale of everything
  eyeHeight: 1.62,     // camera height above the floor
  scrollPerMetre: 150, // pacing: scroll px per metre walked
  smoothing: 0.13,     // 0–1, how hard the camera chases the scroll; low = gliding
  lookahead: 2.2,      // metres looked ahead — how early turns begin
  bob: true,           // head sway while walking
  cullCells: 3,        // rooms drawn either side of you; 0 draws all
  autoEnter: true,     // false to start in the flat view
  labels: { exit: "View as a list", enter: "Walk through" },
});
```

Returns `{ enter, exit, isActive, destroy }`. `destroy()` puts the original DOM
back exactly as it was, so it is safe under React strict mode or any framework
that mounts twice.

## Theming

Everything visual is a CSS variable on the root. Redefine them to change flats:

```css
.rw {
  --rw-ambient: #0f1218;   /* beyond the walls */
  --rw-wall: #3b4354;      /* the wall you face */
  --rw-wall-side: #2e3543; /* the walls you pass */
  --rw-floor: #21262f;
  --rw-ceiling: #171b22;
  --rw-fog: #0b0d11;       /* colour distance fades to */
  --rw-fog-strength: 0.55; /* 0 kills the fog, 1 is heavy */
  --rw-accent: #c9a45c;
}
```

## Always check it in a browser

A floor plan that reads fine in source can put the reader inside a wall. Load the
page and screenshot it at several scroll depths — entering, mid-room, mid-turn,
and the last room — before calling it done. Look for: the first room framing its
title, panels inside the walls rather than clipped by them, the turn landing on
something worth looking at, and the last room's back wall closing the walk.

## Reference

`reference/authoring.md` — the floor-plan model, the junction-wall rules, the
React/Next wrapper, and worked plans for common page shapes.
