/**
 * roomwalk — convierte una pila de secciones en un piso que se recorre.
 *
 * La idea: el scroll no desplaza la página, hace andar a una cámara por un
 * plano de habitaciones. Va montado sobre el scroll NATIVO (un espaciador con
 * la altura del recorrido), así que rueda del ratón, barra, teclado, trackpad
 * y gestos táctiles funcionan sin interceptar un solo evento.
 *
 * Ejes, los de CSS: x a la derecha, y hacia ABAJO, z hacia el espectador.
 * Rumbo `h`: el frente de la cámara es (sin h, 0, -cos h). h=0 mira al fondo
 * de la pantalla y h positivo gira a la DERECHA.
 *
 * Todo se calcula en metros y sólo se multiplica por `unit` al escribir la
 * transformación, para que el plano se lea como un plano.
 */

const DEG = Math.PI / 180;
const WALLS = ["front", "back", "left", "right", "floor", "ceiling"];

/** @type {Required<import("./roomwalk").RoomWalkOptions>} */
const DEFAULTS = {
  unit: 300,
  eyeHeight: 1.62,
  wallHeight: 2.8,
  roomWidth: 4.2,
  roomDepth: 5.2,
  doorWidth: 1.15,
  doorHeight: 2.15,
  scrollPerMetre: 150,
  smoothing: 0.13,
  lookahead: 2.2,
  stride: 0.78,
  bob: true,
  cullCells: 3,
  autoEnter: true,
  labels: {
    exit: "View as a list",
    enter: "Walk through",
  },
};

const num = (raw, fallback) => {
  const v = Number.parseFloat(raw);
  return Number.isFinite(v) ? v : fallback;
};

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/* -------------------------------------------------------------------------
   Lectura del documento
   ------------------------------------------------------------------------- */

/** Cada `[data-rw-room]` hijo directo de la raíz es una habitación. */
function readRooms(root, opt) {
  return Array.from(root.querySelectorAll(":scope > [data-rw-room]")).map((el) => ({
    el,
    name: el.dataset.rwRoom || "",
    w: num(el.dataset.rwWidth, opt.roomWidth),
    d: num(el.dataset.rwDepth, opt.roomDepth),
    ht: num(el.dataset.rwHeight, opt.wallHeight),
    turn: el.dataset.rwTurn === "left" ? -1 : el.dataset.rwTurn === "right" ? 1 : 0,
    wall: el.dataset.rwWall || "",
  }));
}

/* -------------------------------------------------------------------------
   Trazado del plano
   -------------------------------------------------------------------------

   Regla de oro: en cada junta hay UNA sola pared, y es la que lleva la puerta.
   Si las dos partes dibujasen la suya, coincidirían en el mismo plano y
   parpadearían (z-fighting). Reparto:

     habitación → habitación   la pared del fondo de la anterior
     habitación → esquina      la pared del fondo de la anterior
     esquina    → habitación   la pared frontal de la siguiente

   Por eso una esquina nunca dibuja ni su frente ni su lado de salida. */
function layout(rooms) {
  const cells = [];
  const nodes = [];
  let x = 0;
  let z = 0;
  let h = 0;
  const fwd = () => ({ x: Math.sin(h), z: -Math.cos(h) });

  rooms.forEach((room, i) => {
    const prev = rooms[i - 1];
    const turning = i > 0 && room.turn !== 0;
    let corner = null;

    if (turning) {
      // Rellano cuadrado donde se dobla. No puede ser más ancho que la
      // habitación anterior (es la pared del fondo de ésa la que tapa su
      // frente), ni que la siguiente (cuya pared frontal tapa la salida). De
      // ahí el mínimo: un giro se siente estrecho si una de las dos lo es.
      const cw = Math.min(prev.w, room.w);
      const f = fwd();
      const cx = x + f.x * (cw / 2);
      const cz = z + f.z * (cw / 2);
      corner = {
        kind: "corner",
        name: "",
        x: cx,
        z: cz,
        h,
        w: cw,
        d: cw,
        ht: Math.min(prev.ht, room.ht),
        node: nodes.length,
        faces: {
          front: null,
          back: { door: false },
          left: room.turn === -1 ? null : { door: false },
          right: room.turn === 1 ? null : { door: false },
          floor: { door: false },
          ceiling: { door: false },
        },
      };
      cells.push(corner);
      nodes.push({ x: cx, z: cz });

      h += room.turn * 90 * DEG;
      const g = fwd();
      x = cx + g.x * (cw / 2);
      z = cz + g.z * (cw / 2);
    }

    const f = fwd();
    const cx = x + f.x * (room.d / 2);
    const cz = z + f.z * (room.d / 2);

    // Primer nodo del recorrido: un poco dentro de la primera habitación, para
    // no nacer empotrado en la pared frontal.
    if (i === 0) {
      const lead = Math.min(0.9, room.d * 0.3);
      nodes.push({ x: x + f.x * lead, z: z + f.z * lead });
    }

    cells.push({
      kind: "room",
      name: room.name,
      room,
      corner,
      x: cx,
      z: cz,
      h,
      w: room.w,
      d: room.d,
      ht: room.ht,
      node: nodes.length,
      faces: {
        // Sólo la primera dibuja frente macizo; tras una esquina, frente con puerta.
        front: i === 0 ? { door: false } : turning ? { door: true } : null,
        back: { door: i < rooms.length - 1 },
        left: { door: false },
        right: { door: false },
        floor: { door: false },
        ceiling: { door: false },
      },
    });
    nodes.push({ x: cx, z: cz });

    x = cx + f.x * (room.d / 2);
    z = cz + f.z * (room.d / 2);

    if (i === rooms.length - 1) {
      const tail = Math.min(0.9, room.d * 0.3);
      nodes.push({ x: x - f.x * tail, z: z - f.z * tail });
    }
  });

  return { cells, nodes };
}

