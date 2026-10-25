/**
 * Escaneos en video (rayos X → falla → reparación) por aparato, para el
 * recorrido por la casa (/allegiant/tour). Cada video se genera aparte y se une
 * con fundidos en un mp4/webm sin audio (public/allegiant/scan/).
 *
 * Para sumar un aparato: montar el video, ponerlo en public/allegiant/scan/,
 * añadir su historia aquí y enlazarla en `scanStoryFor`.
 * Los tiempos (a, b) son segundos del video final.
 */

import type { ApplianceKind, Lang } from "./allegiant";

export type StatusKey = "scan" | "normal" | "fault" | "fix" | "done";

type Text = { en: string; es: string };

export type Phase = {
  id: string;
  a: number;
  b: number;
  status?: StatusKey;
  /** Paso numerado de la gira de piezas. */
  step?: number;
  title: Text;
  note?: Text;
};

export type Story = {
  id: string;
  mp4: string;
  webm: string;
  poster: string;
  endImage: string;
  duration: number;
  /** Ancho / alto del video. */
  aspect: number;
  /** A partir de este segundo aparece la tarjeta final. */
  endAt: number;
  totalSteps: number;
  phases: Phase[];
  endTitle: Text;
  endBody: Text;
};

export const statusLabels: Record<Lang, Record<StatusKey, string>> = {
  en: { scan: "Scanning", normal: "Normal", fault: "Fault detected", fix: "Repairing", done: "Repaired ✓" },
  es: { scan: "Escaneando", normal: "Normal", fault: "Falla detectada", fix: "Reparando", done: "Reparado ✓" },
};

export const statusColors: Record<StatusKey, string> = {
  scan: "#38d6ff",
  normal: "#3dffb0",
  fault: "#ff4d4d",
  fix: "#ffb020",
  done: "#3dffb0",
};

/** Texto de la interfaz del escaneo, por idioma. */
export const scanText: Record<
  Lang,
  {
    button: string;
    close: string;
    play: string;
    pause: string;
    replay: string;
    label: string;
    call: string;
    book: string;
    gallery: { eyebrow: string; h2: string; p: string };
  }
> = {
  en: {
    button: "Watch the scan",
    close: "Close",
    play: "Play",
    pause: "Pause",
    replay: "Replay",
    label: "Allegiant · Internal scan",
    call: "Call",
    book: "Book a repair",
    gallery: {
      eyebrow: "X-ray scans",
      h2: "See what's really going on inside.",
      p: "Real failures, scanned and repaired. Tap one to watch.",
    },
  },
  es: {
    button: "Ver el escaneo",
    close: "Cerrar",
    play: "Reproducir",
    pause: "Pausar",
    replay: "Repetir",
    label: "Allegiant · Escaneo interno",
    call: "Llamar",
    book: "Reservar reparación",
    gallery: {
      eyebrow: "Escaneos de rayos X",
      h2: "Mira lo que realmente pasa por dentro.",
      p: "Fallas reales, escaneadas y reparadas. Toca una para verla.",
    },
  },
};

const p = (
  id: string,
  a: number,
  b: number,
  status: StatusKey | undefined,
  title: [string, string],
  note?: [string, string],
  step?: number,
): Phase => ({
  id,
  a,
  b,
  status,
  step,
  title: { en: title[0], es: title[1] },
  note: note ? { en: note[0], es: note[1] } : undefined,
});

const fridgeStory: Story = {
  id: "fridge",
  mp4: "/allegiant/scan/fridge.mp4",
  webm: "/allegiant/scan/fridge.webm",
  poster: "/allegiant/scan/fridge-poster.jpg",
  endImage: "/allegiant/scan/fridge-end.jpg",
  duration: 24.9,
  aspect: 464 / 688,
  endAt: 20.7,
  totalSteps: 6,
  phases: [
    p("intro", 0.2, 2.2, undefined, ["Ever wonder what's inside?", "¿Te has preguntado qué hay dentro?"]),
    p("scan", 2.2, 5.6, "scan", ["X-ray scan", "Escaneo de rayos X"], ["Looking inside without opening a single panel.", "Mirando por dentro sin abrir un solo panel."]),
    p("board", 5.6, 7.0, "normal", ["Main control board", "Placa de control principal"], ["The brain: temperatures, fans and defrost cycles.", "El cerebro: temperaturas, ventiladores y ciclos de descongelado."], 1),
    p("filter", 7.0, 8.0, "normal", ["Water filter", "Filtro de agua"], ["Cleans the line that feeds ice and water.", "Limpia la línea que alimenta el hielo y el agua."], 2),
    p("ice", 8.0, 9.4, "normal", ["Ice maker", "Máquina de hielo"], ["Fills, freezes and ejects the cubes.", "Llena, congela y expulsa los cubos."], 3),
    p("fan", 9.4, 10.4, "normal", ["Evaporator fan", "Ventilador del evaporador"], ["Pushes cold air through both compartments.", "Empuja el aire frío por ambos compartimentos."], 4),
    p("comp", 10.4, 11.4, "normal", ["Compressor", "Compresor"], ["Pumps refrigerant around the cooling loop.", "Bombea el refrigerante por el circuito de frío."], 5),
    p("fault", 11.4, 14.3, "fault", ["Water inlet valve", "Válvula de entrada de agua"], ["Worn seal — water leaking behind the unit.", "Sello desgastado: el agua gotea detrás del aparato."], 6),
    p("fix", 14.3, 19.3, "fix", ["Water inlet valve", "Válvula de entrada de agua"], ["Swapping in a factory-spec part.", "Cambiamos la pieza por una de especificación de fábrica."], 6),
    p("done", 19.3, 20.7, "done", ["Water inlet valve", "Válvula de entrada de agua"], ["New valve fitted. Water flows, leak gone.", "Válvula nueva instalada. El agua fluye y la fuga desapareció."], 6),
  ],
  endTitle: { en: "Fridge not cooling or leaking?", es: "¿El refrigerador no enfría o gotea?" },
  endBody: {
    en: "Vadim finds the real cause and fixes it: valves, fans, compressors and boards.",
    es: "Vadim encuentra la causa real y la repara: válvulas, ventiladores, compresores y placas.",
  },
};

