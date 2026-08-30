# Roomwalk reference

## The floor-plan model

Rooms are laid end to end along a path. The engine keeps a cursor (position plus
heading) and walks it forward: each room is placed centred on the cursor, the
cursor advances by the room's depth, and a `data-rw-turn` inserts a square
landing and rotates the heading 90° before the next room is placed.

The camera never jumps. It samples the path by distance walked and takes its
heading from a point ahead of and behind itself, which is what rounds the
corners: the head starts turning before the landing and finishes after it, the
way it does when you walk.

Coordinates are CSS's: x right, **y down**, z toward the viewer. Heading 0 looks
into the screen and positive heading turns right. Everything is computed in
metres and only multiplied by `unit` when a transform is written, so the plan
stays readable as a plan.

## Who draws the wall at a junction

This is the rule that keeps doorways from flickering. At every junction exactly
one of the two neighbours draws the wall, and that wall carries the doorway:

| Junction | Wall drawn by |
| --- | --- |
| room → room | the back wall of the earlier room |
| room → landing | the back wall of the earlier room |
| landing → room | the front wall of the later room |

So a landing never draws its own front, nor the side it exits through, and a room
only draws a front wall if it is first in the walk or comes straight off a
landing. If both drew, the two walls would sit in the same plane and z-fight.

The doorway itself is a single `clip-path` polygon that runs down the wall's
bottom edge, into the opening and back out — one element, one material, one hole.
Splitting the wall into a lintel and two jambs would work too, but then the fog
gradient has to be kept in step across three pieces.

## Using it with React or Next.js

The engine moves DOM nodes onto walls, so mount it over markup that is already
rendered and does not re-render afterwards:

```tsx
"use client";
import { useEffect, useRef } from "react";
import { createRoomWalk } from "@roomwalk/roomwalk.js";

export function RoomWalk({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const walk = createRoomWalk(node);
    return () => walk.destroy();
  }, []);
  return <div ref={ref} className="rw">{children}</div>;
}
```

`destroy()` restores the original DOM, which is what makes strict mode's
mount/unmount/mount cycle safe. If the sections' content is stateful, either wrap
it in `memo` or rebuild the walk after the state settles — React will not
reconcile children the engine has moved.

Render the sections from a server component and let this wrapper be the only
client boundary; the HTML then ships complete and the walk is pure enhancement.

## Plans that work

**A product story** — entrance (title over the door), turn into a wide room with
the problem on both walls, corridor, turn into the solution, a card room of
features, last room with the call to action on its solid back wall.

**A portfolio** — one wide, deep room per project, panels alternating left and
right so the reader's attention swings as they walk. Skip turns entirely; a
straight enfilade of rooms reads as one long gallery.

**A changelog or timeline** — a long corridor (`data-rw-width="2.6"`,
`data-rw-depth="14"`) with dated panels down both walls, then a landing and a
short room for what is next. The narrow width makes the panels pass close.

## Pacing

`scrollPerMetre` is the only knob that changes how fast the walk feels; `unit`
changes how big everything looks. Raising `unit` alone makes a bigger flat at the
same walking speed, which is usually not what is wanted.

Total scroll height is the path length times `scrollPerMetre`, plus one viewport.
A seven-room flat is around 45 m, so roughly 7 000 px of scrolling at the
default rate — about as long as a decent long-form article.

## Accessibility

- The walk rides on native scroll. Wheel, scrollbar, keyboard, trackpad and touch
  all work with no event interception.
- `prefers-reduced-motion: reduce` never enters the walk, and switches out of it
  if the preference changes mid-session.
- Focusing a link inside a room scrolls the walk to that room, so tabbing through
  the page walks it.
- Distant rooms are hidden for performance, which takes their links out of the
  tab order. The list view is the accessible path to the whole page — keep the
  toggle visible, and never put content in the walk that is not in the sections.
