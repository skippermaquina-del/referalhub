/**
 * Historias en video (rayos X → falla → reparación) por aparato.
 * Cada clip se genera aparte (Grok) y se une con fundidos en un mp4/webm sin audio.
 * Para añadir un aparato: montar el video, poner el archivo en public/allegiant/
 * y añadir aquí sus fases (tiempos en segundos del video final).
 */

const CY = "#38d6ff";
const GREEN = "#3dffb0";
const RED = "#ff4d4d";
const AMBER = "#ffb020";

export type Phase = {
  id: string;
  a: number;
  b: number;
  title: string;
  note?: string;
  status?: { label: string; color: string };
  /** Paso numerado de la gira (solo piezas). */
  step?: number;
};

export type Story = {
  id: string;
  label: string;
  mp4: string;
  webm: string;
  poster: string;
  endImage: string;
  duration: number;
  /** Ancho / alto del video (para el panel en escritorio). */
  aspect: number;
  /** A partir de este segundo aparece la tarjeta final. */
  endAt: number;
  totalSteps: number;
  phases: Phase[];
  endTitle?: string;
  endBody?: string;
};

const normal = { label: "NORMAL", color: GREEN };

export const fridgeStory: Story = {
  id: "fridge",
  label: "Refrigerator",
  mp4: "/allegiant/hero.mp4",
  webm: "/allegiant/hero.webm",
  poster: "/allegiant/hero-poster.jpg",
  endImage: "/allegiant/hero-end.jpg",
  duration: 24.9,
  aspect: 464 / 688,
  endAt: 20.7,
  totalSteps: 6,
  phases: [
    { id: "intro", a: 0.2, b: 2.2, title: "Ever wonder what's inside?" },
    { id: "scan", a: 2.2, b: 5.6, title: "X-ray scan", note: "Looking inside without opening a single panel.", status: { label: "SCANNING", color: CY } },
    { id: "board", a: 5.6, b: 7.0, step: 1, title: "Main control board", note: "The brain: temperatures, fans and defrost cycles.", status: normal },
    { id: "filter", a: 7.0, b: 8.0, step: 2, title: "Water filter", note: "Cleans the line that feeds ice and water.", status: normal },
    { id: "ice", a: 8.0, b: 9.4, step: 3, title: "Ice maker", note: "Fills, freezes and ejects the cubes.", status: normal },
    { id: "fan", a: 9.4, b: 10.4, step: 4, title: "Evaporator fan", note: "Pushes cold air through both compartments.", status: normal },
    { id: "comp", a: 10.4, b: 11.4, step: 5, title: "Compressor", note: "Pumps refrigerant around the cooling loop.", status: normal },
    { id: "fault", a: 11.4, b: 14.3, step: 6, title: "Water inlet valve", note: "Worn seal — water leaking behind the unit.", status: { label: "FAULT DETECTED", color: RED } },
    { id: "fix", a: 14.3, b: 19.3, step: 6, title: "Water inlet valve", note: "Swapping in a factory-spec part.", status: { label: "REPAIRING", color: AMBER } },
    { id: "done", a: 19.3, b: 20.7, step: 6, title: "Water inlet valve", note: "New valve fitted. Water flows, leak gone.", status: { label: "REPAIRED ✓", color: GREEN } },
  ],
};

export const dishwasherStory: Story = {
  id: "dishwasher",
  label: "Dishwasher",
  mp4: "/allegiant/dishwasher.mp4",
  webm: "/allegiant/dishwasher.webm",
  poster: "/allegiant/dishwasher-poster.jpg",
  endImage: "/allegiant/dishwasher-end.jpg",
  duration: 24.9,
  aspect: 464 / 688,
  endAt: 20.7,
  totalSteps: 6,
  phases: [
    { id: "intro", a: 0.2, b: 2.0, title: "Dishes still dirty? Water on the floor?" },
    { id: "scan", a: 2.0, b: 5.6, title: "X-ray scan", note: "Seeing the racks, spray arms and pump without taking it apart.", status: { label: "SCANNING", color: CY } },
    { id: "board", a: 5.6, b: 6.6, step: 1, title: "Main control board", note: "Runs every cycle: fill, wash, heat and drain.", status: normal },
    { id: "valve", a: 6.6, b: 8.0, step: 2, title: "Water inlet valve", note: "Lets the right amount of water in.", status: normal },
    { id: "arm", a: 8.0, b: 9.6, step: 3, title: "Spray arm", note: "Blasts water at every rack.", status: normal },
    { id: "heater", a: 9.6, b: 10.6, step: 4, title: "Heating element", note: "Heats the water and dries the load.", status: normal },
    { id: "circ", a: 10.6, b: 11.4, step: 5, title: "Circulation pump", note: "Keeps the water moving through the arms.", status: normal },
    { id: "fault", a: 11.4, b: 14.3, step: 6, title: "Drain pump", note: "Clogged with debris — water can't drain and leaks.", status: { label: "FAULT DETECTED", color: RED } },
    { id: "fix", a: 14.3, b: 18.0, step: 6, title: "Drain pump", note: "Clearing the blockage and refitting the pump.", status: { label: "REPAIRING", color: AMBER } },
    { id: "done", a: 18.0, b: 20.7, step: 6, title: "Drain pump", note: "Clear and flowing. No more standing water.", status: { label: "REPAIRED ✓", color: GREEN } },
  ],
  endTitle: "Dishwasher not draining or cleaning?",
  endBody: "Vadim finds the real cause and fixes it: pumps, spray arms, valves and boards.",
};

export const washerStory: Story = {
  id: "washer",
  label: "Washer",
  mp4: "/allegiant/washer.mp4",
  webm: "/allegiant/washer.webm",
  poster: "/allegiant/washer-poster.jpg",
  endImage: "/allegiant/washer-end.jpg",
  duration: 17.8,
  aspect: 720 / 1280,
  endAt: 16.0,
  totalSteps: 5,
  phases: [
    { id: "intro", a: 0.2, b: 3.0, title: "Won't drain? Clothes still soaking?" },
    { id: "board", a: 3.1, b: 4.3, step: 1, title: "Main control board", note: "Runs every wash, rinse and spin cycle.", status: normal },
    { id: "valves", a: 4.3, b: 5.6, step: 2, title: "Water inlet valves", note: "Fill the drum with hot and cold water.", status: normal },
    { id: "drum", a: 5.6, b: 7.2, step: 3, title: "Drum", note: "Spins and tumbles your clothes.", status: normal },
    { id: "motor", a: 7.2, b: 8.2, step: 4, title: "Motor & belt", note: "Drives the drum at every speed.", status: normal },
    { id: "pump", a: 8.2, b: 8.7, step: 5, title: "Drain pump", note: "Pushes dirty water out to the drain.", status: normal },
    { id: "fault", a: 8.7, b: 11.8, step: 5, title: "Drain pump", note: "A sock and a coin are jamming it — the water can't leave.", status: { label: "FAULT DETECTED", color: RED } },
    { id: "fix", a: 11.8, b: 13.8, step: 5, title: "Drain pump", note: "Pulling out the blockage and refitting the pump.", status: { label: "REPAIRING", color: AMBER } },
    { id: "done", a: 13.8, b: 16.0, step: 5, title: "Drain pump", note: "Clear and draining. Spin cycle back to normal.", status: { label: "REPAIRED ✓", color: GREEN } },
  ],
  endTitle: "Washer won't drain or spin?",
  endBody: "Vadim finds the real cause and fixes it: pumps, belts, valves and boards.",
};