const dishwasherStory: Story = {
  id: "dishwasher",
  mp4: "/allegiant/scan/dishwasher.mp4",
  webm: "/allegiant/scan/dishwasher.webm",
  poster: "/allegiant/scan/dishwasher-poster.jpg",
  endImage: "/allegiant/scan/dishwasher-end.jpg",
  duration: 24.9,
  aspect: 464 / 688,
  endAt: 20.7,
  totalSteps: 6,
  phases: [
    p("intro", 0.2, 2.0, undefined, ["Dishes still dirty? Water on the floor?", "¿Platos sucios? ¿Agua en el piso?"]),
    p("scan", 2.0, 5.6, "scan", ["X-ray scan", "Escaneo de rayos X"], ["Seeing the racks, spray arms and pump without taking it apart.", "Vemos las rejillas, los brazos y la bomba sin desarmarlo."]),
    p("board", 5.6, 6.6, "normal", ["Main control board", "Placa de control principal"], ["Runs every cycle: fill, wash, heat and drain.", "Maneja cada ciclo: llenado, lavado, calor y desagüe."], 1),
    p("valve", 6.6, 8.0, "normal", ["Water inlet valve", "Válvula de entrada de agua"], ["Lets the right amount of water in.", "Deja pasar la cantidad justa de agua."], 2),
    p("arm", 8.0, 9.6, "normal", ["Spray arm", "Brazo rociador"], ["Blasts water at every rack.", "Lanza agua a cada rejilla."], 3),
    p("heater", 9.6, 10.6, "normal", ["Heating element", "Resistencia"], ["Heats the water and dries the load.", "Calienta el agua y seca la carga."], 4),
    p("circ", 10.6, 11.4, "normal", ["Circulation pump", "Bomba de circulación"], ["Keeps the water moving through the arms.", "Mantiene el agua en movimiento por los brazos."], 5),
    p("fault", 11.4, 14.3, "fault", ["Drain pump", "Bomba de desagüe"], ["Clogged with debris — water can't drain and leaks.", "Tapada con residuos: el agua no sale y gotea."], 6),
    p("fix", 14.3, 18.0, "fix", ["Drain pump", "Bomba de desagüe"], ["Clearing the blockage and refitting the pump.", "Limpiamos la obstrucción y volvemos a montar la bomba."], 6),
    p("done", 18.0, 20.7, "done", ["Drain pump", "Bomba de desagüe"], ["Clear and flowing. No more standing water.", "Libre y drenando. Se acabó el agua estancada."], 6),
  ],
  endTitle: { en: "Dishwasher not draining or cleaning?", es: "¿El lavavajillas no drena o no limpia?" },
  endBody: {
    en: "Vadim finds the real cause and fixes it: pumps, spray arms, valves and boards.",
    es: "Vadim encuentra la causa real y la repara: bombas, brazos, válvulas y placas.",
  },
};

