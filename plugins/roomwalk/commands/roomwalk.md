---
description: Build a page the reader walks through — scrolling moves a camera from room to room.
argument-hint: [what the page is about, or a path to an existing page]
---

Build a roomwalk page: one the reader walks through, where scrolling moves a
camera forward through a floor plan instead of sliding a document up.

Request: $ARGUMENTS

Use the `roomwalk` skill for the engine, the attributes and the floor-plan rules.
Read it before writing markup — the geometry imposes constraints that are not
guessable, in particular which walls can hold content and what happens at a turn.

Work in this order:

1. **Find the content.** If the request names an existing page or route, read it
   and reuse its real content. If it names a subject, ask what the sections are
   only if you cannot reasonably infer them — otherwise draft them and say what
   you assumed.

2. **Draw the plan before the markup.** Decide the sequence of rooms, which ones
   turn, and how deep each is. Depth is pacing; a turn needs at least 3.5 m of
   width in the room before it. Say the plan in one or two lines so it can be
   corrected cheaply.

3. **Wire the engine.** Copy `roomwalk.js` and `roomwalk.css` from the skill's
   `assets/` into wherever the project keeps static files, and match the host
   project's conventions for importing them. Do not modify the engine.

4. **Write the sections.** Real content, in reading order, each direct child a
   panel on a named wall. The page must still read as a plain stack of sections
   with JS off — that is also the accessible view, and the reduced-motion view.

5. **Look at it.** Serve the page and screenshot it entering, mid-room,
   mid-turn and in the last room. Check that titles are framed, panels sit
   inside their walls, the turn faces something worth seeing, and the walk ends
   on the last room's back wall. Fix what the screenshots show, then report what
   you saw.