/** Polilínea con longitudes acumuladas, para muestrear por distancia andada.
 *  `nodeS[i]` es cuántos metros hay que andar para llegar al nodo `i`. */
function buildPath(nodes) {
  const segs = [];
  const nodeS = [0];
  let total = 0;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    if (len >= 1e-6) {
      segs.push({ a, b, len, start: total });
      total += len;
    }
    nodeS.push(total);
  }
  return { segs, total, nodes, nodeS };
}

/** Punto a `s` metros del inicio. Fuera de los extremos extrapola, para que
 *  la vista adelantada siga definida al principio y al final del paseo. */
function pointAt(path, s) {
  const { segs } = path;
  if (!segs.length) return { x: 0, z: 0 };
  let i = 0;
  while (i < segs.length - 1 && s > segs[i].start + segs[i].len) i++;
  const seg = segs[i];
  const t = (s - seg.start) / seg.len;
  return {
    x: seg.a.x + (seg.b.x - seg.a.x) * t,
    z: seg.a.z + (seg.b.z - seg.a.z) * t,
  };
}

/**
 * Postura de la cámara a `s`. El rumbo sale de mirar por delante y por detrás
 * del punto actual: eso solo ya redondea las esquinas, sin geometría extra, y
 * hace que la cabeza empiece a girar ANTES de llegar al rellano, como al andar.
 */
function poseAt(path, s, look) {
  const back = pointAt(path, s - look * 0.5);
  const here = pointAt(path, s);
  const ahead = pointAt(path, s + look);
  const dx = ahead.x - back.x;
  const dz = ahead.z - back.z;
  return {
    x: here.x * 0.5 + back.x * 0.25 + ahead.x * 0.25,
    z: here.z * 0.5 + back.z * 0.25 + ahead.z * 0.25,
    h: Math.abs(dx) + Math.abs(dz) < 1e-9 ? 0 : Math.atan2(dx, -dz),
  };
}

/* -------------------------------------------------------------------------
   Construcción de las caras
   ------------------------------------------------------------------------- */

/** Tamaño (m) y transformación de una cara dentro de su habitación. */
function faceGeometry(kind, w, d, ht, eye, unit) {
  const floorY = eye * unit;
  const ceilY = (eye - ht) * unit;
  const midY = (eye - ht / 2) * unit;
  const W = w * unit;
  const D = d * unit;
  const H = ht * unit;
  const p = (n) => `${n.toFixed(2)}px`;

  switch (kind) {
    case "back":
      return { w: W, h: H, t: `translate3d(0px, ${p(midY)}, ${p(-D)})` };
    case "front":
      return { w: W, h: H, t: `translate3d(0px, ${p(midY)}, 0px) rotateY(180deg)` };
    case "left":
      return { w: D, h: H, t: `translate3d(${p(-W / 2)}, ${p(midY)}, ${p(-D / 2)}) rotateY(90deg)` };
    case "right":
      return { w: D, h: H, t: `translate3d(${p(W / 2)}, ${p(midY)}, ${p(-D / 2)}) rotateY(-90deg)` };
    case "floor":
      return { w: W, h: D, t: `translate3d(0px, ${p(floorY)}, ${p(-D / 2)}) rotateX(90deg)` };
    default:
      return { w: W, h: D, t: `translate3d(0px, ${p(ceilY)}, ${p(-D / 2)}) rotateX(-90deg)` };
  }
}