const washerStory: Story = {
  id: "washer",
  mp4: "/allegiant/scan/washer.mp4",
  webm: "/allegiant/scan/washer.webm",
  poster: "/allegiant/scan/washer-poster.jpg",
  endImage: "/allegiant/scan/washer-end.jpg",
  duration: 17.8,
  aspect: 720 / 1280,
  endAt: 16.0,
  totalSteps: 5,
  phases: [
    p("intro", 0.2, 3.0, undefined, ["Won't drain? Clothes still soaking?", "¿No desagua? ¿La ropa sigue empapada?"]),
    p("board", 3.1, 4.3, "normal", ["Main control board", "Placa de control principal"], ["Runs every wash, rinse and spin cycle.", "Maneja cada ciclo de lavado, enjuague y centrifugado."], 1),
    p("valves", 4.3, 5.6, "normal", ["Water inlet valves", "Válvulas de entrada de agua"], ["Fill the drum with hot and cold water.", "Llenan el tambor con agua fría y caliente."], 2),
    p("drum", 5.6, 7.2, "normal", ["Drum", "Tambor"], ["Spins and tumbles your clothes.", "Gira y voltea tu ropa."], 3),
    p("motor", 7.2, 8.2, "normal", ["Motor & belt", "Motor y correa"], ["Drives the drum at every speed.", "Mueve el tambor a todas las velocidades."], 4),
    p("pump", 8.2, 8.7, "normal", ["Drain pump", "Bomba de desagüe"], ["Pushes dirty water out to the drain.", "Empuja el agua sucia hacia el drenaje."], 5),
    p("fault", 8.7, 11.8, "fault", ["Drain pump", "Bomba de desagüe"], ["A sock and a coin are jamming it — the water can't leave.", "Una media y una moneda la atascan: el agua no puede salir."], 5),
    p("fix", 11.8, 13.8, "fix", ["Drain pump", "Bomba de desagüe"], ["Pulling out the blockage and refitting the pump.", "Sacamos la obstrucción y volvemos a montar la bomba."], 5),
    p("done", 13.8, 16.0, "done", ["Drain pump", "Bomba de desagüe"], ["Clear and draining. Spin cycle back to normal.", "Libre y drenando. El centrifugado vuelve a la normalidad."], 5),
  ],
  endTitle: { en: "Washer won't drain or spin?", es: "¿La lavadora no drena o no centrifuga?" },
  endBody: {
    en: "Vadim finds the real cause and fixes it: pumps, belts, valves and boards.",
    es: "Vadim encuentra la causa real y la repara: bombas, correas, válvulas y placas.",
  },
};


const dryerStory: Story = {
  id: "dryer",
  mp4: "/allegiant/scan/dryer.mp4",
  webm: "/allegiant/scan/dryer.webm",
  poster: "/allegiant/scan/dryer-poster.jpg",
  endImage: "/allegiant/scan/dryer-end.jpg",
  duration: 24.9,
  aspect: 720 / 1280,
  endAt: 20.7,
  totalSteps: 5,
  phases: [
    p("intro", 0.2, 2.0, undefined, ["Won't heat? Clothes still damp?", "¿No calienta? ¿La ropa sigue húmeda?"]),
    p("scan", 2.0, 5.6, "scan", ["X-ray scan", "Escaneo de rayos X"], ["Seeing the drum, blower and heater without taking it apart.", "Vemos el tambor, el ventilador y la resistencia sin desarmarla."]),
    p("board", 5.6, 6.8, "normal", ["Main control board", "Placa de control principal"], ["Reads the sensors and runs the drying cycle.", "Lee los sensores y maneja el ciclo de secado."], 1),
    p("drum", 6.8, 8.0, "normal", ["Drum", "Tambor"], ["Tumbles the clothes so hot air reaches every fold.", "Voltea la ropa para que el aire caliente llegue a todo."], 2),
    p("heater", 8.0, 9.6, "normal", ["Heating element", "Resistencia"], ["Makes the heat that dries the load.", "Genera el calor que seca la carga."], 3),
    p("blower", 9.6, 11.4, "normal", ["Blower & exhaust", "Ventilador y salida de aire"], ["Pushes hot air through the clothes and out the vent.", "Empuja el aire caliente por la ropa y hacia la salida."], 4),
    p("fault", 11.4, 14.3, "fault", ["Heating element", "Resistencia"], ["Broken coil — it sparks and the air stays cold.", "Bobina rota: chispea y el aire sale frío."], 5),
    p("fix", 14.3, 17.9, "fix", ["Heating element", "Resistencia"], ["Removing the burnt coil and fitting a new element.", "Sacamos la bobina quemada y montamos una resistencia nueva."], 5),
    p("done", 17.9, 20.7, "done", ["Heating element", "Resistencia"], ["New element fitted. Hot air flows again.", "Resistencia nueva instalada. El aire caliente vuelve a fluir."], 5),
  ],
  endTitle: { en: "Dryer not heating or taking forever?", es: "¿La secadora no calienta o tarda una eternidad?" },
  endBody: {
    en: "Vadim finds the real cause and fixes it: heating elements, blowers, vents and boards.",
    es: "Vadim encuentra la causa real y la repara: resistencias, ventiladores, ductos y placas.",
  },
};

/** Escaneo en video de cada tipo de aparato del recorrido (si existe). */
export function scanStoryFor(kind: ApplianceKind): Story | null {
  switch (kind) {
    case "fridge":
      return fridgeStory;
    case "dish":
      return dishwasherStory;
    case "washer":
      return washerStory;
    case "dryer":
      return dryerStory;
    default:
      return null;
  }
}

/** Los escaneos disponibles, en el orden en que aparecen en la home. */
export const scanGallery: { kind: ApplianceKind; story: Story }[] = [
  { kind: "fridge", story: fridgeStory },
  { kind: "dish", story: dishwasherStory },
  { kind: "washer", story: washerStory },
  { kind: "dryer", story: dryerStory },
];