/**
 * Hueco de puerta. CSS no sabe agujerear un elemento, pero un polígono que
 * baja por el borde inferior, entra al vano y vuelve a salir deja exactamente
 * una puerta — sin dividir la pared en tres trozos.
 */
function doorClip(faceWidth, ht, opt) {
  const half = clamp((opt.doorWidth / faceWidth) * 50, 4, 46);
  const l = (50 - half).toFixed(2);
  const r = (50 + half).toFixed(2);
  const top = clamp(((ht - opt.doorHeight) / ht) * 100, 2, 60).toFixed(2);
  return `polygon(0% 0%, 0% 100%, ${l}% 100%, ${l}% ${top}%, ${r}% ${top}%, ${r}% 100%, 100% 100%, 100% 0%)`;
}

/* -------------------------------------------------------------------------
   Motor
   ------------------------------------------------------------------------- */

/**
 * @param {HTMLElement} root contenedor con las secciones `[data-rw-room]`
 * @param {import("./roomwalk").RoomWalkOptions} [userOptions]
 */
export function createRoomWalk(root, userOptions = {}) {
  const opt = { ...DEFAULTS, ...userOptions, labels: { ...DEFAULTS.labels, ...userOptions.labels } };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  let built = null;
  let frame = 0;
  let sTarget = 0;
  let sCurrent = 0;
  let lastH = 0;
  let nearest = -1;

  root.classList.add("rw");

  // Los controles viven fuera del andamiaje: sobreviven a entrar y salir.
  const controls = document.createElement("div");
  controls.className = "rw-ui";
  const where = document.createElement("span");
  where.className = "rw-where";
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "rw-exit";
  toggle.addEventListener("click", () => (built ? exit() : enter()));
  controls.append(where, toggle);

  const progress = document.createElement("div");
  progress.className = "rw-progress";

  /* --- construir --------------------------------------------------------- */

  function build() {
    const rooms = readRooms(root, opt);
    if (!rooms.length) return null;

    const { cells, nodes } = layout(rooms);
    const path = buildPath(nodes);
    const moved = [];

    const viewport = document.createElement("div");
    viewport.className = "rw-viewport";
    const world = document.createElement("div");
    world.className = "rw-world";
    const vignette = document.createElement("div");
    vignette.className = "rw-fog";
    viewport.append(world, vignette);

    const track = document.createElement("div");
    track.className = "rw-track";

    cells.forEach((cell, index) => {
      const box = document.createElement("div");
      box.className = "rw-room";
      box.style.transform =
        `translate3d(${(cell.x * opt.unit).toFixed(2)}px, 0px, ${(cell.z * opt.unit).toFixed(2)}px) ` +
        `rotateY(${(-cell.h / DEG).toFixed(3)}deg)`;

      cell.faceEls = {};
      WALLS.forEach((kind) => {
        const spec = cell.faces[kind];
        if (!spec) return;
        const geo = faceGeometry(kind, cell.w, cell.d, cell.ht, opt.eyeHeight, opt.unit);
        const face = document.createElement("div");
        face.className = `rw-face rw-face--${kind}`;
        face.style.width = `${geo.w.toFixed(2)}px`;
        face.style.height = `${geo.h.toFixed(2)}px`;
        face.style.marginLeft = `${(-geo.w / 2).toFixed(2)}px`;
        face.style.marginTop = `${(-geo.h / 2).toFixed(2)}px`;
        face.style.transform = geo.t;
        if (spec.door) {
          face.style.clipPath = doorClip(kind === "left" || kind === "right" ? cell.d : cell.w, cell.ht, opt);
        }
        cell.faceEls[kind] = { el: face, door: !!spec.door };
        box.append(face);
      });

      // El contenido del autor se muda a las paredes. Sigue siendo el mismo
      // DOM: los enlaces se pulsan y el texto se selecciona igual.
      if (cell.kind === "room") {
        const section = cell.room.el;
        const fallback = pickDefaultWall(cell, index);
        Array.from(section.children).forEach((child) => {
          const asked = child instanceof HTMLElement ? child.dataset.rwPanel : "";
          const named = asked || cell.room.wall;
          const target = resolveWall(cell, named || fallback, fallback, !!named);
          if (!target) return;
          moved.push({ node: child, parent: section, next: child.nextSibling });
          placePanel(child, target);
        });
        section.hidden = true;
      }

      world.append(box);
      cell.el = box;
    });

    root.append(viewport, track, progress, controls);
    root.setAttribute("data-rw-active", "");

    const cellS = cells.map((c) => path.nodeS[c.node] ?? 0);
    return { cells, path, cellS, viewport, world, track, moved };
  }

  /** Pared por defecto: el fondo si es macizo, si no alterna izquierda/derecha
   *  para que el contenido no se amontone siempre en el mismo lado. */
  function pickDefaultWall(cell, index) {
    if (cell.faces.back && !cell.faces.back.door) return "back";
    return index % 2 === 0 ? "right" : "left";
  }

  /**
   * Una pared con puerta recorta a sus hijos por el vano, así que por defecto
   * nunca se elige sola. Pero si el autor la pide por su nombre se respeta: el
   * dintel sobre la puerta es justo donde va un rótulo (con `data-rw-y` bajo).
   */
  function resolveWall(cell, wanted, fallback, explicit) {
    // Al doblar acabas mirando de frente al muro del rellano: a 1,8 m el suelo
    // ya cae fuera del campo de visión, así que llena la pantalla. Es el mejor
    // sitio de todo el paseo para una pieza grande, y `turn` lo abre al autor.
    if (wanted === "turn") {
      const face = cell.corner && cell.corner.faceEls.back;
      if (face) return face.el;
    }
    const first = cell.faceEls[wanted];
    if (explicit && first) return first.el;
    for (const kind of [wanted, fallback, "left", "right", "back", "front", "floor"]) {
      const found = cell.faceEls[kind];
      if (found && !found.door) return found.el;
    }
    return null;
  }

  function placePanel(node, face) {
    if (!(node instanceof HTMLElement)) {
      face.append(node);
      return;
    }
    node.classList.add("rw-panel");
    const across = clamp(num(node.dataset.rwAt, 0.5), 0, 1);
    const down = clamp(num(node.dataset.rwY, face.classList.contains("rw-face--floor") ? 0.5 : 0.44), 0, 1);
    node.style.left = `${(across * 100).toFixed(2)}%`;
    node.style.top = `${(down * 100).toFixed(2)}%`;
    node.style.width = node.dataset.rwSpan
      ? `${(clamp(num(node.dataset.rwSpan, 0.7), 0.05, 1) * 100).toFixed(2)}%`
      : "";
    face.append(node);
  }

  /* --- desmontar --------------------------------------------------------- */

  function teardown() {
    if (!built) return;
    // En orden INVERSO, a propósito: `next` es el hermano que tenía el nodo
    // antes de mudarse, y también se mudó. Yendo de atrás hacia delante ya
    // está de vuelta en su sitio cuando se le necesita como referencia.
    // (En HTML escrito a mano los saltos de línea dejan nodos de texto que
    // sirven de ancla y lo disimulan; en JSX no hay ninguno.)
    built.moved
      .slice()
      .reverse()
      .forEach(({ node, parent, next }) => {
        if (node instanceof HTMLElement) {
          node.classList.remove("rw-panel");
          node.style.left = "";
          node.style.top = "";
          node.style.width = "";
        }
        parent.insertBefore(node, next && next.parentNode === parent ? next : null);
      });
    built.cells.forEach((cell) => {
      if (cell.kind === "room") cell.room.el.hidden = false;
    });
    built.viewport.remove();
    built.track.remove();
    progress.remove();
    root.removeAttribute("data-rw-active");
    built = null;
  }

  /* --- cámara ------------------------------------------------------------ */

  // Se mide al entrar y al redimensionar, nunca dentro del scroll: pedir un
  // rect en cada evento fuerza un reflujo por fotograma.
  let trackOffset = 0;
  function trackTop() {
    return trackOffset;
  }

  function perspective() {
    // Un campo de visión cómodo: vertical ~57° en pantallas anchas, y se abre
    // en móvil para que una habitación de 4 m no resulte un pasillo.
    return Math.max(300, Math.min(window.innerHeight * 0.92, window.innerWidth * 0.72));
  }

  function measure() {
    if (!built) return;
    built.viewport.style.perspective = `${perspective().toFixed(0)}px`;
    built.track.style.height = `${(built.path.total * opt.scrollPerMetre + window.innerHeight).toFixed(0)}px`;
    trackOffset = built.track.getBoundingClientRect().top + window.scrollY;
    readScroll();
  }

  function readScroll() {
    if (!built) return;
    const travelled = (window.scrollY - trackTop()) / opt.scrollPerMetre;
    sTarget = clamp(travelled, 0, built.path.total);
    start();
  }

  function draw() {
    frame = 0;
    if (!built) return;

    const gap = sTarget - sCurrent;
    // El retardo es lo que da el deslizamiento: la cámara persigue al scroll.
    sCurrent += Math.abs(gap) < 0.0008 ? gap : gap * opt.smoothing;

    const pose = poseAt(built.path, sCurrent, opt.lookahead);
    // Sin desenrollar, cruzar ±180° daría un latigazo de una vuelta entera.
    const h = pose.h + Math.round((lastH - pose.h) / (Math.PI * 2)) * Math.PI * 2;
    lastH = h;

    let lift = 0;
    let roll = 0;
    let pitch = 0;
    if (opt.bob && !reduced.matches) {
      // Un paso por zancada: la cabeza sube y baja al doble de frecuencia que
      // el balanceo lateral, que es lo que hace el cuerpo al caminar.
      const phase = (sCurrent / opt.stride) * Math.PI;
      lift = Math.sin(phase * 2) * 0.012;
      roll = Math.sin(phase) * 0.3;
      pitch = Math.cos(phase * 2) * 0.13;
    }

    built.world.style.transform =
      `translateZ(${perspective().toFixed(0)}px) ` +
      `rotateZ(${roll.toFixed(3)}deg) rotateX(${pitch.toFixed(3)}deg) rotateY(${(h / DEG).toFixed(3)}deg) ` +
      `translate3d(${(-pose.x * opt.unit).toFixed(2)}px, ${(-lift * opt.unit).toFixed(2)}px, ${(-pose.z * opt.unit).toFixed(2)}px)`;

    progress.style.setProperty(
      "--rw-progress",
      built.path.total ? (sCurrent / built.path.total).toFixed(4) : "0",
    );

    cull();

    if (Math.abs(sTarget - sCurrent) > 0.0008) start();
  }

  function cull() {
    let best = 0;
    let bestErr = Infinity;
    built.cellS.forEach((s, i) => {
      const err = Math.abs(s - sCurrent);
      if (err < bestErr) {
        bestErr = err;
        best = i;
      }
    });
    if (best === nearest) return;
    nearest = best;

    built.cells.forEach((cell, i) => {
      const far = opt.cullCells > 0 && Math.abs(i - best) > opt.cullCells;
      cell.el.toggleAttribute("data-rw-far", far);
    });

    for (let i = best; i >= 0; i--) {
      if (built.cells[i].kind === "room") {
        where.textContent = built.cells[i].name;
        break;
      }
    }
  }

  function start() {
    if (!frame && built) frame = requestAnimationFrame(draw);
  }

  /* --- accesibilidad ----------------------------------------------------- */

  // Tabular hasta un enlace que está tres habitaciones más allá debe llevarte
  // hasta allí, no dejarte mirando una pared.
  function onFocusIn(event) {
    if (!built) return;
    const face = event.target instanceof Element ? event.target.closest(".rw-room") : null;
    if (!face) return;
    const index = built.cells.findIndex((cell) => cell.el === face);
    if (index < 0) return;
    window.scrollTo({ top: trackTop() + built.cellS[index] * opt.scrollPerMetre });
  }

  /* --- ciclo de vida ----------------------------------------------------- */

  function enter() {
    if (built) return;
    built = build();
    if (!built) return;
    toggle.textContent = opt.labels.exit;
    sCurrent = 0;
    sTarget = 0;
    lastH = 0;
    nearest = -1;
    measure();
    sCurrent = sTarget;
    draw();
  }

  function exit() {
    teardown();
    toggle.textContent = opt.labels.enter;
    where.textContent = "";
    root.append(controls);
  }

  const onScroll = () => readScroll();
  const onResize = () => measure();
  const onMotionChange = () => {
    if (reduced.matches) exit();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  root.addEventListener("focusin", onFocusIn);
  reduced.addEventListener("change", onMotionChange);

  if (opt.autoEnter && !reduced.matches) enter();
  else exit();

  return {
    enter,
    exit,
    isActive: () => !!built,
    destroy() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("focusin", onFocusIn);
      reduced.removeEventListener("change", onMotionChange);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      teardown();
      controls.remove();
      root.classList.remove("rw");
    },
  };
}

export default createRoomWalk;
